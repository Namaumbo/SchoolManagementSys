<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Collection
     */
    public function index(): Collection
    {
        return Subject::all();

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(): Response
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {

        //adding subjects to the database
        $subject = Subject::where('SubjectName', $request->input('SubjectName'))->first();
        //Username represents an ID for the student
        if ($subject) {
            return response()->json(
                ['message' => 'Subject already exists', 'SubjectName' => $subject],

            );
        }
        try {
            $subject = new Subject;
            $subject->SubjectName = $request->SubjectName;
            $subject->PeriodsPerWeek = $request->PeriodsPerWeek;
            $subject->created_at = carbon::now();
            $subject->updated_at = carbon::now();
            $subject->save();
            return response()->json([
                'message' => 'Subject saved successfully',
                'Subject' => $subject,
                'status' => 200,

            ]);


        } catch (Exception $e) {

            return response()->json([
                'message' => 'Subject not saved',
                'Subject' => $subject,
                'status' => 201,
                '4' => $e,

            ]);


        }

    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {

        return Subject::find($id);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        if (Subject::where('id', $id)->exists()) {
            $subject = Subject::find($id);
            $subject->SubjectName = $request->SubjectName;
            $subject->PeriodsPerWeek = $request->PeriodsPerWeek;
            $subject->created_at = carbon::now();
            $subject->updated_at = carbon::now();
            $subject->save();
            return response()->json([
                'message' => 'Subject is updated successfully'

            ], 400);
        } else {
            return response()->json([
                'message' => 'No Subject found with that information '


            ], 401);
        }

    }


    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        if (Subject::where('id', $id)->exists()) {
            $subject = Subject::find($id);
            $subject->delete();
            return response()->json([
                'message' => 'Subject is deleted successfully'

            ], 404);


        } else {
            return response()->json([
                'message' => 'No Subject found with that information ',

            ]);
        }
    }
}
