<?php

namespace App\Http\Controllers;
use App\Services\StudentService;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected $studentService ;
    public function __construct(StudentService $studentService)

    {
       $this->studentService = $studentService;

    }
    //getting users from the database
   public function getStudents()
   {
     return  $this->studentService->getAll();

   
   }
   //registering users to the database

   public function registerStudent(Request $studentService){
       return  $this->studentService->store($studentService);
   }
   //Updating users

   public function updateStudent(Request $studentService,int $id){
        return $this->studentService->update($studentService,$id);
   }

   public function deleteStudent(int $id){
       return $this->studentService->destroy($id);
   }

   // registering subjects to students
   public function registerSubject(Request $request){
    return $this->studentService->registerSubjectToStudent($request);

   }

  

}
