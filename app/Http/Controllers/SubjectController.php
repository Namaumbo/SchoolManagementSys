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
        $subject = Subject::with('students', 'users')->findOrFail($id);
        $relatedStudents = $subject->students;
        $relatedTeachers = $subject->users;
        return response()->json([
            'Students' => $relatedStudents,
            'Teachers' => $relatedTeachers,
        ], 201);
    }

    public function create(Request $request, $subject): void
    {
        $subject->name = $request->name;
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
        $response = new StudentResource(Student::findOrFail($id));

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
