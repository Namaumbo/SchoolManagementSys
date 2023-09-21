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
        $subjectCounts=$this->numberOfRegisteredSubjects($reportData);
        return response()->json([
            'status' => 'success',
            'message' => 'Grades report generated successfully',
            'data' => ['report' => $processedData,'registeredSubject'=>$subjectCounts]
        ]);
    }

    public function processReportData($assessment)
    {
        $processedData = [];
        $studentData = [];
    
        foreach ($assessment as $row) {
            $gpa = $this->gradeCalculator($row->averageScore);
            $studentId = $row->student_id;
    
            if (!isset($studentData[$studentId])) {
                $studentData[$studentId] = [
                    'student_id' => $studentId,
                    'student_name' => $row->firstname . ' ' . $row->surname,
                    'total_points' => 0,
                    'english_passed' => true, // Assuming English has passed by default.
                    'subject_count' => 0, // Initialize subject count to 0.
                    'assessments' => [],
                ];
            }
    
            if ($row->name === 'English' && $gpa ) {
                // If the student fails English, set 'english_passed' to false.
                $studentData[$studentId]['english_passed'] = false;
            }
    
            $studentData[$studentId]['total_points'] += $gpa;
            $studentData[$studentId]['subject_count']++;
    
            $studentData[$studentId]['assessments'][] = [
                'assessment_name' => $row->name,
                'subject_id' => $row->subject_id,
                'score' => $row->averageScore,
                'grade' => $gpa,
            ];
        }
    
        $finalProcessedData = array_values($studentData);
    
        foreach ($finalProcessedData as &$student) {
            if (!$student['english_passed'] || $student['subject_count'] < 6) {
                // analysis message if Students fails English or subjects less than 6
                $student['analysis'] = 'Needs improvement in all subjects including English';
            }else{
                $student['analysis'] = 'Must continue working hard';
 
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
