<?php
namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Helpers\Helper;
use App\Http\Resources\StudentResource;

use App\Models\Subject;
use App\Models\Relationship;
use App\Models\Assessment;

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
    public function getStudents()
    {
     $students= Student::with('subjects')->get();
      return $students;
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
    
        // Extract the numeric part from the className (e.g., "Form 1" => "1")
        $classNumber = preg_replace('/[^0-9]/', '', $student->className);
    
        // Determine the prefix based on the class abbreviation (e.g., "Form 1" => "F1")
        $classAbbreviation = 'F' . $classNumber;
    
        // Generate the student username in the format "SIMS/F1/001", "SIMS/F2/001", etc.
        $student->username = Helper::StudentIdGenerator(new Student, 'username', 3, 'SIMS/' . $classAbbreviation . '/');
    
        $student->sex = $request->sex;
        $student->village = $request->village;
        $student->traditional_authority = $request->traditional_authority;
        $student->district = $request->district;
        $student->role_name = $request->role_name;
        $student->created_at = Carbon::now();
        $student->updated_at = Carbon::now();
        $student->save();
    
        // Check if the student is in Form 1 or Form 2
        if ($classNumber === '1' || $classNumber === '2') {
            // Register all subjects for Form 1 and Form 2
            $allSubjects = Subject::all();
            foreach ($allSubjects as $subject) {
                $student->subjects()->syncWithoutDetaching($subject, ["name" => $subject->name]);
            }
        }
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
            $student = Student::where('username', $request->input('username'))->first();
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
        try {
            $student = Student::find($id);

            if ($student) {
                // Delete associated assessments
                Assessment::where('student_id', $student->id)->delete();

                // Detach subjects from the pivot table
                $student->subjects()->detach();

                // Delete the student
                $student->delete();

                return response()->json([
                    'message' => 'Student and associated records deleted successfully'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'No Student found with that information',
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}

