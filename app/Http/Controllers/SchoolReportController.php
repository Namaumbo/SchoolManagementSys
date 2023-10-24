<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Assessment;
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
            'surname',
            'className'
        )
            ->join('students', 'students.id', '=', 'assessments.student_id')
            ->join('subjects', 'subjects.id', '=', 'assessments.subject_id')
            ->get();

        $processedData = $this->processReportData($reportData);

        return response()->json([
            'status' => 'success',
            'message' => 'Grades report generated successfully',
            'data' => $processedData,
        ]);
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

                if ($formLevel == 'Junior Section' && $subjectName === 'English') {
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
            ['min' => 84, 'max' => 100, 'points' => 1, 'analysis' => 'Distinction'],
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
                    'position' => null,
                    'english_score' => 0,
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
    
            if ($this->isSubjectConsidered($subjectName, $score, $gpaData['points'])) {
                $processedData[$studentId]['subject_count']++;
                $processedData[$studentId]['total_points'] += $gpaData['points'];
            }
    
            // Check if the student has failed
            if ($gpaData['remark'] === 'Fail') {
                $processedData[$studentId]['failed'] = true;
            }
        }
    
        // Separate junior and senior section data
        $juniorSectionData = array_filter($processedData, function ($student) {
            return isset($student['class']) && $this->isJuniorSection($student['class']);
        });
    
        $seniorSectionData = array_filter($processedData, function ($student) {
            return isset($student['class']) && $this->isSeniorSection($student['class']);
        });
    
        // Calculate overall grade for junior section students
        foreach ($juniorSectionData as $studentId => $studentData) {
            $totalMarks = $studentData['total_marks'];
            $subjectCount = $studentData['subject_count'];
    
            if ($subjectCount >= 6) {
                $overallGPA = $totalMarks / $subjectCount;
                $overallGradeData = $this->calculateGPA($overallGPA, 'Junior Section', 'Overall');
                $juniorSectionData[$studentId]['overall_grade'] = $overallGradeData['grade'];
    
                // Add head teacher and class teacher comments for junior section
                if ($overallGradeData['remark'] === 'Fail') {
                    $juniorSectionData[$studentId]['head_teacher_comment'] = 'This student has not met the required academic performance standards.';
                    $juniorSectionData[$studentId]['class_teacher_comment'] = 'This student should consider seeking additional support and focusing on improvement.';
                } else {
                    $juniorSectionData[$studentId]['head_teacher_comment'] = 'This student has met the required academic performance standards.';
                    $juniorSectionData[$studentId]['class_teacher_comment'] = 'This student is performing well and should continue working hard.';
                }
            }
        }
    
        // Calculate overall points for senior section students
        foreach ($seniorSectionData as $studentId => $studentData) {
            $totalPoints = $studentData['total_points'];
            $subjectCount = $studentData['subject_count'];
    
            if ($subjectCount >= 6 || ($studentData['english_score'] >= $this->getPassingScore() && $subjectCount >= 5)) {
                $seniorSectionData[$studentId]['overall_points'] =round($totalPoints/$subjectCount);
    
                // Add head teacher and class teacher comments for senior section
                if (isset($seniorSectionData[$studentId]['overall_points']) && $seniorSectionData[$studentId]['overall_points'] > 0) {
                    $seniorSectionData[$studentId]['head_teacher_comment'] = 'This student has met the required academic performance standards.';
                    $seniorSectionData[$studentId]['class_teacher_comment'] = 'This student is performing well and should continue working hard';
                } else {
                    $seniorSectionData[$studentId]['head_teacher_comment'] = 'This student has not met the required academic performance standards.';
                    $seniorSectionData[$studentId]['class_teacher_comment'] = 'This student should consider seeking additional support and focusing on improvement.';
                }
            }
        }
    
        // Rank junior section students based on total marks and subject count
        $juniorSectionTotalMarks = [];
        foreach ($juniorSectionData as $student) {
            $juniorSectionTotalMarks[$student['student_id']] = $student['total_marks'];
        }
        arsort($juniorSectionTotalMarks);
        $rank = 1;
        foreach ($juniorSectionTotalMarks as $studentId => $totalMarks) {
            if ($juniorSectionData[$studentId]['subject_count'] >= 6) {
                $juniorSectionData[$studentId]['position'] = $rank;
            }
            $rank++;
        }
    
        // Rank senior section students based on total points and subject count
        $seniorSectionTotalPoints = [];
        foreach ($seniorSectionData as $student) {
            $seniorSectionTotalPoints[$student['student_id']] = $student['total_points'];
        }
        arsort($seniorSectionTotalPoints);
        $rank = 1;
        foreach ($seniorSectionTotalPoints as $studentId => $totalPoints) {
            if (isset($seniorSectionData[$studentId]['overall_points'])) {
                $seniorSectionData[$studentId]['position'] = $rank;
            }
            $rank++;
        }
    
        // Combine junior and senior section data
        $combinedData = [
            'junior_section' => array_values($juniorSectionData),
            'senior_section' => array_values($seniorSectionData),
        ];
    
        return $combinedData;
    }
    

    private function determineFormLevel($className)
    {
        if (preg_match('/^Form [12]/', $className)) {
            return 'Junior Section';
        } elseif (preg_match('/^Form [34]/', $className)) {
            return 'Senior Section';
        } else {
            return 'Other';
        }
    }

    private function isJuniorSection($className)
    {
        return preg_match('/^Form [12]/', $className);
    }

    private function isSeniorSection($className)
    {
        return preg_match('/^Form [34]/', $className);
    }

    private function isSubjectConsidered($subjectName, $score, $points)
    {
        return true; // Consider all subjects for passing criteria
    }

    private function getPassingScore()
    {
        return 33;
    }
}
