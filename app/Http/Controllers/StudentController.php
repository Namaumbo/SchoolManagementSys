<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Response;
class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllStudents()
    {
        return Student::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $student):void
    {
        $student->firstname = $request->firstname;
        $student->surname = $request->surname;
        $student->username = $request->username;
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
    public function store(Request $request): JsonResponse
    {
        
        $student = Student::where('username', $request->input('username'))->first();
         if ($student) {
            return response()->json(
                ['message' => 'User already exists', 'Student' => $student],
                409
            );
        }
        
        try {
            $student = new Student;
            $this->create($request, $student);

            return response()->json([
                'message' => 'Student saved successfully',
                'Student' => $student,
                'status' => 201,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Student not saved',
                'status' => 404,
                '4' => $e,
            ], 404);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
