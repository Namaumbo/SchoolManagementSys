<?php

namespace App\Http\Controllers;
use App\Services\StudentService;

use Illuminate\Http\Request;


class StudentController extends Controller
{
 
    public function __construct(StudentService $studentService)

    {
       $this->StudentService = $studentService;


    }

    public function getAllStudents(){
    return  $this->StudentService->getAll();

    }
    public function registerStudent(Request $studentService){

     return  $this->StudentService->store($studentService);

    }

    public function subjectAndClassAllocation(Request $studentService){

        return  $this->StudentService->Allocation($studentService);
   
       }

    public function updateStudent(Request $userService,int $id){

    return  $this->StudentService->update($userService,$id);
   
     }
    
   }
    

