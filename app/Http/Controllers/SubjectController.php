<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\StudentSubject;
use App\Models\Student;
use App\Models\User;
use App\Models\Relationship;
use App\Http\Resources\SubjectResource;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Resources\RelationshipResource;

use App\Http\Resources\AssessmentResource;
use App\Http\Resources\StudentResource;
use lluminate\Http\Resources\Json\AnonymousResourceCollection;

class SubjectController extends Controller
{


    public function getAll()
    {
        return Subject::all();
    }

    public function show(int $id)
    {

        $subject = Subject::with('students', 'users')->findorFail($id);
        $relatedStudents = $subject->students;
        $relatedTeachers = $subject->users;
        return response()->json([

            'Students' => $relatedStudents,
            'Teachers' => $relatedTeachers,
        ], 201);
    }
    public function subjectPerformance()
{
    try {
        $subjects = Subject::with(['students', 'students.assessments'])
                            ->get();

        $subjectPerformance = [];

        foreach ($subjects as $subject) {
            $averageScore = $this->calculateAverageScore($subject->students);
            
            $subjectData = [
                'subject_id' => $subject->id,
                'subject_name' => $subject->name,
                'performance' => [
                    'average_score' => $averageScore,
                    // You can add more performance metrics here
                ]
            ];

            $subjectPerformance[] = $subjectData;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Subject performance data retrieved successfully',
            'data' => $subjectPerformance,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to retrieve subject performance data',
            'error' => $e->getMessage(),
        ], 500);
    }
}

private function calculateAverageScore($students)
{
    $totalScore = 0;
    $totalStudents = $students->count();

    foreach ($students as $student) {
        foreach ($student->assessments as $assessment) {
            // Assuming 'averageScore' is the attribute name for the score
            $totalScore += $assessment->averageScore;
        }
    }

    return $totalStudents > 0 ? $totalScore / $totalStudents : 0;
}



    public function create(Request $request, $subject): void
    {
        $subject->name = $request->name;
        $subject->created_at = carbon::now();
        $subject->updated_at = carbon::now();

        $subject->save();
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
        ]);

        try {
            $subject = Subject::create([
                'name' => $validatedData['name'],
            ]);
            return response()->json([
                'message' => 'Subject saved successfully',
                'Subject' => $subject,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Subject not saved',
                'e' => $e->getMessage(),
            ], 404);
        }
    }

    public function gradingSystem(Request $request, string $id): JsonResponse
    {


        $response = new StudentResource(Student::findorFail($id));


        return response()->json([


            'Score' => $response->assessments,


        ], 400);
    }
    public function update(Request $request, int $id): JsonResponse
    {
        if (Subject::where('id', $id)->exists()) {
            $subject = Subject::find($id);
            $this->create($request, $subject);
            return response()->json([
                'message' => 'Subject is updated successfully'
            ], 400);
        } else {
            return response()->json([
                'message' => 'No Subject found with that information '
            ], 401);
        }
    }

    public function destroy($id): JsonResponse
    {

        if (Subject::where('id', $id)->exists()) {
            $subject = Subject::find($id);
            $subject->delete();
            return response()->json([
                'message' => 'Subject is deleted successfully'
            ], 404);
        } else {
            return response()->json([
                'message' => 'No such Subject found in the database ',
            ]);
        }
    }
}
