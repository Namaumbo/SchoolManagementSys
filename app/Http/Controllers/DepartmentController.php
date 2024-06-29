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

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Collection
     */
    public function getAll()
    {
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
    $request->validate([
        'departmentName' => 'required|max:255',
        'headOfDepartment' => 'required|exists:users,email',
    ]);

    $departmentName = $request->input('departmentName');
    if (Department::where('departmentName', $departmentName)->first()) {
        return response()->json(['message' => "Department already exists", $departmentName],
            ResponseAlias::HTTP_CONFLICT);
    } else {
        try {
            $headOfDepartment = User::where('email', $request->input('headOfDepartment'))
                                    ->whereHas('role', function($query) {
                                        $query->where('role_name', 'Head Of Department');
                                    })->firstOrFail();

            $department = Department::create([
                'departmentName' => $request->input('departmentName'),
                'head_of_department_id' => $headOfDepartment->id,
                'description' => $request->input('description'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);

            return response()->json([
                'message' => 'Department saved successfully',
                'department' => $department,
                'status' => ResponseAlias::HTTP_CREATED,
            ], ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Department not saved',
                'error' => $e->getMessage(),
                'status' => ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
            ], ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

/**
 * Get all users with the role of Head Of Department.
 *
 * @return JsonResponse
 */
public function getHeadOfDepartments(): JsonResponse
{
    try {
        $headOfDepartments = User::whereHas('role', function($query) {
            $query->where('role_name', 'Head Of Department');
        })->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Head Of Departments retrieved successfully',
            'users' => $headOfDepartments,
        ], ResponseAlias::HTTP_OK);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to retrieve Head Of Departments',
            'error' => $e->getMessage(),
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
