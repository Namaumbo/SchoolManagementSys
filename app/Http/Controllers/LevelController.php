<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Level;
use App\Models\Student;
use App\Models\Assessment;
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

        $students = $level->students;
        $studentCount = $students->count(); // Count the number of students

        return response()->json([
            'message' => 'Students fetched successfully for class ' . $level->className,
            'student_count' => $studentCount,
            'students' => $students,
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
        // Find the level (class) by ID with its subjects and associated users
        $level = Level::with(['subjects.users'])
                      ->findOrFail($id);

        // Initialize an empty array to store unique users
        $uniqueUsers = [];

        // Loop through each subject to extract users and avoid duplication
        foreach ($level->subjects as $subject) {
            foreach ($subject->users as $user) {
                // Check if the user has already been added to $uniqueUsers
                $userId = $user->id;
                if (!isset($uniqueUsers[$userId])) {
                    // If not added, add the user with required details
                    $uniqueUsers[$userId] = [
                        'firstname' => $user->firstname,
                        'surname' => $user->surname,
                         'email'=>$user->email,
                         'title'=>$user->title,
                        'allocatedSubjects' => [],
                    ];
                }
                // Add the subject details to the user's allocatedSubjects array
                $uniqueUsers[$userId]['allocatedSubjects'][] = [
                    'subjectName' => $subject->name,
                    'code'=>$subject->code,
                    'periodsPerWeek'=>$subject->periodsPerWeek,

                ];
            }
        }

        // Prepare the final response data with unique users
        $formattedUsers = array_values($uniqueUsers); // Reindex the array to remove keys

        return response()->json([
            'message' => 'Users fetched successfully for class ' . $level->className,
            'users' => $formattedUsers,
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


public function getClassPerformance($id)
{
    try {
        // Fetch class details including students and subjects through levels
        $class = Level::with(['students' => function($query) {
            $query->with(['subjects' => function($query) {
                $query->select('subjects.id', 'subjects.name')
                    ->withPivot('averageScore');
            }]);
        }])->findOrFail($id);

        // Transform the data
        $classDetails = [
            'id' => $class->id,
            'className' => $class->className,
            'students' => $class->students->map(function($student) {
                return [
                    'id' => $student->id,
                    'firstname' => $student->firstname,
                    'surname' => $student->surname,
                    'subjects' => $student->subjects->map(function($subject) {
                        return [
                            'id' => $subject->id,
                            'name' => $subject->name,
                            'averageScore' => $subject->pivot->averageScore
                        ];
                    })
                ];
            })
        ];

        return response()->json([
            'message' => 'Performance fetched successfully for class',
            'class' => $classDetails,
            'status' => 200,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error fetching performance data',
            'status' => 404,
            'error' => $e->getMessage(),
        ], 404);
    }
}

}
