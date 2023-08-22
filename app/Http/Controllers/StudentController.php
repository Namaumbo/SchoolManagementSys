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

<<<<<<< HEAD
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request): JsonResponse
    {

        try {
            $response = [
                'message' => '',
                'status' => '',
                'student' => [],
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


    public function subjectToStudent(Request $request)
    {
        $student = Student::where('username', $request->input('username'))->first();
        $subject = Subject::where('name', $request->input('name'))->first();

        if (!$subject || !$student) {
            return response()->json("Information provided does not exists");
        }

        $student->subjects()->syncWithoutDetaching($subject, ["name" => $subject->name]);


        return response()->json(
            [
                "message" => "Subject added successfully to  " . $student->firstname . ' ' . $student->surname,
                "records" => $subject->students,
            ]
        );
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

            $student->firstname = $request->get('firstname');
            $student->lastname = $request->get('lastname');
            $student->username = $request->get('username');
            $student->sex = $request->get('sex');
            $student->village = $request->get('village');
            $student->traditional_authority = $request->get('traditional_authority');
            $student->district = $request->get('district');


            if ($student->save()) {
                return response()->json([
                    'message' => 'Student is updated successfully'
                ], 400);
            }
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
=======
    public function subjectAndClassAllocation(Request $studentService){

        return  $this->StudentService->Allocation($studentService);
   
       }

    public function updateStudent(Request $userService,int $id){

    return  $this->StudentService->update($userService,$id);
   
     }
    
   }
    

>>>>>>> 2e3aa2c84aa5ef906c69b991d6e47ab3dce243e2
