<?php
namespace App\Http\Controllers;
use App\Models\User;
use PhpParser\Node\Stmt\TryCatch;

use Illuminate\Http\Request;
use App\Models\Level;
use Carbon\Carbon;

class LevelController extends Controller
{

       public function getClass(){
        return Level::all();
       }
      public function create(Request $request,$class)
        {
            $class->className = $request->className;
            //user_id is the class teacher
           

            $class->created_at = carbon::now();
            $class->updated_at = carbon::now();
            $class->save();
        }
    
    
    public function store(Request $request)
    {
        try {
            $class = new Level;
            $this->create($request, $class);

            return response()->json([
                'message' => 'class saved successfully',
                'User' => $class,
                'status' => 201,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'class not saved',
                'status' => 404,
                '4' => $e,
            ], 404);
        }

    }
    public function classTeacher(Request $request)
    {
        try {
        
        $response = [
            'message' => '',
            'status' => '',
            'user' => null,
        ];
        $code = 200;   
        $user = User::where('email', $request->input('email'))->first();
                                         

        if(!$user){
            $response['message'] = 'The user doesnt exist';
            $response['status'] = 'fail';
            $response['user'] = $user;
            $code = 409;

        }else{
        $class = new Level;
        $this->create($request, $class);

        $class->users()->associate($user);
        $class->save();
        $response['message'] = 'class teacher successfully created';
        $response['status'] = 'success';
        $response['student'] = $user;
        $code = 201;


    }
    } catch (\Exception $e) {
        $response['message'] = 'Error creating class teacher';
        $response['status'] = 'fail';
        $code = 500;
    

}
return response()->json($response, $code);

}

public function getStudentsByClassAndSubject($classId)
{
    try {
        $user = auth()->user(); // Get the logged-in user

        // Check if the user has the 'classTeacher' or 'Teacher' role
        if ($user->roles()->where('role_name', 'classTeacher')->orWhere('role_name', 'Teacher')->exists()) {
            // Get the class by ID
            $class = Level::findOrFail($classId);

            // Check if the teacher is assigned to the class
            if ($class->allocationable()->where('user_id', $user->id)->exists()) {
                // Fetch students, subjects, and teacher for the specified class
                $students = $class->student()->with(['role'])->get();
                $subjects = $class->subjects()->get();
                $teacher = $class->users; // Assuming you have a relation in Level model to get the teacher

                return response()->json([
                    'message' => 'Students, Subjects, and Teacher fetched successfully',
                    'students' => $students,
                    'subjects' => $subjects,
                    'teacher' => $teacher,
                    'status' => 200,
                ], 200);
            } else {
                // Handle unauthorized access to the class
                return response()->json([
                    'message' => 'Unauthorized access to the class',
                    'status' => 403,
                ], 403);
            }
        } else {
            // Handle if the user does not have the required role
            return response()->json([
                'message' => 'User does not have the required role',
                'status' => 403,
            ], 403);
        }
    } catch (\Exception $e) {
        // Handle exceptions
        return response()->json([
            'message' => 'Error fetching students, subjects, and teacher',
            'status' => 500,
            'error' => $e->getMessage(),
        ], 500);
    }
}
}