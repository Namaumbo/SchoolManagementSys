<?php

namespace App\Services;
use App\Exceptions\GeneralException;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Level;
use App\Models\Allocationable;
use App\Models\Department;
use App\Models\UserLoginEvent;
use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\Foundation\Application;
use Psy\Util\Json;
use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UserService
{
    private function validateUser(Request $request, bool $isUpdate = false, ?int $id = null)
    {
        $rules = [
            'title' => 'required|string',
            'firstname' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'sex' => 'required|string',
            'village' => 'required|string',
            'traditional_authority' => 'required|string',
            'district' => 'required|string',
            'role_name' => 'required|string',
            'subjects' => 'array',
            'subjects.*' => 'exists:subjects,id',
            'departments' => 'array',
            'departments.*' => 'exists:departments,id',
            'school_id' => 'nullable|integer|exists:school_information,id',
        ];

        if ($isUpdate) {
            $rules['email'] .= ',' . $id;
            unset($rules['password']);
        }

        return Validator::make($request->all(), $rules);
    }

    public function getAll(Request $request): JsonResponse
    {
        try {
            $perPage = $request->integer('per_page', 15);
            $perPage = min(max($perPage, 1), 100);

            $paginator = User::with(['departments'])->orderBy('id')->paginate($perPage);

            Log::info('Fetched paginated users', [
                'current_page' => $paginator->currentPage(),
                'total' => $paginator->total(),
            ]);

            return UserResource::collection($paginator)
                ->additional([
                    'message' => 'User details retrieved successfully',
                    'status' => 'success',
                ])
                ->response();
        } catch (\Exception $e) {
            Log::error('Failed to retrieve users', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to retrieve users',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Creating user with subjects');

            $validator = $this->validateUser($request);

            if ($validator->fails()) {
                Log::warning('User validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $schoolId = $this->resolveSchoolId($request);
            if (!$schoolId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => ['school_id' => ['The school id field is required.']],
                ], 422);
            }

            $user = User::where('email', $request->input('email'))->first();

            if ($user) {
                Log::info('User already exists', ['email' => $user->email]);
                return response()->json(['message' => 'User already exists', 'email' => $user], 409);
            }

            $newUser = new User();
            $this->fillUserDetails($request, $newUser);
            $newUser->save();

            Log::info('User created successfully', ['user_id' => $newUser->id]);

            if ($request->has('departments')) {
                $newUser->departments()->syncWithoutDetaching($request->input('departments'));
                Log::info('Departments assigned to user', ['user_id' => $newUser->id, 'departments' => $request->input('departments')]);
            }

            if ($request->has('subjects')) {
                $newUser->subjects()->syncWithoutDetaching($request->input('subjects'));
                Log::info('Subjects assigned to user', ['user_id' => $newUser->id, 'subjects' => $request->input('subjects')]);
            }

            return response()->json([
                'message' => 'User saved successfully',
                'user' => $newUser,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to save user', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'User not saved',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $user = User::with('departments')->findOrFail($id);
            Log::info('Fetched user details successfully', ['user_id' => $id]);

            return response()->json([
                'message' => 'User details retrieved successfully',
                'status' => 'success',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('User not found', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'User not found',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Detach user from all departments
            $user->departments()->detach();
            Log::info('User detached from all departments', ['user_id' => $id]);

            // Delete the user
            $user->delete();
            Log::info('User deleted successfully', ['user_id' => $id]);

            return response()->json([
                'message' => 'User deleted successfully',
                'status' => 'success',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete user', ['error' => $e->getMessage(), 'user_id' => $id]);
            return response()->json([
                'message' => 'Failed to delete user',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), ["email" => "required|string", "password" => "required"]);

        if ($validator->fails()) {
            Log::warning('Login validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                "status" => "error",
                "message" => "Validation Error",
                "errors" => $validator->errors(),
            ], 422);
        }

        if (!Auth::attempt($request->only("email", "password"))) {
            Log::warning('Invalid login attempt', ['email' => $request->input('email')]);
            return response()->json([
                "status" => "error",
                "message" => "Invalid credentials",
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('Token')->plainTextToken;
        $cookie = cookie('jwt', $token, 30 * 1);

        try {
            UserLoginEvent::create([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'logged_in_at' => now(),
            ]);
            $user->last_login = now();
            $user->login_count = (int) ($user->login_count ?? 0) + 1;
            $user->save();

        } catch (\Throwable $eventError) {
            Log::warning('Failed to save login event', [
                'user_id' => $user->id,
                'error' => $eventError->getMessage(),
            ]);
        } catch (\Throwable $counterError) {
            Log::warning('Failed to update login counters', [
                'user_id' => $user->id,
                'error' => $counterError->getMessage(),
            ]);
        }

        Log::info('Collecting user metadata successfully', ['user_id' => $user->id]);

        $response = [
            "status" => "success",
            "message" => "System successfully logged " . $user->firstname,
            "access_token" => $token,
            "token_type" => "bearer",
            "user" => $user,
        ];

        if (strtolower($user->role_name) === 'teacher') {
            $subjects = $user->subjects()->withCount('students')->get();
            $response['teacher_data'] = [
                'subjects' => $subjects,
                'student_count' => $subjects->sum('students_count'),
            ];
        }

        return response()->json($response)->withCookie($cookie);
    }

    public function getLoginTimeline(Request $request): JsonResponse
    {
        try {
            $perPage = $request->integer('per_page', 20);
            $perPage = min(max($perPage, 1), 100);
            $userId = $request->integer('user_id');

            $query = UserLoginEvent::with('user:id,firstname,surname,email,role_name')
                ->orderByDesc('logged_in_at');

            if ($userId) {
                $query->where('user_id', $userId);
            }

            $paginator = $query->paginate($perPage);

            $events = collect($paginator->items())->map(function (UserLoginEvent $event) {
                return [
                    'id' => $event->id,
                    'logged_in_at' => optional($event->logged_in_at)->toISOString(),
                    'ip_address' => $event->ip_address,
                    'user_agent' => $event->user_agent,
                    'user' => $event->user ? [
                        'id' => $event->user->id,
                        'firstname' => $event->user->firstname,
                        'surname' => $event->user->surname,
                        'email' => $event->user->email,
                        'role_name' => $event->user->role_name,
                    ] : null,
                ];
            })->values();

            return response()->json([
                'status' => 'success',
                'message' => 'Login timeline fetched successfully',
                'data' => $events,
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch login timeline', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch login timeline',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(): JsonResponse
    {
        Auth::logout();
        Log::info('User logged out successfully', ['user_id' => Auth::user()->id]);

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    private function resolveSchoolId(Request $request): ?int
    {
        if (auth()->check() && auth()->user()->school_id) {
            return (int) auth()->user()->school_id;
        }

        if ($request->filled('school_id')) {
            return (int) $request->input('school_id');
        }

        return null;
    }

    private function fillUserDetails(Request $request, User $user): void
    {
        $user->title = $request->title;
        $user->firstname = $request->firstname;
        $user->surname = $request->surname;
        $user->email = $request->email;
        if ($request->has('password')) {
            $user->password = Hash::make($request->input('password'));
        }
        $user->sex = $request->sex;
        $user->village = $request->village;
        $user->traditional_authority = $request->traditional_authority;
        $user->district = $request->district;
        $user->role_name = $request->role_name;
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId) {
            $user->school_id = $schoolId;
        }
        $user->created_at = Carbon::now();
        $user->updated_at = Carbon::now();
        Log::info('User details updated', [
            'user_id' => $user->id,
            'title' => $user->title,
            'firstname' => $user->firstname,
            'surname' => $user->surname,
            'email' => $user->email,
            'role_name' => $user->role_name
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validator = $this->validateUser($request, true, $id);

            if ($validator->fails()) {
                Log::warning('User update validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = User::findOrFail($id);
            $this->fillUserDetails($request, $user);
            $user->save();

            // Sync departments for the updated user
            if ($request->has('departments')) {
                $user->departments()->sync($request->input('departments'));
                Log::info('Departments updated for user', ['user_id' => $user->id, 'departments' => $request->input('departments')]);
            }

            if ($request->has('subjects')) {
                $user->subjects()->sync($request->input('subjects'));
                Log::info('Subjects updated for user', ['user_id' => $user->id, 'subjects' => $request->input('subjects')]);
            }

            Log::info('User updated successfully', ['user_id' => $user->id]);

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update user', ['error' => $e->getMessage(), 'user_id' => $id]);
            return response()->json([
                'status' => 'error',
                'message' => 'User not updated',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //allocate subject to user
    public function allocateSubjectToUser(Request $request, int $userId): JsonResponse
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'subject_ids' => 'required|array',
                'subject_ids.*' => 'exists:subjects,id', // Validate each subject ID
            ]);

            if ($validator->fails()) {
                Log::warning('Subject allocation validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Fetch the user and subjects
            $user = User::findOrFail($userId);
            $subjects = Subject::find($request->input('subject_ids'));

            // Attach subjects to the user (this will add them to the pivot table)
            $user->subjects()->syncWithoutDetaching($subjects);

            Log::info('Subjects allocated to user', [
                'user_id' => $user->id,
                'subject_ids' => $subjects->pluck('id'),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Subjects allocated successfully to the user',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to allocate subjects to user', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to allocate subjects to user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //allocate department to user
    public function allocateDepartmentToUser(Request $request, int $userId): JsonResponse
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'department_ids' => 'required|array',
                'department_ids.*' => 'exists:departments,id', // Validate each department ID
            ]);

            if ($validator->fails()) {
                Log::warning('Department allocation validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Fetch the user and departments
            $user = User::findOrFail($userId);
            $departments = Department::find($request->input('department_ids'));

            // Attach departments to the user (this will add them to the pivot table)
            $user->departments()->syncWithoutDetaching($departments);

            Log::info('Departments allocated to user', [
                'user_id' => $user->id,
                'department_ids' => $departments->pluck('id'),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Departments allocated successfully to the user',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to allocate departments to user', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to allocate departments to user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUserAllocations(int $userId): JsonResponse
    {
        try {
            // Fetch user along with their allocations (subjects and departments)
            $user = User::with(['subjects', 'departments'])->findOrFail($userId);

            Log::info('Fetched user allocations successfully', [
                'user_id' => $user->id,
                'subject_count' => $user->subjects->count(),
                'department_count' => $user->departments->count(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User allocations retrieved successfully',
                'user_allocations' => [
                    'subjects' => $user->subjects,
                    'departments' => $user->departments,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user allocations', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user allocations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function removeAllocationFromUser(Request $request, int $userId): JsonResponse
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'subject_ids' => 'array',
                'subject_ids.*' => 'exists:subjects,id', // Validate each subject ID
                'department_ids' => 'array',
                'department_ids.*' => 'exists:departments,id', // Validate each department ID
            ]);

            if ($validator->fails()) {
                Log::warning('Allocation removal validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Fetch the user
            $user = User::findOrFail($userId);

            // Remove the specified allocations
            if ($request->has('subject_ids')) {
                $user->subjects()->detach($request->input('subject_ids'));
                Log::info('Removed subjects from user', [
                    'user_id' => $user->id,
                    'subject_ids' => $request->input('subject_ids'),
                ]);
            }

            if ($request->has('department_ids')) {
                $user->departments()->detach($request->input('department_ids'));
                Log::info('Removed departments from user', [
                    'user_id' => $user->id,
                    'department_ids' => $request->input('department_ids'),
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Allocations removed successfully from the user',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to remove allocations from user', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to remove allocations from user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    //allocate subjects and classes to user (many-to-many)
    public function allocationSubjectAndClass(Request $request, int $userId): JsonResponse
    {
        try {
            Log::info('Allocation request', ['request' => $request->all()]);

            $bodyUserId = $request->input('userId');
            $effectiveUserId = is_numeric($bodyUserId) ? (int) $bodyUserId : $userId;

            // Accept either classIds (array) or legacy classId (single)
            $classIds = $request->input('classIds');
            if (empty($classIds) && $request->input('classId')) {
                $classIds = [$request->input('classId')];
            }
            $classIds = array_filter((array) ($classIds ?? []), 'is_numeric');
            $classIds = array_map('intval', array_values($classIds));

            $subjectIds = $request->input('subjectIds', []);

            $validator = Validator::make($request->all(), [
                'subjectIds'   => 'required|array|min:1',
                'subjectIds.*' => 'integer|exists:subjects,id',
                'classIds'     => 'nullable|array',
                'classIds.*'   => 'integer|exists:levels,id',
                'classId'      => 'nullable|integer|exists:levels,id',
            ]);

            if ($validator->fails()) {
                Log::warning('Allocation validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Validation error',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $user = User::findOrFail($effectiveUserId);

            $subjects = Subject::whereIn('id', $subjectIds)->get();
            if ($subjects->isEmpty()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'No valid subjects found for provided IDs',
                ], 404);
            }

            // Attach subjects to the teacher
            $user->subjects()->syncWithoutDetaching($subjects->pluck('id')->all());

            // Attach classes directly to the teacher (many-to-many via level_user)
            if (!empty($classIds)) {
                $user->levels()->syncWithoutDetaching($classIds);

                // Also link each subject to each selected class so the subject→class
                // relationship used elsewhere in the app stays consistent.
                foreach ($subjects as $subject) {
                    $subject->levels()->syncWithoutDetaching($classIds);
                }
            }

            $allocatedClasses = !empty($classIds)
                ? Level::whereIn('id', $classIds)->get(['id', 'className'])
                : collect();

            Log::info('Allocation saved', [
                'user_id'     => $user->id,
                'subject_ids' => $subjects->pluck('id'),
                'class_ids'   => $classIds,
            ]);

            return response()->json([
                'status'      => 'success',
                'message'     => 'Subjects and classes allocated to teacher',
                'user_id'     => $user->id,
                'subject_ids' => $subjects->pluck('id'),
                'classes'     => $allocatedClasses,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Error allocating subject and class: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAllocationsForUser(int $userId): JsonResponse
    {
        try {
            $user = Auth::user();

            $allocations = DB::table('allocationables')
                ->join('subjects', 'subjects.id', '=', 'allocationables.subject_id')
                ->where('allocationables.allocationable_type', 'User')
                ->where('allocationables.allocationable_id', $user->id)
                ->select([
                    'allocationables.allocationable_id as user_id',
                    'allocationables.subject_id',
                    'subjects.name as subject_name',
                    'allocationables.allocationable_type',
                    'allocationables.created_at',
                    'allocationables.updated_at',
                ])
                ->get()
                ->map(function ($allocation) use ($user) {
                    $allocation->user_name = trim($user->firstname . ' ' . $user->surname);
                    return $allocation;
                });

            return response()->json([
                'status' => 'success',
                'message' => 'Allocations retrieved successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => trim($user->firstname . ' ' . $user->surname),
                    'email' => $user->email,
                ],
                'allocations' => $allocations,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve allocations for user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function handleAllocationSuccess(User $user, Level $level, Subject $subject): JsonResponse
    {
        return response()->json([
            'message' => 'Subject and class allocated successfully',
            'status' => 'success',
            'Teacher' => $user->firstname . ' ' . $user->surname,
            'Email' => $user->email,
            'Class' => $level->className,
            'Subject' => $subject->name,
        ], 201);
    }

    private function handleAllocationError(string $errorMessage, ?User $user, ?Level $level, ?Subject $subject): JsonResponse
    {
        return response()->json([
            'message' => $errorMessage,
            'status' => 'fail',
            'Teacher' => $user ? $user->firstname . ' ' . $user->surname : null,
            'Email' => $user ? $user->email : null,
            'Class' => $level ? $level->className : null,
            'Subject' => $subject ? $subject->name : null,
        ]);
    }

    //get allocations for teacher
    public function getAllocationsForTeacher(int $userId): JsonResponse
    {
        try {
            $teacher = User::findOrFail($userId);

            // Subjects allocated to this teacher
            $allocatedSubjects = $teacher->subjects()->get(['subjects.id', 'subjects.name']);

            // Classes (levels) directly assigned to this teacher via level_user pivot,
            // with student counts included to avoid a separate bulk-student fetch on the frontend.
            $allocatedClasses = $teacher->levels()
                ->withCount('students')
                ->get(['levels.id', 'levels.className']);

            return response()->json([
                'status'      => 'success',
                'message'     => 'Allocations retrieved for ' . $teacher->firstname . ' ' . $teacher->surname,
                'allocations' => $allocatedSubjects,
                'classes'     => $allocatedClasses,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to retrieve allocations for teacher',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    //get head of departments
    public function getHeadOfDepartments(): JsonResponse
    {
        try {
            $headOfDepartments = User::where('role_name', 'Head Of Department')->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Head of departments retrieved successfully',
                'head_of_departments' => $headOfDepartments,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve head of departments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //get allocations in the database + departments
    /**
     * TODO:THis is working but not the way am want.
     * I am looking for a way to return the class in which the user is allocated and also which subject is teaching
     *and also the department in which the user is allocated.
     * and if there is no department or class allocated, return status as 'not allocated' other wise return status as 'allocated'.
     */

    public function getAllocationsInDatabase(): JsonResponse
    {
        try {
            // User-subject rows only — no dept join here to avoid row multiplication
            // when a teacher belongs to multiple departments.
            $rows = DB::table('allocationables')
                ->join('subjects', 'subjects.id', '=', 'allocationables.subject_id')
                ->join('users', 'users.id', '=', 'allocationables.allocationable_id')
                ->where('allocationables.allocationable_type', 'User')
                ->select(
                    'users.id as user_id',
                    DB::raw("CONCAT(users.firstname, ' ', users.surname) as teacher"),
                    'users.email as email',
                    'subjects.name as subject'
                )
                ->get();

            // One department per user (keyBy keeps the last, good enough for display)
            $deptMap = DB::table('department_user')
                ->join('departments', 'departments.id', '=', 'department_user.department_id')
                ->select('department_user.user_id', 'departments.departmentName as department')
                ->get()
                ->keyBy('user_id');

            // ALL classes per user
            $classMap = DB::table('level_user')
                ->join('levels', 'levels.id', '=', 'level_user.level_id')
                ->select('level_user.user_id', 'levels.id as class_id', 'levels.className as class')
                ->get()
                ->groupBy('user_id');

            $allocations = $rows->map(function ($row) use ($deptMap, $classMap) {
                $deptRow = $deptMap->get($row->user_id);
                $row->department = $deptRow ? $deptRow->department : null;

                $classes = $classMap->get($row->user_id, collect());
                // Keep legacy single-class fields for backward compat
                $row->class    = $classes->isNotEmpty() ? $classes->first()->class : null;
                $row->class_id = $classes->isNotEmpty() ? $classes->first()->class_id : null;
                // All classes as an array for the frontend table
                $row->all_classes = $classes->map(fn($c) => [
                    'id'   => $c->class_id,
                    'name' => $c->class,
                ])->values()->toArray();

                return $row;
            });

            return response()->json([
                'status'      => 'success',
                'message'     => 'Allocations retrieved successfully',
                'allocations' => $allocations,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to retrieve allocations in database',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }


    public function getTeachers(): JsonResponse
    {
        try {
            $teachers = User::whereRaw('LOWER(role_name) = ?', ['teacher'])->get();
            return response()->json([
                'status' => 'success',
                'message' => 'Teachers retrieved successfully',
                'teachers' => $teachers,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve teachers',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Users attached to a department (department_user pivot).
     */
    public function getAllUsersFromEachDepartment(int $id): JsonResponse
    {
        try {
            $department = Department::with('users')->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Users retrieved successfully for department ' . $department->departmentName,
                'department' => [
                    'id' => $department->id,
                    'departmentName' => $department->departmentName,
                    'departmentCode' => $department->departmentCode,
                    'users' => $department->users,
                ],
                'users' => $department->users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users for department',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
