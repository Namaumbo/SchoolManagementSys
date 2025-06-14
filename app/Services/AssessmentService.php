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
            // Log the start of the process and the incoming request data
            Log::info('Starting assessment update/create process', ['request' => $request->all()]);

            // Begin a database transaction to ensure atomicity
            DB::beginTransaction();

            // Validate the input data from the request
            $this->validateInput($request);
            Log::info('Input validation passed');

            // Find the subject by name or throw an exception if not found
            $subject = Subject::where('name', $request->input('name'))->firstOrFail();
            Log::info('Subject found', ['subject_id' => $subject->id, 'name' => $subject->name]);

            // Find the student by username or throw an exception if not found
            $student = Student::where('username', $request->input('username'))->firstOrFail();
            Log::info('Student found', ['student_id' => $student->id, 'username' => $student->username]);

            // Prepare the data for first, second, and end-of-term assessments
            // These can now be null if not provided in the request
            $firstAssessment = $this->validateNumeric($request->input('firstAssessment', null));
            $secondAssessment = $this->validateNumeric($request->input('secondAssessment', null));
            // Default to an empty JSON array string if not provided
            $endOfTermAssessment = $request->input('endOfTermAssessment', '[]');

            // Decode the endOfTermAssessment JSON string into an array
            $endOfTermAssessmentArray = json_decode($endOfTermAssessment, true) ?? [];
            if (!is_array($endOfTermAssessmentArray)) {
                // If decoding fails or results in non-array, log and throw an error
                Log::error('Invalid endOfTermAssessment format', ['endOfTermAssessment' => $endOfTermAssessment]);
                throw new \InvalidArgumentException('Invalid endOfTermAssessment format. Expected JSON array.');
            }
            Log::info('End of term assessment array decoded successfully');

            // Calculate the average score based on all provided assessments
            $averageScore = $this->calculateAverageScore($firstAssessment, $secondAssessment, $endOfTermAssessmentArray);
            Log::info('Average score calculated', ['averageScore' => $averageScore]);

            // Encode the endOfTermAssessmentArray back to JSON string for storage
            $endOfTermAssessmentJson = !empty($endOfTermAssessmentArray) ? json_encode($endOfTermAssessmentArray) : null;

            // Define the attributes used to find an existing assessment record
            $assessmentSearchAttributes = [
                'subject_id' => $subject->id,
                'student_id' => $student->id,
            ];

            // Define the attributes to be set or updated on the assessment record
            $assessmentDataToUpdateOrCreate = [
                'schoolTerm' => $request->input('schoolTerm'),
                'teacherEmail' => $request->input('teacherEmail'),
                'firstAssessment' => $firstAssessment,
                'secondAssessment' => $secondAssessment,
                'endOfTermAssessment' => $endOfTermAssessmentJson,
                'averageScore' => $averageScore,
                'updated_at' => Carbon::now(), // Always update the timestamp
            ];

            // Use updateOrCreate:
            // If a record matching $assessmentSearchAttributes is found, it will be updated
            // with $assessmentDataToUpdateOrCreate.
            // If no record is found, a new one will be created with both sets of attributes.
            $assessment = Assessment::updateOrCreate(
                $assessmentSearchAttributes,
                $assessmentDataToUpdateOrCreate
            );

            Log::info('Assessment updated/created successfully', ['assessment_id' => $assessment->id]);

            // Commit the database transaction if all operations were successful
            DB::commit();

            // Prepare the success response
            $response['message'] = 'Assessment updated successfully'; // Can still say 'updated' for simplicity
            $response['status'] = 'success';
            $response['data'] = $assessment->fresh(); // Return the fresh instance of the assessment
        } catch (\InvalidArgumentException | ValidationException $e) {
            // Rollback the transaction on validation or invalid argument errors
            DB::rollBack();
           Log::error('Validation or Invalid Argument error occurred', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $response['message'] = $e->getMessage();
            $response['description'] = 'Invalid data provided. Please check your input and try again.';
            $response['status'] = 'fail';
            $code = 400; // Bad Request
        } catch (\Exception $e) {
            // Rollback the transaction on any other unexpected errors
            DB::rollBack();
           Log::error('Unexpected error occurred', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $response['message'] = 'An error occurred while processing the assessment.';
            $response['description'] = 'Please contact the IT officer.';
            $response['status'] = 'fail';
            $code = 500; // Internal Server Error
        }

        // Return the JSON response
        return response()->json($response, $code);
    }

    private function validateNumeric($value)
    {
        if (!is_numeric($value) || $value < 0 || $value > 100) {
            throw new \InvalidArgumentException('Invalid assessment value. Values must be between 0 and 100.');
        }

        return (float) $value;
    }

    private function calculateAverageScore($firstAssessment, $secondAssessment, $endOfTermAssessmentArray)
    {
        if ($firstAssessment < 0 || $secondAssessment < 0) {
            throw new \InvalidArgumentException('Assessment values cannot be negative.');
        }

        if (!empty($firstAssessment) && empty($secondAssessment) && empty($endOfTermAssessmentArray)) {
            return $firstAssessment;
        } elseif (!empty($firstAssessment) && !empty($secondAssessment) && empty($endOfTermAssessmentArray)) {
            return ($firstAssessment + $secondAssessment) / 2;
        } elseif (!empty($firstAssessment) && !empty($secondAssessment) && !empty($endOfTermAssessmentArray)) {
            $endOfTermAssessmentAverage = array_sum($endOfTermAssessmentArray) / count($endOfTermAssessmentArray);
            return ($firstAssessment + $secondAssessment) * 0.2 + $endOfTermAssessmentAverage * 0.6;
        } else {
            return 0;
        }
    }

    private function validateInput(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'username' => 'required|string',
            'schoolTerm' => 'required|string',
            'teacherEmail' => 'required|email',
            'firstAssessment' => 'required|numeric|min:0|max:100',
            'secondAssessment' => 'required|numeric|min:0|max:100',
            'endOfTermAssessment' => 'sometimes|json',
        ]);
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
