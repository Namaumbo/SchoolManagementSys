<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Level;
use App\Models\Student;
use App\Models\Assessment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LevelController extends Controller
{
    private function formatClassResponse(Level $class): array
    {
        // Count students
        $studentCount = $class->students->count();

        // Get unique teachers assigned to this class
        $assignedTeachers = [];
        $teacherIds = [];

        foreach ($class->subjects as $subject) {
            foreach ($subject->users as $user) {
                if (!in_array($user->id, $teacherIds, true)) {
                    $teacherIds[] = $user->id;
                    $assignedTeachers[] = [
                        'id' => $user->id,
                        'firstname' => $user->firstname,
                        'surname' => $user->surname,
                        'email' => $user->email,
                        'title' => $user->title ?? '',
                    ];
                }
            }
        }

        $classTeacher = $class->users;
        $classTeacherDisplay = $classTeacher
            ? trim(($classTeacher->title ? $classTeacher->title . ' ' : '') . $classTeacher->firstname . ' ' . $classTeacher->surname)
            : 'No class teacher';

        return [
            'id' => $class->id,
            'className' => $class->className,
            'classTeacher' => $classTeacherDisplay,
            'formTeacherId' => $class->user_id,
            'student_count' => $studentCount,
            'assigned_teachers_count' => count($assignedTeachers),
            'has_assigned_teachers' => count($assignedTeachers) > 0,
            'assigned_teachers' => $assignedTeachers,
            'created_at' => $class->created_at,
            'updated_at' => $class->updated_at,
        ];
    }

    public function getClass()
    {
        $classes = Level::with(['students', 'subjects.users', 'users'])->get();

        return $classes->map(function ($class) {
            return $this->formatClassResponse($class);
        });
    }

    public function show($id)
    {
        try {
            $class = Level::with(['students', 'subjects.users', 'users'])->findOrFail($id);

            return response()->json([
                'message' => 'Class fetched successfully',
                'class' => $this->formatClassResponse($class),
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Class not found',
                'status' => 404,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'className' => ['required', 'string', 'max:255', 'unique:levels,className'],
                'user_id' => ['nullable', 'integer', 'exists:users,id'],
            ]);

            $class = Level::create([
                'className' => $validated['className'],
                'user_id' => $validated['user_id'] ?? null,
            ]);
            $class->load(['students', 'subjects.users', 'users']);

            return response()->json([
                'message' => 'Class saved successfully',
                'class' => $this->formatClassResponse($class),
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

    public function update(Request $request, $id)
    {
        try {
            $class = Level::findOrFail($id);
            $validated = $request->validate([
                'className' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('levels', 'className')->ignore($class->id),
                ],
                'user_id' => ['nullable', 'integer', 'exists:users,id'],
            ]);

            $class->className = $validated['className'];
            $class->user_id = $validated['user_id'] ?? null;
            $class->save();
            $class->load(['students', 'subjects.users', 'users']);

            return response()->json([
                'message' => 'Class updated successfully',
                'class' => $this->formatClassResponse($class),
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating class',
                'status' => 404,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $class = Level::withCount('students')->findOrFail($id);

            if ($class->students_count > 0) {
                return response()->json([
                    'message' => 'Cannot delete a class with enrolled students',
                    'status' => 409,
                ], 409);
            }

            $class->delete();

            return response()->json([
                'message' => 'Class deleted successfully',
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting class',
                'status' => 404,
                'error' => $e->getMessage(),
            ], 404);
        }
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
                            'email' => $user->email,
                            'title' => $user->title,
                            'allocatedSubjects' => [],
                        ];
                    }
                    // Add the subject details to the user's allocatedSubjects array
                    $uniqueUsers[$userId]['allocatedSubjects'][] = [
                        'subjectName' => $subject->name,
                        'code' => $subject->code,
                        'periodsPerWeek' => $subject->periodsPerWeek,

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
            $class = Level::with([
                'students' => function ($query) {
                    $query->with([
                        'subjects' => function ($query) {
                            $query->select('subjects.id', 'subjects.name')
                                ->withPivot('averageScore');
                        }
                    ]);
                }
            ])->findOrFail($id);

            // Transform the data
            $classDetails = [
                'id' => $class->id,
                'className' => $class->className,
                'students' => $class->students->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'firstname' => $student->firstname,
                        'surname' => $student->surname,
                        'subjects' => $student->subjects->map(function ($subject) {
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
