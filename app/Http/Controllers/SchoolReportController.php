<?php

namespace App\Http\Controllers;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SchoolReportController extends Controller
{
  
    public function index(Request $request,$id): JsonResponse
    {
           $show[]=null;
           $grade[]=null;
        $student = Student::find($id)->subjects();
        $assessment=Assessment::select('averageScore','subject_id')->where('student_id',$id)->get();
        foreach ($assessment as $data){

            $show[]= $data['averageScore'];
        
        if($show <80){

           echo 'A';
        }
            
        }
     
        
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
