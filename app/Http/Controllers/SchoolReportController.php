<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Assessment;
use Illuminate\Http\JsonResponse;

/*
*
Class representing the SchoolReportController.

This class is responsible for generating grades reports for students in a school. It calculates the GPA, overall grade, overall points, 
and position of each student based on their assessment scores. The class also provides methods for processing and combining the assessment data, 
determining the form level of a student, and updating various student data fields.

Attributes:
    - assessment: An instance of the Assessment class used for retrieving assessment data.

Constants:
    - JUNIOR_SECTION: A constant representing the junior section of the school.
    - SENIOR_SECTION: A constant representing the senior section of the school.
    - OTHER: A constant representing other form levels or situations.

Methods:
    - __construct(assessment): Initializes the SchoolReportController with an instance of the Assessment class.
    - store(request): Generates the grades report and returns it as a JSON response.
    - calculateGPA(score, formLevel, subjectName): Calculates the GPA, grade, remark, points, and analysis for 
    a given score,
     form level, and subject name.
    - processReportData(assessment): Processes the assessment data and returns the combined report data.
    - determineFormLevel(className): Determines the form level based on the class name.
    - initializeStudentData(row): Initializes the student data with the provided row data.
    - processAssessmentData(studentData, subjectName, score, formLevel, gpaData): Processes the assessment data 
    for a student and 
    updates the student data.
    - updateSubjectRegistrations(subjectRegistrations, subjectName): Updates the subject registrations count for a 
    given subject name.
    - updateTotalMarks(studentData, score): Updates the total marks for a student.
    - updateEnglishScore(studentData, subjectName, score): Updates the English score for a student.
    - updateSubjectCountAndPoints(studentData, formLevel, subjectName, score, gpaData): Updates the subject count and total 
    points for a student.
    - updateFailedStatus(studentData, gpaData): Updates the failed status for a student.
    - calculateOverallGradeAndComments(processedData): Calculates the overall grade and comments for each student in the
     junior section.
    - calculateOverallPointsAndComments(processedData): Calculates the overall points and comments for each student
     in the senior section.
    - rankStudents(processedData): Ranks the students based on their total marks or total points.
    - combineData(processedData): Combines the processed data into separate arrays for the junior and senior sections.
    - isJuniorSection(className): Checks if a class name belongs to the junior section.
    - isSeniorSection(className): Checks if a class name belongs to the senior section.
    - isSubjectConsidered(subjectName, score, points): Checks if a subject should be considered for the passing criteria.
    - getPassingScore(): Returns the passing score for assessments.

"""

"""
*
*/

class SchoolReportController extends Controller
{
    private $assessment;

    const JUNIOR_SECTION = 'Junior Section';
    const SENIOR_SECTION = 'Senior Section';
    const OTHER = 'Other';

    public function __construct(Assessment $assessment)
    {
        $this->assessment = $assessment;
    }

