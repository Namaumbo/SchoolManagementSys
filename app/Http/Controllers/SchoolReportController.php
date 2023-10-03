<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SchoolReportController extends Controller
{


    public function store(Request $request)
    {
        $reportData = Assessment::select(
            'averageScore',
            'subject_id',
            'student_id',
            'name',
            'firstname',
            'surname'
        )
            ->join('students', 'students.id', '=', 'assessments.student_id')
            ->join('subjects', 'subjects.id', '=', 'assessments.subject_id')
            ->get();


        $processedData = $this->processReportData($reportData);
        $subjectCounts = $this->numberOfRegisteredSubjects($reportData);
        return response()->json([
            'status' => 'success',
            'message' => 'Grades report generated successfully',
            'data' => ['report' => $processedData, 'registeredSubject' => $subjectCounts]
        ]);
    }

    public function processReportData($assessment)
    {
        // Define the passing score for English.
        $passingScoreForEnglish = 50; // Adjust this value as needed.

        $processedData = [];
        $studentData = [];

        foreach ($assessment as $row) {
            $studentId = $row->student_id;
            $subjectName = $row->name;
            $score = $row->averageScore;

            if (!isset($studentData[$studentId])) {
                $studentData[$studentId] = [
                    'student_id' => $studentId,
                    'student_name' => $row->firstname . ' ' . $row->surname,
                    'english_score' => null, // Initialize English score to null.
                    'subject_count' => 0,
                    'assessments' => [],
                    'failed' => false, // Initialize the "failed" flag to false.
                ];
            }

            if ($subjectName === 'English') {
                $studentData[$studentId]['english_score'] = $score;
                if ($score < $passingScoreForEnglish) {
                    $studentData[$studentId]['english_passed'] = false;
                    $studentData[$studentId]['failed'] = true; // Set the "failed" flag to true if English is failed.
                } else {
                    $studentData[$studentId]['english_passed'] = true;
                }
            }

            $studentData[$studentId]['subject_count']++;

            $studentData[$studentId]['assessments'][] = [
                'assessment_name' => $subjectName,
                'subject_id' => $row->subject_id,
                'score' => $score,
            ];
        }

        $finalProcessedData = array_values($studentData);

        foreach ($finalProcessedData as &$student) {
            if (!isset($student['english_passed'])) {
                // If English score is not set, it means the student did not take English.
                $student['english_passed'] = false;
                $student['failed'] = true; // Set the "failed" flag to true if English was not taken.
            }

            if (!$student['english_passed'] || $student['subject_count'] < 6) {
                $student['analysis'] = 'Needs improvement';
                $student['failed'] = true; // Set the "failed" flag to true if the conditions are not met.
            }
        }

        return $finalProcessedData;
    }


    public function gradeCalculator($score)
    {

        $gradeMappings = [
            ['min' => 90, 'max' => 100, 'grade' => '1'],
            ['min' => 80, 'max' => 89, 'grade' => '2'],
            ['min' => 70, 'max' => 79, 'grade' => '3'],
            ['min' => 60, 'max' => 69, 'grade' => '4'],
            ['min' => 0, 'max' => 59, 'grade' => '5'],
        ];
        foreach ($gradeMappings as $mapping) {
            if ($score >= $mapping['min'] && $score <= $mapping['max']) {
                return $mapping['grade'];
            }
        }
    }
    public function numberOfRegisteredSubjects()
    {
        $subjects = Subject::all();

        $subjectCounts = [];

        foreach ($subjects as $subject) {
            $subjectCounts[$subject->name] = $subject->students()->count();
        }
        return $subjectCounts;
    }



    public function show($id)
    {
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
    }

    public function destroy($id)
    {
    }
}
