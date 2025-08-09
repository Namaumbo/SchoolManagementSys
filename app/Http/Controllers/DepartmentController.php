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
        $departments = Department::all();

        return response()->json([
            'status' => 'success',
            'data' => $departments,
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
        // FIX ME : Start from here 
        try {
            $validatedData = $request->validate([
                'departmentName' => 'required|max:255',
                'headOfDepartment' => 'required|email|exists:users,email',
            ]);
    
            Log::info('Validated data', $validatedData);
    
            $headOfDepartment = User::where('email', $request->input('headOfDepartment'))->firstOrFail();
    
            $department = Department::create([
                'departmentName' => $validatedData['departmentName'],
                'head_of_department_id' => $headOfDepartment->id,
                'description' => $request->input('description'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
    
            Log::info('Department created successfully', ['department' => $department]);
    
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
            
            $headOfDepartments = User::whereHas('role', function ($query) {
                $query->where('role_name', self::ROLE_HEAD_OF_DEPARTMENT);
            })->get(['id', 'firstname', 'surname', 'email']);
    
            // Check if the collection is empty or null
            if ($headOfDepartments->isEmpty()) {
                \Illuminate\Support\Facades\Log::warning('No Head of Departments found');
                return response()->json([
                    'status' => 'error',
                    'message' => 'No Head of Departments found'
                ], ResponseAlias::HTTP_NOT_FOUND);
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
    }
