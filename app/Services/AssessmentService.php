<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Level;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AssessmentService
{
    public function updateAssessment(Request $request): JsonResponse
    {
        $response = [];
        $code = 200; // Default success code

        try {
            Log::info('Starting assessment update/create process', ['request' => $request->all()]);
            DB::beginTransaction();

            // Relaxed validation to allow partial updates
            $this->validateInput($request);
            Log::info('Input validation passed');

            $subject = Subject::where('name', $request->input('name'))->firstOrFail();
            Log::info('Subject found', ['subject_id' => $subject->id, 'name' => $subject->name]);

            $student = Student::where('username', $request->input('username'))->firstOrFail();
            Log::info('Student found', ['student_id' => $student->id, 'username' => $student->username]);

            // Optional assessments
            $firstAssessment = $request->has('firstAssessment')
                ? $this->validateNumeric($request->input('firstAssessment'))
                : null;

            $secondAssessment = $request->has('secondAssessment')
                ? $this->validateNumeric($request->input('secondAssessment'))
                : null;

            $endOfTermAssessment = $request->has('endOfTermAssessment')
                ? $this->validateNumeric($request->input('endOfTermAssessment'))
                : null;

            Log::info('End of term assessment processed successfully');

            $averageScore = $this->calculateAverageScore($firstAssessment, $secondAssessment, $endOfTermAssessment);
            Log::info('Average score calculated', ['averageScore' => $averageScore]);



            $assessmentSearchAttributes = [
                'subject_id' => $subject->id,
                'student_id' => $student->id,
            ];

            // Only update fields that were provided
            $assessmentDataToUpdateOrCreate = [
                'schoolTerm' => $request->input('schoolTerm'),
                'teacherEmail' => $request->input('teacherEmail'),
                'updated_at' => Carbon::now(),
            ];

            if (!is_null($firstAssessment)) {
                $assessmentDataToUpdateOrCreate['firstAssessment'] = $firstAssessment;
            }

            if (!is_null($secondAssessment)) {
                $assessmentDataToUpdateOrCreate['secondAssessment'] = $secondAssessment;
            }

            if (!is_null($endOfTermAssessment)) {
                $assessmentDataToUpdateOrCreate['endOfTermAssessment'] = $endOfTermAssessment;
            }

            $assessmentDataToUpdateOrCreate['averageScore'] = (int) round($averageScore);

            $assessment = Assessment::updateOrCreate(
                $assessmentSearchAttributes,
                $assessmentDataToUpdateOrCreate
            );

            Log::info('Assessment updated/created successfully', ['assessment_id' => $assessment->id]);

            DB::commit();

            $response['message'] = 'Assessment updated successfully';
            $response['status'] = 'success';
            $response['data'] = $assessment->fresh();
        } catch (\InvalidArgumentException | ValidationException $e) {
            DB::rollBack();
            Log::error('Validation or Invalid Argument error occurred', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $response['message'] = $e->getMessage();
            $response['description'] = 'Invalid data provided. Please check your input and try again.';
            $response['status'] = 'fail';
            $code = 400;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Unexpected error occurred', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $response['message'] = 'An error occurred while processing the assessment.';
            $response['description'] = 'Please contact the IT officer.';
            $response['status'] = 'fail';
            $code = 500;
        }

        return response()->json($response, $code);
    }
    private function validateNumeric($value)
    {
        if (!is_numeric($value) || $value < 0 || $value > 100) {
            throw new \InvalidArgumentException('Invalid assessment value. Values must be between 0 and 100.');
        }

        return (float) $value;
    }


    private function validateInput(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'username' => 'required|string',
            'schoolTerm' => 'required|string',
            'teacherEmail' => 'required|email',
            'firstAssessment' => 'sometimes|numeric|min:0|max:100',
            'secondAssessment' => 'sometimes|numeric|min:0|max:100',
            'endOfTermAssessment' => 'sometimes|numeric|min:0|max:100',
        ]);
    }

    private function calculateAverageScore($firstAssessment, $secondAssessment, $endOfTermAssessment)
    {
        $components = [];

        if (!is_null($firstAssessment)) {
            $components[] = $firstAssessment;
        }

        if (!is_null($secondAssessment)) {
            $components[] = $secondAssessment;
        }

        if (!is_null($endOfTermAssessment)) {
            $components[] = $endOfTermAssessment;
        }

        if (empty($components)) {
            return 0;
        }

        return (int) round(array_sum($components) / count($components));
    }


    // Fetch all assessments with student and subject relations
    public function getAllAssessments(Request $request): JsonResponse
    {
        try {
            Log::info('Fetching assessments', [
                'class_filter' => $request->input('class'),
                'student_filter' => $request->input('student'),
                'subject_filter' => $request->input('subject'),
            ]);

            $query = Assessment::query()->with(['student', 'subject']);

            if ($request->filled('class')) {
                $level = Level::where('className', $request->input('class'))->first();

                if (!$level) {
                    Log::warning('No level found for class', ['class' => $request->input('class')]);
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Class not found',
                    ], 404);
                }

                $query->whereHas('student', function ($studentQuery) use ($level) {
                    $studentQuery->where('level_id', $level->id);
                });
            }

            if ($request->filled('student')) {
                $query->where('student_id', $request->input('student'));
            }

            if ($request->filled('subject')) {
                $subjectFilter = $request->input('subject');
                $query->whereHas('subject', function ($subjectQuery) use ($subjectFilter) {
                    if (is_numeric($subjectFilter)) {
                        $subjectQuery->where('id', $subjectFilter);
                    } else {
                        $subjectQuery->where('name', $subjectFilter);
                    }
                });
            }

            $assessments = $query
                ->get()
                ->map(fn (Assessment $assessment) => $this->formatAssessmentRecord($assessment))
                ->values();

            Log::info('Assessments found', ['count' => $assessments->count()]);

            return response()->json([
                'status' => 'success',
                'data' => $assessments,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching assessments', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong',
            ], 500);
        }
    }

    private function formatAssessmentRecord(Assessment $assessment): array
    {
        $student = $assessment->student;
        $subject = $assessment->subject;

        return [
            'id' => $assessment->id,
            'schoolTerm' => $assessment->schoolTerm,
            'teacherEmail' => $assessment->teacherEmail,
            'subject_id' => $assessment->subject_id,
            'student_id' => $assessment->student_id,
            'firstAssessment' => $assessment->firstAssessment,
            'secondAssessment' => $assessment->secondAssessment,
            'endOfTermAssessment' => $assessment->endOfTermAssessment,
            'averageScore' => $assessment->averageScore,
            'created_at' => $assessment->created_at,
            'updated_at' => $assessment->updated_at,
            'firstname' => $student?->firstname,
            'surname' => $student?->surname,
            'username' => $student?->username,
            'sex' => $student?->sex,
            'village' => $student?->village,
            'traditional_authority' => $student?->traditional_authority,
            'district' => $student?->district,
            'level_id' => $student?->level_id,
            'student_created_at' => $student?->created_at,
            'student_updated_at' => $student?->updated_at,
            'subject_name' => $subject?->name,
            'code' => $subject?->code,
            'periodsPerWeek' => $subject?->periodsPerWeek,
            'department' => $subject?->department,
            'description' => $subject?->description,
            'status' => $subject?->status,
            'subject_created_at' => $subject?->created_at,
            'subject_updated_at' => $subject?->updated_at,
        ];
    }

    public function getAssessmentsByClass(Request $request): JsonResponse
    {
        if ($request->filled('className') && !$request->filled('class')) {
            $request->merge(['class' => $request->input('className')]);
        }

        return $this->getAllAssessments($request);
    }
}
