<?php

namespace App\Http\Controllers;
use App\Models\User;
use PhpParser\Node\Stmt\TryCatch;

use Illuminate\Http\Request;
use App\Models\Level;
use Carbon\Carbon;

class LevelController extends Controller
{
      public function create(Request $request,$class)
        {
            $class->className = $request->className;
            //user_id is the class teacher
            $class->user_id = $request->user_id;

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

        $class->user()->associate($user);
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
}