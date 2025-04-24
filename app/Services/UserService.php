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
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\Foundation\Application;
use Psy\Util\Json;
use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
use Illuminate\Support\Facades\Log;

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
            'departments' => 'array',
            'departments.*' => 'exists:departments,id', 
        ];

        if ($isUpdate) {
            $rules['email'] .= ',' . $id;
            unset($rules['password']); // Remove password rule for update
        }

        return Validator::make($request->all(), $rules);
    }

    public function getAll(): JsonResponse
    {
        try {
            $users = User::with(['departments'])->paginate(10);

            Log::info('Fetched all users successfully.', ['users_count' => $users->count()]);

            return response()->json([
                'message' => 'User details retrieved successfully',
                'status' => 'success',
                'users' => UserResource::collection($users),
            ]);
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
            $validator = $this->validateUser($request);

            if ($validator->fails()) {
                Log::warning('User validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
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

            return response()->json([
                'status' => 'success',
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

        $token = Auth::user()->createToken('Token')->plainTextToken;
        $cookie = cookie('jwt', $token, 30 * 1);

        Log::info('User logged in successfully', ['user_id' => Auth::user()->id]);

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
        Log::info('User logged out successfully', ['user_id' => Auth::user()->id]);

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
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
        $user->created_at = Carbon::now();
        $user->updated_at = Carbon::now();
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





}
