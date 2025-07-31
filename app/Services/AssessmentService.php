<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;
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

            $assessmentDataToUpdateOrCreate['averageScore'] = $averageScore;

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

        return array_sum($components) / count($components);
    }


    // Fetch all assessments with student and subject relations
    public function getAllAssessments(): JsonResponse
    {
        try {

            DB::beginTransaction();

            $assessments = Assessment::with(['student', 'subject'])->get();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $assessments,
            ], 200);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'fail',
                'message' => 'Error retrieving assessments',
                'description' => $e->getMessage(),
            ], 500);
        }
    }
}
