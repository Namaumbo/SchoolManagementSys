<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AssessmentService
{
    /**
     * This code snippet represents the updateAssessment method of the AssessmentService class.
     * It takes a Request object as a parameter and returns a JsonResponse.
     * The method updates an assessment record based on the provided request data.
     * It retrieves the subject and student based on the request input, and then retrieves the assessment record.
     * The method validates the first and second assessments, ensuring they are not negative.
     * It decodes the endOfTermAssessment if it's not empty and calculates the average score based 
     * on the number of assessments entered.
     * The method updates the assessment record with the new data and returns a JsonResponse with the result.
     * If an exception occurs, it catches the exception, sets an error message and status, and returns a 
     * JsonResponse with the error details.
     */
    public function updateAssessment(Request $request): JsonResponse
    {
        $response = [];
        $code = 200;

        try {
            // removed firstorfaill to avoid unnecessary language message message
            $subject = Subject::where('name', $request->input('name'))->first();
            $student = Student::where('username', $request->input('username'))->first();

            if (!$subject || !$student) {
                throw new \InvalidArgumentException('Invalid subject or student.');
            }

            $assessment = Assessment::where('subject_id', $subject->id)
                ->where('student_id', $student->id)
                ->first();

            if (!$assessment) {
                throw new \InvalidArgumentException('Assessment not found.');
            }
            $firstAssessment = $this->validateNumeric($request->input('firstAssessment'));
            $secondAssessment = $this->validateNumeric($request->input('secondAssessment'));
            $endOfTermAssessment = $request->input('endOfTermAssessment', []);

            // Allow zero values for assessments
            // but this is already done with the $this validateNumeric
            if ($firstAssessment < 0 || $secondAssessment < 0) {
                throw new \InvalidArgumentException('Assessment values cannot be negative.');
            }

            // Decode the endOfTermAssessment if it's not empty
            $endOfTermAssessmentArray = !empty($endOfTermAssessment) ? json_decode($endOfTermAssessment, true) : [];

            // Calculate average score based on the number of assessments entered
            if (!empty($firstAssessment) && empty($secondAssessment) && empty($endOfTermAssessmentArray)) {
                $averageScore = $firstAssessment / 100 * 100;
            } elseif (!empty($firstAssessment) && !empty($secondAssessment) && empty($endOfTermAssessmentArray)) {
                $averageScore = ($firstAssessment + $secondAssessment) / 2;
            } elseif (!empty($firstAssessment) && !empty($secondAssessment) && !empty($endOfTermAssessmentArray)) {
                $endOfTermAssessmentAverage = array_sum($endOfTermAssessmentArray) / count($endOfTermAssessmentArray);
                $averageScore = ($firstAssessment + $secondAssessment) * 0.2 + $endOfTermAssessmentAverage * 0.6;
            } else {
                if ($firstAssessment == 0 && $secondAssessment == 0 && empty($endOfTermAssessmentArray)) {
                    $averageScore = 0;
                } else {
                    throw new \InvalidArgumentException('Invalid combination of assessments provided.');
                }
            }

            $endOfTermAssessmentJson = !empty($endOfTermAssessmentArray) ? json_encode($endOfTermAssessmentArray) : null;

            // Update the assessment record
            $assessment->update([
                'schoolTerm' => $request->input('schoolTerm'),
                'teacherEmail' => $request->input('teacherEmail'),
                'firstAssessment' => $firstAssessment,
                'secondAssessment' => $secondAssessment,
                'endOfTermAssessment' => $endOfTermAssessmentJson,
                'averageScore' => $averageScore,

            ]);

            $response['message'] = 'Assessment updated successfully';
            $response['status'] = 'success';
        } catch (\Exception $e) {
            $response['message'] = $e->getMessage();
            $response['description'] = 'Error encountered. Please contact the IT officer.';
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

        return $value;
    }
}
