<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SchoolReportController extends Controller
{

    public function index(Request $request, $id)
    {
        $show[] = null;
        $grade[] = null;
        $student = Student::find($id)->subjects();
        $assessment = Assessment::select('averageScore', 'subject_id')->where('student_id', $id)->get();


        // foreach ($assessment as $data){

        //     $show[]= $data['averageScore'];

        // if($show <80){

        //    echo 'A';
        // }

    }
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

        return response()->json([
            'status' => 'success',
            'message' => 'Grades report generated successfully',
            'data' => ['report' => $processedData]
        ]);
    }

    public function processReportData($assessment)
    {

        $processedData = [];
        foreach ($assessment as $row) {
            $gpa = $this->gradeCalculator($row->averageScore);
            $processedData[] = [
                'student_id' => $row->student_id,
                'student_name' => $row->firstname . ' ' . $row->surname,
                'assessment_name' => $row->name,
                'subject_id' => $row->subject_id,
                'score' => $row->averageScore,
                'grade' => $gpa,
            ];
        }
        return $processedData;
    }

    public function gradeCalculator($score)
    {

        $gradeMappings = [
            ['min' => 90, 'max' => 100, 'grade' => 'A'],
            ['min' => 80, 'max' => 89, 'grade' => 'B'],
            ['min' => 70, 'max' => 79, 'grade' => 'C'],
            ['min' => 60, 'max' => 69, 'grade' => 'D'],
            ['min' => 0, 'max' => 59, 'grade' => 'F'],
        ];

        foreach ($gradeMappings as $mapping) {
        if ($score >= $mapping['min'] && $score <= $mapping['max']) {
            return $mapping['grade'];
        }
        return 'F';
    }
    }
    public function create()
    {
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
