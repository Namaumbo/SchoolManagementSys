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
    public function updateAssessment(Request $request): JsonResponse
    {
        $response = [];
        $code = 200;

        try {
            $subject = Subject::where('name', $request->input('name'))->firstOrFail();
            $student = Student::where('username', $request->input('username'))->firstOrFail();

            $assessment = Assessment::where('subject_id', $subject->id)
                ->where('student_id', $student->id)
                ->firstOrFail();

            $firstAssessment = $this->validateNumeric($request->input('firstAssessment'));
            $secondAssessment = $this->validateNumeric($request->input('secondAssessment'));
            $endOfTermAssessment = $this->validateEndOfTermAssessment($request->input('endOfTermAssessment'));

            // Allow zero values for assessments
            if ($firstAssessment < 0 || $secondAssessment < 0) {
                throw new \InvalidArgumentException('Assessment values cannot be negative.');
            }

            // Calculate average score based on the number of assessments entered
            if (!empty($firstAssessment) && empty($secondAssessment) && empty($endOfTermAssessment)) {
                // If only the first assessment is provided, calculate it as a percentage
                $averageScore = $firstAssessment / 100 * 100;
            } elseif (!empty($firstAssessment) && !empty($secondAssessment) && empty($endOfTermAssessment)) {
                // If both first and second assessments are provided, calculate the average without multiplying by weights
                $averageScore = ($firstAssessment + $secondAssessment) / 2;
            } elseif (!empty($firstAssessment) && !empty($secondAssessment) && !empty($endOfTermAssessment)) {
                // Calculate average for endOfTermAssessment
                $endOfTermAssessmentAverage = array_sum($endOfTermAssessment) / count($endOfTermAssessment);

                // 40% of the sum of first and second assessments, 60% of the endOfTermAssessment average
                $averageScore = ($firstAssessment + $secondAssessment) * 0.2 + $endOfTermAssessmentAverage * 0.6;
            } else {
                // Allow the case where all assessments are zero
                if ($firstAssessment == 0 && $secondAssessment == 0 && empty($endOfTermAssessment)) {
                    $averageScore = 0;
                } else {
                    throw new \InvalidArgumentException('Invalid combination of assessments provided.');
                }
            }

            // Ensure the average is a percentage value and not greater than 100
            if ($averageScore > 100) {
                throw new \InvalidArgumentException('Invalid average score. The calculated percentage cannot exceed 100.');
            }

            // Update the assessment record
            $assessment->update([
                'schoolTerm' => $request->input('schoolTerm'),
                'teacherEmail' => $request->input('teacherEmail'),
                'firstAssessment' => $firstAssessment,
                'secondAssessment' => $secondAssessment,
                'endOfTermAssessment' => $endOfTermAssessment,
                'averageScore' => $averageScore,
                'updated_at' => Carbon::now(),
                'created_at' => Carbon::now(),
            ]);

            $response['message'] = 'Assessment updated successfully';
            $response['status'] = 'Success';
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

    private function validateEndOfTermAssessment($value)
    {
        // Ensure $value is an array
        if (!is_array($value)) {
            throw new \InvalidArgumentException('endOfTermAssessment must be an array.');
        }

        // Validate each value in the array
        foreach ($value as $item) {
            $this->validateNumeric($item);
        }

        return $value;
    }
}
