<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\Subject;
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
        return Assessment::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $subject)
    {
        $assessment->firstAssessment = $request->firstAssessment;
        $assessment->SecondAssessment = $request->SecondAssessment;
        $assessment->EndofTermAssessment = $request->EndofTermAssessment;
      
        $subject->created_at = carbon::now();
        $subject->updated_at = carbon::now();
        $subject->save();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
    $assessment =  Assessment::where('', $request->input('score'))->first();
    if ($assessment) {
        return response()->json(
            ['message' => 'An assessment is arleady added', 'subject_name' => $subject],
        );
    }
    try {
        $subject = new Subject;
        $this->create($request, $subject);
        return response()->json([
            'message' => 'Subject created successfully',
            'Subject' => $subject,
            'status' => 200,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Subject not saved',
            'Subject' => $subject,
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
    public function show(Subject $subject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function edit(Subject $subject)
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
        if (Subject::where('id', $id)->exists()) {
            $subject = Subject::find($id);
            $this->create($request, $subject);
            return response()->json([
                'message' => 'The Subject is updated successfully'
            ], 400);
        } else {
            return response()->json([
                'message' => 'No such Subject found in the database '
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
        if (Subject::where('id', $id)->exists()) {
            $subject =Subject::find($id);
            $subject->delete();
            return response()->json([
                'message' => 'The role is deleted successfully'
            ], 404);
        } else {
            return response()->json([
                'message' => 'No  role found in the database ',
            ]);
        }
    
    }
}
