<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index():Collection
    {
        return AssessmentResource::collection(Assessment::all());
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $assessment)
    {
        $assessment->firstAssessment = $request->firstAssessment;
        $assessment->secondAssessment = $request->secondAssessment;
        $assessment->endofTermAssessment = $request->endofTermAssessment;
        $average_Score=($assessment->firstAssessment+$assessment->secondAssessment)*0.4+0.6*$assessment->endofTermAssessment;
        $assessment->$average_Score=$request->input($average_Score);
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
    $assessment =  Assessment::where('id', $request->input('id'))->first();
    if ($assessment) {
        return response()->json(
            ['message' => 'An assessment is arleady added', 'subject_name' => $subject],
        );
    }
    try {
        $assessment = new Assessment;
        $this->create($request, $assessment);
        return response()->json([
            'message' => 'Assessment added successfully',
            'Assessment' => $assessment,
            'status' => 200,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Assessment not saved',
            'Assessment' => $assessment,
            'status' => 400,
            '4' => $e,
        ]);
    }
}

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Subject  $role
     * @return \Illuminate\Http\Response
     */
    public function show(Request $assessment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $assessment)
    {
        //
    }

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
