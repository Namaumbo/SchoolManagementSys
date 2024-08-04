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

use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\Foundation\Application;
use Psy\Util\Json;

class UserService
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    use Illuminate\Support\Facades\Log;

    /**
     * Validate user input fields.
     *
     * @param  Request  $request
     * @param  bool  $isUpdate
     * @param  int|null  $id
     * @return \Illuminate\Contracts\Validation\Validator
     */
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
            'departments' => 'array', // Ensure departments is an array
            'departments.*' => 'exists:departments,id', // Validate each department ID
        ];

        // Update specific rules
        if ($isUpdate) {
            $rules['email'] .= ',' . $id; // Unique email rule for update
            unset($rules['password']); // Remove password rule for update
        }

        return Validator::make($request->all(), $rules);
    }

    public function getAll(): JsonResponse
    {
        try {
            $users = User::with('departments')->get();
            return response()->json([
                'message' => 'User details retrieved successfully',
                'status' => 'success',
                'users' => $users,
            ]);
        } catch (\Exception $e) {
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
            $validator = $this->validateUser($request);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = User::where('email', $request->input('email'))->first();

            if ($user) {
                return response()->json(['message' => 'User already exists', 'email' => $user], 409);
            }

            $newUser = new User();
            $this->fillUserDetails($request, $newUser);
            $newUser->save();

            // Attach departments to the newly created user using syncWithoutDetaching
            if ($request->has('departments')) {
                $newUser->departments()->syncWithoutDetaching($request->input('departments'));
            }
            Log::info('Failed to save user: ' . $e->getMessage());

            return response()->json([
                'status' => 'success',
                'message' => 'User saved successfully',
                'user' => $newUser,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to save user: ' . $e->getMessage());
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
            return response()->json([
                'message' => 'User details retrieved successfully',
                'status' => 'success',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
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

            // Delete the user
            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully',
                'status' => 'success',
            ], 200);
        } catch (\Exception $e) {
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
            return response()->json([
                "status" => "error",
                "message" => "Validation Error",
                "errors" => $validator->errors(),
            ], 422);
        }

        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json([
                "status" => "error",
                "message" => "Invalid credentials",
            ], 401);
        }
        

        $token = Auth::user()->createToken('Token')->plainTextToken;
        $cookie = cookie('jwt', $token, 30 * 1);

        return response()->json([
            "status" => "success",
            "message" => "System successfully logged " . Auth::user()->first_name,
            "access_token" => $token,
            "token_type" => "bearer",
            "user" => Auth::user(),
        ])->withCookie($cookie);
    }

    public function logout(): JsonResponse
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    /**
     * Fill user details from request.
     *
     * @param  Request  $request
     * @param  User  $user
     * @return void
     */
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
        $user->created_at = Carbon::now();
        $user->updated_at = Carbon::now();
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validator = $this->validateUser($request, true, $id);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = User::findOrFail($id);
            $this->fillUserDetails($request, $user);
            $user->save();

            // Sync departments for the updated user using syncWithoutDetaching
            if ($request->has('departments')) {
                $user->departments()->syncWithoutDetaching($request->input('departments'));
            } else {
                $user->departments()->detach(); // Remove all existing associations if no departments provided
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAllUsersFromEachDepartment(int $id): JsonResponse
    {
        try {
            $department = Department::findOrFail($id);

            $usersByDepartment = $department->load('users');

            return response()->json([
                'status' => 'success',
                'message' => 'Users retrieved successfully for department ' . $department->departmentName,
                'department' => $department,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users for department',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

public function Allocation(Request $request, int $id): JsonResponse
{
    try {
        // Find the user
        $user = User::findOrFail($id);

        // Find or create the subject
        $subject = Subject::firstOrCreate(['name' => $request->input('name')]);

        // Find or create the level
        $level = Level::firstOrCreate(['className' => $request->input('className')]);

        // Sync relationships
        $subject->users()->sync([$user->id]);
        $subject->levels()->sync([$level->id]);

        // Return success response
        return $this->handleAllocationSuccess($user, $level, $subject);
    } catch (\Exception $e) {
        // Handle any exceptions
        return $this->handleAllocationError(
            'Error allocating subject and class: ' . $e->getMessage(),
            $user ?? null,
            $level ?? null,
            $subject ?? null
        );
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

    public function getAllocationsForTeacher(int $userId): JsonResponse
    {
        try {
            // Find the user (teacher) by ID
            $teacher = User::findOrFail($userId);

            // Load subjects and levels allocated to the teacher
            $allocatedSubjects = $teacher->subjects()->with('levels')->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Allocated subjects and classes retrieved successfully for teacher ' . $teacher->firstname . ' ' . $teacher->surname,
                'teacher' => $teacher,
                'allocations' => $allocatedSubjects,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve allocations for teacher',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

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

}