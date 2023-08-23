<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use App\Models\User;
use App\Models\Relationship;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Resources\RelationshipResource;

use App\Http\Resources\AssessmentResource;
use App\Http\Resources\StudentResource;
use lluminate\Http\Resources\Json\AnonymousResourceCollection;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    /**
     * @return AnonymousResourceCollection
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */



    public function store(Request $request, $id): JsonResponse
    {


        $response = [
            'message' => '',
            'status' => '',
            'student' => null,
        ];
        $code = 200;

        $student = Student::find($id);
        $student = Student::where('username', $request->input('username'))->first();
        $subject = Subject::select('id')->where('name', $request->input('name'))->first();

        if (!$student || !$subject) {
            $response['message'] = 'There is no such student in the database';
            $response['status'] = 'fail';
            $response['student'] = $student;
            $code = 404;
        }
         else {
            try {

                $firstAssessment  = $request->input('firstAssessment');
                $secondAssessment = $request->input('secondAssessment');
                $finalExam = $request->input('endOfTermAssessment');


                Assessment::where('student_id', $id)->where('subject_id', $subject->id)->update([
                    'schoolTerm' => $request->input('schoolTerm'),
                    'teacherEmail' => $request->input('teacherEmail'),
                    'firstAssessment' => $request->input('firstAssessment'),
                    'secondAssessment' => $request->input('secondAssessment'),
                    'endOfTermAssessment' => $request->input('endOfTermAssessment'),
                    'averageScore' => ($firstAssessment + $secondAssessment) * 0.2 + ($finalExam) * 0.6,
                    'created_at' => carbon::now(),
                    'updated_at' => carbon::now()
                ]);
                $response['message'] = 'Assessment updated successfully';
                $response['status'] = 'Success';
                $code = 200;
            } catch (\Exception $e) {
                $response['message'] = 'error encountered please contact the IT';
                $response['status'] = 'fail';
                $code = 500;
            }
        }
        return response()->json($response, $code);
    }

    public function deleteAssessment($id)
    {
        $toDelete = Assessment::find($id);
    }


    public function gradingSystem(Request $request, string $id): JsonResponse
    {



        //$response=Assessment::where('student_id',$request->id)->first();

        $response = new StudentResource(Student::findorFail($id));


        return response()->json([


            'Score' => $response->assessments,


        ], 400);


        // }  
    }

    /*}else if($response->averageScore>="75"){
            return response()->json([
                  'Student' => $student->firstname." ".$student->surname,
                  'Teacher' => $teacher->surname." ".$teacher->firstname,
                  'subject'=>$response->subjectName,
                  'Score'=>$response->averageScore,
                  'Comment'=>"Very Good",
                  'Grade'=>"B",
            ], );
        }else if($response->averageScore>="65"){
            return response()->json([
                  'Student' => $student->firstname." ".$student->surname,
                  'Teacher' =>$teacher->surname." ".$teacher->firstname,
                  'subject'=>$response->subjectName,
                  'Score'=>$response->averageScore,
                  'Comment'=>"Good",
                  'Grade'=>"c",
            ], );
        }else if($response->averageScore>="40"){
            return response()->json([
                  'Student' => $student->firstname." ".$student->surname,
                  'Teacher' => $teacher->surname." ".$teacher->firstname,
                  'Score'=>$reponse->averageScore,
                  'Comment'=>"Pass",
                  'Grade'=>"D",
            ], );
        }else if($response->averageScore>=0){
            return response()->json([
                  'Student' => $student->firstname." ".$student->surname,
                  'Teacher' => $teacher->surname." ".$teacher->firstname,
                  'subject'=>$response->subjectName,
                  'Score'=>$response->averageScore,
                  'Comment'=>"Fail",
                  'Grade'=>"F",
            ], );
    }else {
        return response()->json([
              'Student' => $student->firstname,
              'Teacher' => $teacher->surname ."  ".$teacher->firstname,
              'subject'=>$response->subjectName,
              'Score'=>$response->averageScore,
              'Comment'=>"No grade",
              'Grade'=>"----",
        ], );

     } 
        
       }

*/

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id)
    {

        // redundancy_
        // u just have to get the $assessment then do the rest
        // not if it exists then find it in the database

        if (Assessment::where('id', $id)->exists()) {
            $assessment = Assessment::find($id);
            $this->create($request, $assessment);
            return response()->json([
                'message' => 'The Assessment is updated successfully'
            ], 400);
        } else {
            return response()->json([
                'message' => 'No such Assessment found in the database '
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        if (Assessment::where('id', $id)->exists()) {
            $assessment = Assessment::find($id);
            $assessment->delete();
            return response()->json([
                'message' => 'An assessment is deleted successfully'
            ], 404);
        } else {
            return response()->json([
                'message' => 'No such assessment found in the database ',
            ]);
        }
    }
}
