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
    public function create(Request $request, $assessment)
    {


        $assessment->schoolTerm = $request->schoolTerm;
        $assessment->firstAssessment = $request->firstAssessment;
        $assessment->secondAssessment = $request->secondAssessment;
        $assessment->subject_id = $request->subject_id;
        $assessment->student_id = $request->student_id;

        $assessment->endOfTermAssessment =round($request->endOfTermAssessment*0.6,0);
        $averageContinousAssessment=(($assessment->firstAssessment+$assessment->secondAssessment)/2)*0.4;
        $averageScore=$averageContinousAssessment+$assessment->endOfTermAssessment;
        $assessment->averageScore=$averageScore;


        $averageScore=$request->averageScore;

        $assessment->created_at = carbon::now();
        $assessment->updated_at = carbon::now();
    
            $assessment->save();
     
   
    
}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){

      
        $check=Assessment::where('student_id',$request->input('student_id'))
        ->where('subject_id',$request->input('subject_id'))
        ->where('schoolTerm',$request->input('schoolTerm'))
        ->first();

        if($check){
            return response()->json([
                'message' =>'Assessment was arleady added to the database',
             
                'status' => 201,
            ], 201);
        }

        try {
          

            $assessment=new Assessment();
        
            $this->create($request, $assessment);
            return response()->json([
                'message' => 'Assessment saved successfully',
                'Student' => $assessment,
                'status' => 201,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Assessment not saved',
                'status' => 404,
                '4' => $e,
            ], 404);
        }

    
}
    
         
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Subject  $role
     * @return \Illuminate\Http\Response
     */

    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */


    public function gradingSystem(Request $request,string $id): JsonResponse
       {
            
        

            //$response=Assessment::where('student_id',$request->id)->first();

         $response =new StudentResource(Student::findorFail($id));
               
        
              return response()->json([
             

                'Score'=>$response->assessments,
             

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
            $assessment =Assessment::find($id);
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
