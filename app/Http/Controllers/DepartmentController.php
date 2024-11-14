<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Collection
     */
    public function getAll()
    {
        \Illuminate\Support\Facades\Log::info('Fetching all departments');
        return Department::all();
        //        return DepartmentResource::collection(Department::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function store(Request $request): JsonResponse
    {

        //TODO: check this validation its crashing the flow
        // $request->validate([
        //     'departmentName' => 'required|max:255',
        //     'headOfDepartment' => 'required|exists:users,id',
        // ]);

        \Illuminate\Support\Facades\Log::info('Department creation attempt', ['departmentName' => $request->input('departmentName')]);

        $departmentName = $request->input('departmentName');
        $departmentDetails = Department::query()->where('departmentName', $departmentName)->first();
        if ($departmentDetails) {
            \Illuminate\Support\Facades\Log::warning('Department creation failed - department already exists', ['departmentName' => $departmentName]);
            return response()->json(
                [
                    'HOD' => $departmentDetails->head_of_department_id,
                    'message' => "Department already exists",
                    'Department Name' => $departmentName
                ],
                ResponseAlias::HTTP_CONFLICT
            );
        } else {
            try {
                \Illuminate\Support\Facades\Log::info('Checking head of department', ['email' => $request->input('headOfDepartment')]);
                $headOfDepartment = User::query()->where('email', $request->input('headOfDepartment'))->first();
                if (!$headOfDepartment) {
                    \Illuminate\Support\Facades\Log::warning('Head of department not found', ['email' => $request->input('headOfDepartment')]);
                    return response()->json(
                        [
                            'message' => "Head of department not found",
                            'hod_email' => $request->input('headOfDepartment')
                        ],
                        ResponseAlias::HTTP_NOT_FOUND
                    );
                }

                $creation_job = Department::create([
                    'departmentName' => $departmentName,
                    'head_of_department_id' => $headOfDepartment->id,
                    'description' => $request->input('description'),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);

                if ($creation_job) {
                    \Illuminate\Support\Facades\Log::info('Department created successfully', ['departmentName' => $departmentName]);
                    return response()->json(
                        [
                            'message' => "Department Saved Successfully",
                            'hod_email' => $request->input('headOfDepartment'),
                            'departmentName' => $departmentName,
                            'status' => 'success'
                        ],
                        ResponseAlias::HTTP_CREATED
                    );
                } else {
                    \Illuminate\Support\Facades\Log::error('Error creating department');
                    return response()->json(
                        [
                            'message' => "Error creating department"
                        ],
                        ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
                    );
                }
            } catch (\Exception $e) {
                if (str_contains($e->getMessage(), 'Integrity constraint violation')) {
                    \Illuminate\Support\Facades\Log::error('Head of Department already assigned', ['error' => $e->getMessage()]);
                    return response()->json(
                        [
                            'message' => "Head of Department is already assigned to another department",
                            'error' => $e->getMessage()
                        ],
                        ResponseAlias::HTTP_CONFLICT
                    );
                }
                \Illuminate\Support\Facades\Log::error('Error checking head of department', ['error' => $e->getMessage()]);
                return response()->json(
                    [
                        'message' => "Error checking head of department",
                        'error' => $e->getMessage()
                    ],
                    ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
                );
            }
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
            
            $headOfDepartments = User::whereHas('role', function ($query) {
                $query->where('role_name', self::ROLE_HEAD_OF_DEPARTMENT);
            })->get(['id', 'firstname','surname', 'email']);

            \Illuminate\Support\Facades\Log::info('Head of Departments retrieved successfully', ['count' => $headOfDepartments->count()]);

            return response()->json([
                'status' => 'success',
                'message' => 'Head Of Departments retrieved successfully',
                'data' => DepartmentResource::collection($headOfDepartments),
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
        $department = Department::find($id);
        if ($department) {
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

            $user = User::query()->where('email', $request->input('email'))->firstOrFail();

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
