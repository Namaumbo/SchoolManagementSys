<?php

namespace App\Http\Controllers;
use App\Services\StudentService;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected $studentService ;
    public function __construct(StudentService $StudentService)

    {
       $this->studentService = $StudentService;

    }
    //getting users from the database
   public function getStudents()
   {
     return  $this->studentService->getAll();

   
   }
   //registering users to the database

   public function registerStudent(Request $StudentService){
       return  $this->studentService->store($StudentService);
   }
   //Updating users

   public function updateStudent(Request $StudentService,int $id){
        return $this->studentService->update($StudentService,$id);
   }

   public function deleteStudent(int $id){
       return $this->studentService->destroy($id);
   }

   // registering subjects to students
   public function registerSubject(Request $StudentService){
    return $this->studentService->registerSubjectToStudent($StudentService);


   }

  

}
