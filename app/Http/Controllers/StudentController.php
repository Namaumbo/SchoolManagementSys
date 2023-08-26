<?php

namespace App\Http\Controllers;
use App\Services\StudentService;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function __construct(StudentService $StudentService)

    {
       $this->StudentService = $StudentService;


    }
    //getting users from the database
   public function getStudents()
   {
     return  $this->StudentService->getAll();

   
   }
   //registering users to the database

   public function registerStudent(Request $StudentService){
       return  $this->StudentService->store($StudentService);
   }
   //Updating users

   public function updateStudent(Request $StudentService,int $id){
        return $this->StudentService->update($StudentService,$id);
   }


   public function deleteStudent(int $id){
       return $this->StudentService->destroy($id);
   }

   // registering subjects to students
   public function registerSubject(Request $StudentService){
    return $this->StudentService->registerSubjectToStudent($StudentService);


   }

  

}
