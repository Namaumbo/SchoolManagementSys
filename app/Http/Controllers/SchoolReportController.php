<?php

namespace App\Http\Controllers;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use Illuminate\Http\Request;

class SchoolReportController extends Controller
{
  
    public function index($id)
    {

        $student = Student::find($id);
        $assessment=Assessment::select('subject_id','averageScore','schoolTerm')->where('student_id',$id)->get();
        

        
        
        return $assessment;
    }

    public function create()
    {
       
    }

    public function store(Request $request)
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
