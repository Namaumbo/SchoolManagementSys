<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AssessmentService
{
    public function updateAssessment(Request $request): JsonResponse
    {
        $response = [];
        $code = 200;

        try {
            // Validate and sanitize input
            $this->validateInput($request);

            $subject = Subject::where('name', $request->input('name'))->firstOrFail();
            $student = Student::where('username', $request->input('username'))->firstOrFail();

            $assessment = Assessment::where('subject_id', $subject->id)
                ->where('student_id', $student->id)
                ->firstOrFail();

            $firstAssessment = $this->validateNumeric($request->input('firstAssessment'));
            $secondAssessment = $this->validateNumeric($request->input('secondAssessment'));
            $endOfTermAssessment = $request->input('endOfTermAssessment', '[]');

            // Decode endOfTermAssessment
            $endOfTermAssessmentArray = json_decode($endOfTermAssessment, true);
            if (!is_array($endOfTermAssessmentArray)) {
                throw new \InvalidArgumentException('Invalid endOfTermAssessment format.');
            }

            // Calculate average score
            $averageScore = $this->calculateAverageScore($firstAssessment, $secondAssessment, $endOfTermAssessmentArray);

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
            $response['status'] = 'Success';
        } catch (\InvalidArgumentException | ValidationException $e) {
            $response['message'] = $e->getMessage();
            $response['description'] = 'Invalid data provided. Please check your input and try again.';
            $response['status'] = 'fail';
            $code = 400;
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred while updating the assessment.';
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

        return (float) $value; // Ensure the value is numeric
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
}
