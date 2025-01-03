<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class SchoolReportController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Retrieve assessment data with related student and subject information
            $reportData = Assessment::select(
                'assessments.averageScore',
                'assessments.subject_id',
                'assessments.student_id',
                'subjects.name',
                'students.firstname',
                'students.surname',
                'students.className' // Include className column
            )
                ->join('students', 'students.id', '=', 'assessments.student_id')
                ->join('subjects', 'subjects.id', '=', 'assessments.subject_id')
                ->get();

            // Process the assessment data to generate the grades report
            $processedData = $this->processReportData($reportData);

            // Return the grades report as JSON response
            return response()->json([
                'status' => 'success',
                'message' => 'Grades report generated successfully',
                'data' => $processedData,
            ]);
        } catch (\Exception $e) {
            // Return error response if an exception occurs
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate grades report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function calculateGPA($score, $formLevel, $subjectName)
    {
        $points = null;
        $grade = null;
        $remark = null;
        $analysis = null;

        if ($formLevel == 'Junior Section') {
            // Define grade mappings for junior section
            $gradeMappings = [
                ['min' => 75, 'max' => 100, 'grade' => 'A', 'remark' => 'Distinction'],
                ['min' => 65, 'max' => 74, 'grade' => 'B', 'remark' => 'Very Good'],
                ['min' => 55, 'max' => 64, 'grade' => 'C', 'remark' => 'Good'],
                ['min' => 40, 'max' => 54, 'grade' => 'D', 'remark' => 'Pass'],
                ['min' => 0, 'max' => 39, 'grade' => 'F', 'remark' => 'Fail'],
            ];

            foreach ($gradeMappings as $mapping) {
                if ($score >= $mapping['min'] && $score <= $mapping['max']) {
                    $grade = $mapping['grade'];
                    $remark = $mapping['remark'];

                    if ($subjectName === 'English') {
                        if ($score >= $this->getPassingScore()) {
                            $points = 1;
                        }
                    }
                }
            }
        } elseif ($formLevel == 'Senior Section') {
            // Define points for the senior section
            $pointsMappings = [
                ['min' => 0, 'max' => 33, 'points' => 9, 'analysis' => 'Fail'],
                ['min' => 34, 'max' => 40, 'points' => 8, 'analysis' => 'Pass'],
                ['min' => 41, 'max' => 47, 'points' => 7, 'analysis' => 'Pass'],
                ['min' => 48, 'max' => 54, 'points' => 6, 'analysis' => 'Credit'],
                ['min' => 55, 'max' => 61, 'points' => 5, 'analysis' => 'Credit'],
                ['min' => 62, 'max' => 68, 'points' => 4, 'analysis' => 'Credit'],
                ['min' => 69, 'max' => 74, 'points' => 3, 'analysis' => 'Credit'],
                ['min' => 75, 'max' => 84, 'points' => 2, 'analysis' => 'Distinction'],
                ['min' => 85, 'max' => 100, 'points' => 1, 'analysis' => 'Distinction'],
            ];

            foreach ($pointsMappings as $mapping) {
                if ($score >= $mapping['min'] && $score <= $mapping['max']) {
                    $points = $mapping['points'];
                    $analysis = $mapping['analysis'];

                    if ($subjectName === 'English' && $score >= $this->getPassingScore()) {
                        $points = 1;
                    }
                }
            }
        } else {
            // Handle other form levels or situations
            $grade = 'N/A';
            $remark = 'N/A';
        }

        return ['grade' => $grade, 'remark' => $remark, 'points' => $points, 'analysis' => $analysis, 'position' => null];
    }

    private function processReportData($assessment)
    {
        $processedData = [];
        $subjectRegistrations = [];

        foreach ($assessment as $row) {
            $studentId = $row->student_id;
            $subjectName = $row->name;
            $score = $row->averageScore;
            $className = $row->className ?? null;

            // Determine the form level based on the class name
            $formLevel = $this->determineFormLevel($className);

            $gpaData = $this->calculateGPA($score, $formLevel, $subjectName);

            if (!isset($processedData[$studentId])) {
                $processedData[$studentId] = [
                    'student_id' => $studentId,
                    'student_name' => $row->firstname . ' ' . $row->surname,
                    'class' => $row->className,
                    'subject_count' => 0,
                    'assessments' => [],
                    'failed' => false,
                    'total_marks' => 0,
                    'total_points' => 0,
                    'overall_grade' => null,
                    'overall_points' => null,
                    'head_teacher_comment' => '',
                    'class_teacher_comment' => '',
                    'passed_subject_count' => 0, // Track passed subjects count
                ];
            }

            // Update subject registration count
            if (!isset($subjectRegistrations[$subjectName])) {
                $subjectRegistrations[$subjectName] = 0;
            }
            $subjectRegistrations[$subjectName]++;

            $processedData[$studentId]['assessments'][] = [
                'assessment_name' => $subjectName,
                'subject_id' => $row->subject_id,
                'score' => $score,
                'grade' => $gpaData['grade'],
                'points' => $gpaData['points'],
                'remark' => $gpaData['remark'],
                'analysis' => $gpaData['analysis'],
                'registration_count' => $subjectRegistrations[$subjectName],
            ];

            // Accumulate total marks for all subjects
            $processedData[$studentId]['total_marks'] += $score;

            // Accumulate English score
            if ($subjectName === 'English') {
                $processedData[$studentId]['english_score'] = $score;
            }

            if ($formLevel === 'Junior Section') {
                // Calculate overall grade for junior section students
                $processedData[$studentId]['subject_count']++;
                if ($gpaData['grade'] !== 'F') {
                    $processedData[$studentId]['passed_subject_count']++;
                }
            } elseif ($formLevel === 'Senior Section') {
                // Calculate total points for senior section students
                if ($this->isSubjectConsidered($subjectName, $score, $gpaData['points'])) {
                    $processedData[$studentId]['subject_count']++;
                    $processedData[$studentId]['total_points'] += $gpaData['points'];
                }
            }

            // Check if the student has failed
            if ($gpaData['remark'] === 'Fail') {
                $processedData[$studentId]['failed'] = true;
            }
        }

        // Calculate overall grade for junior section students
        foreach ($processedData as $studentId => $studentData) {
            if ($this->isJuniorSection($studentData['class'])) {
                $totalMarks = $studentData['total_marks'];
                $subjectCount = $studentData['subject_count'];

                if ($subjectCount >= 6) {
                    $overallGPA = $totalMarks / $subjectCount;
                    $overallGradeData = $this->calculateGPA($overallGPA, 'Junior Section', 'Overall');
                    $processedData[$studentId]['overall_grade'] = $overallGradeData['grade'];

                    // Add head teacher and class teacher comments for junior section
                    if ($overallGradeData['remark'] === 'Fail' || $studentData['passed_subject_count'] < 6) {
                        $processedData[$studentId]['head_teacher_comment'] = 'This student has not met the required academic performance standards.';
                        $processedData[$studentId]['class_teacher_comment'] = 'This student should consider seeking additional support and focusing on improvement.';
                        $processedData[$studentId]['failed'] = true;
                    } else {
                        $processedData[$studentId]['head_teacher_comment'] = 'This student has met the required academic performance standards.';
                        $processedData[$studentId]['class_teacher_comment'] = 'This student is performing well in their subjects.';
                    }
                } else {
                    $processedData[$studentId]['head_teacher_comment'] = 'This student has not met the required academic performance standards.';
                    $processedData[$studentId]['class_teacher_comment'] = 'This student should consider seeking additional support and focusing on improvement.';
                    $processedData[$studentId]['failed'] = true;
                }
            }
        }

        return array_values($processedData);
    }

    private function determineFormLevel($className)
    {
        // Define form levels based on class name patterns
        $juniorPatterns = ['/form \d+/i', '/JSS/i'];
        $seniorPatterns = ['/SS/i', '/form \d+/i'];

        foreach ($juniorPatterns as $pattern) {
            if (preg_match($pattern, $className)) {
                return 'Junior Section';
            }
        }

        foreach ($seniorPatterns as $pattern) {
            if (preg_match($pattern, $className)) {
                return 'Senior Section';
            }
        }

        // Default to 'Other' if class name doesn't match expected patterns
        return 'Other';
    }

    private function isJuniorSection($className)
    {
        // Determine if the class belongs to the junior section
        return $this->determineFormLevel($className) === 'Junior Section';
    }

    private function isSubjectConsidered($subjectName, $score, $points)
    {
        // Check if the subject score should be considered for senior section GPA calculation
        return $subjectName !== 'English' || ($subjectName === 'English' && $score >= $this->getPassingScore());
    }

    private function getPassingScore()
    {
        // Define passing score for English subject
        return 50;
    }
}
