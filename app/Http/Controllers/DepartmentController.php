<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\UserResource;
use App\Models\Department;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;

class DepartmentController extends Controller
{
    /**
     * Display a listing of all departments.
     *
     * @return JsonResponse
     */
    public function getAll(): JsonResponse
    {
        Log::info('Fetching all departments');

        // Option 1: Using DepartmentResource (Recommended)
        $departments = Department::with('headOfDepartment')->get();

        return response()->json([
            'status' => 'success',
            'data' => DepartmentResource::collection($departments),
        ], ResponseAlias::HTTP_OK);
    }

    /**
     * Store a newly created department.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {


        
        // Transform the request data
        $transformedData = [
            'departmentName' => $request->input('departmentName'),
            'departmentCode' => $request->input('departmentCode'),
            'description' => $request->input('description')
        ];

        Log::info('Transformed data', ['transformedData' => $transformedData]);

        $headOfDepartmentId = $request->input('headOfDepartment');
        if ($headOfDepartmentId) {
            $headUser = User::find($headOfDepartmentId);
            if ($headUser) {
                $transformedData['headOfDepartment'] = $headUser->email;
            }
        }

        // Merge transformed data back into request
        $request->merge($transformedData);

        try {
            $validatedData = $request->validate([
                'departmentName' => 'required|max:255',
                'departmentCode' => 'required|max:10|unique:departments,departmentCode',
                'headOfDepartment' => 'required|email|exists:users,email',
            ]);

            Log::info('Validated data', $validatedData);

            $headOfDepartment = User::where('email', $request->input('headOfDepartment'))->firstOrFail();



            // UI Request body format (gets transformed above):
            // {
            //     id: '1755724436053',
            //     name: 'Marting Chunga',
            //     code: '1622', 
            //     description: 'hey how are u',
            //     headOfDepartment: 4,  // User ID
            //     isActive: true,
            //     createdAt: '2025-08-20T21:13:56.054Z'
            // }
            //
            // Gets transformed to backend format:
            // {
            //     departmentName: 'Marting Chunga',
            //     departmentCode: '1622',
            //     headOfDepartment: 'user@email.com',  // User email
            //     description: 'hey how are u'
            // }

            Log::info('Creating department', ['department' => $validatedData]);
    

            $department = Department::create([
                'departmentName' => $validatedData['departmentName'],
                'departmentCode' => $validatedData['departmentCode'],
                'head_of_department_id' => $headOfDepartment->id,
                'description' => $request->input('description'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            Log::info('Department created successfully', ['department' => $department]);

            // Optional: Additional controller-level hook after department creation
            // This runs in addition to the model events
            // You can add any extra logic here if needed

            return response()->json([
                'status' => 'success',
                'message' => 'Department created successfully',
                'department' => $department,
            ], ResponseAlias::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error', ['errors' => $e->errors()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            Log::error('General error', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating department',
                'error' => $e->getMessage(),
            ], ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get all users with the role of Head Of Department.
     *
     * @return JsonResponse
     */
    const ROLE_HEAD_OF_DEPARTMENT = 'Head Of Department';

    public function getHeadOfDepartments(): JsonResponse
    {
        try {
            \Illuminate\Support\Facades\Log::info('Fetching Head of Departments');

            $headOfDepartments = User::whereRaw('LOWER(role_name) = ?', ['head_of_department'])
                ->get(['id', 'firstname', 'surname', 'email']);

            if ($headOfDepartments->isEmpty()) {
                \Illuminate\Support\Facades\Log::warning('No Head of Departments found');
                return response()->json([
                    'status' => 'success',
                    'message' => 'No Head of Departments found',
                    'data' => [],
                ], ResponseAlias::HTTP_OK);
            }

            \Illuminate\Support\Facades\Log::info('Head of Departments retrieved successfully', ['count' => $headOfDepartments->count()]);

            return response()->json([
                'status' => 'success',
                'message' => 'Head Of Departments retrieved successfully',
                'data' => $headOfDepartments,
            ], ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to retrieve Head of Departments', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve Head Of Departments',
                'error' => $e->getMessage()
            ], ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        if (Department::where('id', $id)->exists()) {
            $department = Department::find($id);
            $department->delete();
            return response()->json([
                'message' => 'Department deleted successfully'
            ], ResponseAlias::HTTP_OK);
        } else {
            return response()->json([
                'message' => 'No department found with that ID'
            ], ResponseAlias::HTTP_NOT_FOUND);
        }
    }

    /**
     * Register users to a department.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function registerUsersToDepartment(Request $request, $id): JsonResponse
    {
        try {
            $department = Department::findOrFail($id);

            // Get user by their email
            $user = User::where('email', $request->input('email'))->firstOrFail();

            // Attach users to the department
            $department->users()->syncWithoutDetaching($user);

            return response()->json([
                'message' => 'User added to the department successfully',
                'department' => $department->users,
            ], ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add user to the department',
                'error' => $e->getMessage(),
            ], ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get users for a department.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function getUsersForDepartment($id): JsonResponse
    {
        try {
            $department = Department::findOrFail($id);
            $users = $department->users;

            return response()->json([
                'status' => 'success',
                'message' => 'Users retrieved successfully for department ' . $department->departmentName,
                'users' => $users,
            ], ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users for department',
                'error' => $e->getMessage(),
            ], ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
