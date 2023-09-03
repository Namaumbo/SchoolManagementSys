<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Helpers\Helper;

use App\Models\Subject;
use App\Models\Relationship;

use App\Models\StudentSubject;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Queue\EntityNotFoundException;

use Illuminate\Http\Response;
use PhpParser\Node\Stmt\TryCatch;

class StudentService
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        return Student::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $student): void
    {
        $student->firstname = $request->firstname;
        $student->surname = $request->surname;
        $student->className = $request->className;
        if ($student->className == "Form 1") {
            $student->username = Helper::StudentIdGenerator(new Student, 'username', 1, 'SIMS/F1/');
        } elseif ($student->className == "Form 2") {
            $student->username = Helper::StudentIdGenerator(new Student, 'username', 1, 'SIMS/F2/');
        } elseif ($student->className == "Form 3") {
            $student->username = Helper::StudentIdGenerator(new Student, 'username', 1, 'SIMS/F3/');
        } elseif ($student->className == "Form 4") {
            $student->username = Helper::StudentIdGenerator(new Student, 'username', 1, 'SIMS/F4/');
        }

        $student->sex = $request->sex;
        $student->village = $request->village;
        $student->traditional_authority = $request->traditional_authority;
        $student->district = $request->district;
        $student->role_name = $request->role_name;
        $student->created_at = carbon::now();
        $student->updated_at = carbon::now();
        $student->save();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    //  check this please refer to this 
    public function store(Request $request): JsonResponse
    {

        try {
            $response = [
                'message' => '',
                'status' => '',
                'student' => null,
            ];
            $code = 200;
            $student = Student::where('username', $request->input('username'))->first();
            if ($student) {
                $response['message'] = 'Student already exists';
                $response['status'] = 'fail';
                $response['student'] = $student;
                $code = 409;
            } else {
                $student = new Student;

                $this->create($request, $student);
                $response['message'] = 'Student saved successfully';
                $response['status'] = 'success';
                $response['student'] = $student;
                $code = 201;
            }
        } catch (\Exception $e) {
            $response['message'] = $e->getMessage();
            $response['status'] = 'fail';
            $code = 500;
        }
        return response()->json($response, $code);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */


    public function registerSubjectToStudent(Request $request) : JsonResponse
    {

        try {
            $response = [];
            $code = 200;
            $student = Student::where('id', $request->input('id'))->first();
            $subject = Subject::where('name', $request->input('name'))->first();
                       
            if(!$student ){
                $response['status'] = 'error';
                $response['message'] = 'No student found';
                $response['description']= 'Please select a student from the list';
                $code = 404;

            }
            elseif(!$subject){
                $response['status'] = 'error';
                $response['message'] = 'No subject found';
                $response['description']= 'Please select a subject from the list';
                $code = 404;

            }
            elseif (!$student || !$subject){
                $response['status'] = 'error';
                $response['message'] = 'No student or subject found';
                $response['description']= 'Please select a student or a subject from the list';
                $code = 404;
            }
            else{
                if($student->subjects()->syncWithoutDetaching($subject, ["name" => $subject->name])){
               
                    $response['status'] = 'success';
                    $response['message'] = 'subject added successfully';
                    $response['describedAs'] = $subject->name;
                    $response['records'] = $subject->students;
                    $code = 200;
                }
            }
        } catch (\Exception $e) {
            $response['status'] = 'fail';
            $response['message']= $e->getMessage();
            $code = 500;
            $response['description']  = 'Error encountered contact IT support';
        }
        return response()->json($response, $code);
    }



    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Student::where('id', $id)->exists()) {
            $student = Student::find($id);
            $this->create($request, $student);
            return response()->json([
                'message' => 'Student is updated successfully'
            ], 400);
        } else {
            return response()->json([
                'message' => 'No Student found with that information '
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (Student::where('id', $id)->exists()) {
            $student = Student::find($id);
            $student->delete();
            return response()->json([
                'message' => 'Student is deleted successfully'
            ], 404);
        } else {
            return response()->json([
                'message' => 'No  Student found with that information ',
            ]);
        }
    }
}
