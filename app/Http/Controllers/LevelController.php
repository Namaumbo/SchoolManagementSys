<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Level;
use App\Models\Student;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LevelController extends Controller
{
    public function getClass()
    {
        return Level::all();
    }

    public function create(Request $request, $class)
    {
        $class->className = $request->className;
        $class->created_at = Carbon::now();
        $class->updated_at = Carbon::now();
        $class->save();
    }

    public function store(Request $request)
    {
        try {
            $class = new Level;
            $this->create($request, $class);

            return response()->json([
                'message' => 'Class saved successfully',
                'class' => $class,
                'status' => 201,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Class not saved',
                'status' => 404,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function classTeacher(Request $request)
    {
        try {
            $response = [
                'message' => '',
                'status' => '',
                'user' => null,
            ];
            $code = 200;
            $user = User::where('email', $request->input('email'))->first();

            if (!$user) {
                $response['message'] = 'The user doesn\'t exist';
                $response['status'] = 'fail';
                $response['user'] = $user;
                $code = 409;
            } else {
                $class = new Level;
                $this->create($request, $class);

                $class->users()->associate($user);
                $class->save();
                $response['message'] = 'Class teacher successfully created';
                $response['status'] = 'success';
                $response['user'] = $user;
                $code = 201;
            }
        } catch (\Exception $e) {
            $response['message'] = 'Error creating class teacher';
            $response['status'] = 'fail';
            $code = 500;
        }
        return response()->json($response, $code);
    }

    public function getStudentsByClass($id)
    {
        try {
            // Find the level (class) by ID with its students
            $level = Level::with('students')->findOrFail($id);

            return response()->json([
                'message' => 'Students fetched successfully for class ' . $level->className,
                'students' => $level->students,
                'status' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching students',
                'status' => 404,
                'error' => $e->getMessage(),
            ], 404);
        }
    }


/**
 * Get users along with allocated class and subject details by class.
 *
 * @param int $id Class (Level) ID
 * @return \Illuminate\Http\JsonResponse
 */
public function getUsersWithAllocations($id)
{
    try {
        // Find the level (class) by ID with its users, allocated classes, and subjects
        $level = Level::with(['subjects', 'subjects.levels', 'subjects.levels','subjects.users',])
                      ->findOrFail($id);

        return response()->json([
            'message' => 'Users fetched successfully for class ' . $level->className,
            'details' => $level->subjects,
            'status' => 200,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error fetching users with allocations',
            'status' => 404,
            'error' => $e->getMessage(),
        ], 404);
    }
}



}