    public function store(Request $request)
    {
        try {
            $reportData = $this->assessment->select(
                'averageScore',
                'assessments.subject_id',
                'assessments.student_id',
                'subjects.name',
                'students.firstname',
                'students.surname',
                'students.className'
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
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate grades report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * This code snippet calculates the grade, remark, points, analysis, and position based on the given score, form level, and subject name.
     * 
     * @param int $score The score obtained by the student.
     * @param string $formLevel The form level of the student (Junior Section, Senior Section, or Other).
     * @param string $subjectName The name of the subject.
     * @return array An array containing the calculated grade, remark, points, analysis, and position.
     */
    private function calculateGPA($score, $formLevel, $subjectName)
    {
        $points = null;
        $grade = null;
        $remark = null;
        $analysis = null;

        if ($formLevel == self::JUNIOR_SECTION) {
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

                    if ($formLevel == self::JUNIOR_SECTION && $subjectName === 'English') {
                        if ($score >= $this->getPassingScore()) {
                            $points = 1;
                        }
                    }
                }
            }
        } elseif ($formLevel == self::SENIOR_SECTION) {
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

    /**
     * Process the report data.
     *
     * @param array $assessment The assessment data.
     * @return array The processed data.
     */
    private function processReportData($assessment)
    {
        $processedData = [];
        $subjectRegistrations = [];

        foreach ($assessment as $row) {
            $studentId = $row->student_id;
            $subjectName = $row->name;
            $score = $row->averageScore;
            $className = $row->className ?? null;

            $formLevel = $this->determineFormLevel($className);

            $gpaData = $this->calculateGPA($score, $formLevel, $subjectName);

            if (!isset($processedData[$studentId])) {
                $processedData[$studentId] = $this->initializeStudentData($row);
            }

            $this->processAssessmentData($processedData[$studentId], $subjectName, $score, $formLevel, $gpaData);

            $this->updateSubjectRegistrations($subjectRegistrations, $subjectName);

            $this->updateTotalMarks($processedData[$studentId], $score);

            $this->updateEnglishScore($processedData[$studentId], $subjectName, $score);

            $this->updateSubjectCountAndPoints($processedData[$studentId], $formLevel, $subjectName, $score, $gpaData);

            $this->updateFailedStatus($processedData[$studentId], $gpaData);
        }

        $this->calculateOverallGradeAndComments($processedData);

        $this->calculateOverallPointsAndComments($processedData);

        $this->rankStudents($processedData);

        $combinedData = $this->combineData($processedData);

        return $combinedData;
    }

    private function determineFormLevel($className)
    {
        if (preg_match('/^Form [12]/', $className)) {
            return self::JUNIOR_SECTION;
        } elseif (preg_match('/^Form [34]/', $className)) {
            return self::SENIOR_SECTION;
        } else {
            return self::OTHER;
        }
    }

    private function initializeStudentData($row)
    {
        return [
            'student_id' => $row->student_id,
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
        ];
    }

    /**
     * Process assessment data for a student.
     *
     * @param array $studentData The data of the student.
     * @param string $subjectName The name of the subject.
     * @param int $score The score of the assessment.
     * @param string $formLevel The form level of the student.
     * @param array $gpaData The GPA data for the assessment.
     * @return void
     */
    private function processAssessmentData(&$studentData, $subjectName, $score, $formLevel, $gpaData)
    {
        $studentData['assessments'][] = [
            'assessment_name' => $subjectName,
            'subject_id' => $row->subject_id,
            'score' => $score,
            'grade' => $gpaData['grade'],
            'points' => $gpaData['points'],
            'remark' => $gpaData['remark'],
            'analysis' => $gpaData['analysis'],
            'registration_count' => $subjectRegistrations[$subjectName],
        ];
    }

    /**
     * Increments the count of subject registrations for a given subject name.
     *
     * @param array $subjectRegistrations The array containing the subject registrations count.
     * @param string $subjectName The name of the subject.
     * @return void
     */
    private function updateSubjectRegistrations(&$subjectRegistrations, $subjectName)
    {
        if (!isset($subjectRegistrations[$subjectName])) {
            $subjectRegistrations[$subjectName] = 0;
        }
        $subjectRegistrations[$subjectName]++;
    }

    private function updateTotalMarks(&$studentData, $score)
    {
        $studentData['total_marks'] += $score;
    }

    private function updateEnglishScore(&$studentData, $subjectName, $score)
    {
        if ($subjectName === 'English') {
            $studentData['english_score'] = $score;
        }
    }

    private function updateSubjectCountAndPoints(&$studentData, $formLevel, $subjectName, $score, $gpaData)
    {
        if ($formLevel === self::JUNIOR_SECTION) {
            $studentData['subject_count']++;
        } elseif ($formLevel === self::SENIOR_SECTION) {
            if ($this->isSubjectConsidered($subjectName, $score, $gpaData['points'])) {
                $studentData['subject_count']++;
                $studentData['total_points'] += $gpaData['points'];
            }
        }
    }

    private function updateFailedStatus(&$studentData, $gpaData)
    {
        if ($gpaData['remark'] === 'Fail') {
            $studentData['failed'] = true;
        }
    }

    private function calculateOverallGradeAndComments(&$processedData)
    {
        foreach ($processedData as $studentId => $studentData) {
            if ($this->isJuniorSection($studentData['class'])) {
                $totalMarks = $studentData['total_marks'];
                $subjectCount = $studentData['subject_count'];

                if ($subjectCount >= 6) {
                    $overallGPA = $totalMarks / $subjectCount;
                    $overallGradeData = $this->calculateGPA($overallGPA, self::JUNIOR_SECTION, 'Overall');
                    $processedData[$studentId]['overall_grade'] = $overallGradeData['grade'];

                    if ($overallGradeData['remark'] === 'Fail') {
                        $processedData[$studentId]['head_teacher_comment'] = 'This student has not met the required academic performance standards.';
                        $processedData[$studentId]['class_teacher_comment'] = 'This student should consider seeking additional support and focusing on improvement.';
                    } else {
                        $processedData[$studentId]['head_teacher_comment'] = 'This student has met the required academic performance standards.';
                        $processedData[$studentId]['class_teacher_comment'] = 'This student is performing well and should continue working hard.';
                    }
                }
            }
        }
    }

    private function calculateOverallPointsAndComments(&$processedData)
    {
        foreach ($processedData as $studentId => $studentData) {
            if ($this->isSeniorSection($studentData['class'])) {
                $totalPoints = $studentData['total_points'];
                $subjectCount = $studentData['subject_count'];

                if ($subjectCount >= 6 || ($studentData['english_score'] >= $this->getPassingScore() && $subjectCount >= 5)) {
                    $processedData[$studentId]['overall_points'] = round($totalPoints / $subjectCount);

                    if (isset($processedData[$studentId]['overall_points']) && $processedData[$studentId]['overall_points'] > 0) {
                        $processedData[$studentId]['head_teacher_comment'] = 'This student has met the required academic performance standards.';
                        $processedData[$studentId]['class_teacher_comment'] = 'This student is performing well and should continue working hard';
                    } else {
                        $processedData[$studentId]['head_teacher_comment'] = 'This student has not met the required academic performance standards.';
                        $processedData[$studentId]['class_teacher_comment'] = 'This student should consider seeking additional support and focusing on improvement.';
                    }
                }
            }
        }
    }

    private function rankStudents(&$processedData)
    {
        $juniorSectionTotalMarks = [];
        foreach ($processedData as $student) {
            if ($this->isJuniorSection($student['class'])) {
                $juniorSectionTotalMarks[$student['student_id']] = $student['total_marks'];
            }
        }
        arsort($juniorSectionTotalMarks);
        $rank = 1;
        foreach ($juniorSectionTotalMarks as $studentId => $totalMarks) {
            if ($this->isJuniorSection($processedData[$studentId]['class']) && $processedData[$studentId]['subject_count'] >= 6) {
                $processedData[$studentId]['position'] = $rank;
            }
            $rank++;
        }

        $seniorSectionTotalPoints = [];
        foreach ($processedData as $student) {
            if ($this->isSeniorSection($student['class'])) {
                $seniorSectionTotalPoints[$student['student_id']] = $student['total_points'];
            }
        }
        arsort($seniorSectionTotalPoints);
        $rank = 1;
        foreach ($seniorSectionTotalPoints as $studentId => $totalPoints) {
            if ($this->isSeniorSection($processedData[$studentId]['class']) && isset($processedData[$studentId]['overall_points'])) {
                $processedData[$studentId]['position'] = $rank;
            }
            $rank++;
        }
    }
    /**
     * This code snippet ranks the students in the junior and senior sections based on their total marks and total points respectively.
     * 
     * For the junior section, it first creates an array $juniorSectionTotalMarks to store the total marks of each student in the junior section.
     * Then, it sorts the array in descending order using arsort().
     * Next, it assigns a rank to each student in the junior section who has at least 6 subjects and is in the junior section using a foreach loop.
     * The rank is stored in the 'position' key of the corresponding student in the $processedData array.
     * 
     * For the senior section, it follows a similar process. It creates an array $seniorSectionTotalPoints to store the total points of each student in the senior section.
     * Then, it sorts the array in descending order using arsort().
     * Next, it assigns a rank to each student in the senior section who has an 'overall_points' key (indicating they have at least 6 subjects) using a foreach loop.
     * The rank is stored in the 'position' key of the corresponding student in the $processedData array.
     */
    private function combineData($processedData)
    {
        $juniorSectionData = array_filter($processedData, function ($student) {
            return isset($student['class']) && $this->isJuniorSection($student['class']);
        });

        $seniorSectionData = array_filter($processedData, function ($student) {
            return isset($student['class']) && $this->isSeniorSection($student['class']);
        });

        $combinedData = [
            'junior_section' => array_values($juniorSectionData),
            'senior_section' => array_values($seniorSectionData),
        ];

        return $combinedData;
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
