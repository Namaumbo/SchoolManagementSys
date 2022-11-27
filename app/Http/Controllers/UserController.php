<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Models\User;

use Psy\Util\Json;
Use Carbon\Carbon;


class UserController extends Controller
{
    //Adding Students to the Database

    public function register(Request $request): JsonResponse
    {

      $user = User::where('username', $request->input('username'))->first();
        //Username represents an ID for the student
        if ($user) {
            return response()->json(
                ['message' => 'user already exists', 'User' => $student],
                Response::HTTP_CONFLICT
            );
        }
       try{
        $user=new User;
        $user->firstname=$request->firstname;
        $user->surname=$request->surname;
        $user->username=$request->username;
        $user->password =Hash::make($request->password);
        $user->village=$request->village;
        $user->traditional_authority=$request->traditional_authority;
        $user->location=$request->location;
        $user->class=$request->class;
        $user->created_at=carbon::now();
        $user->updated_at=carbon::now();
         $user->save();
         return response()->json([
            'message'=>'Student saved successfully',
            'student'=>$student,
            'status'=>200,

         ]);


       }catch(\Exception $e){

        return response()->json([
            'message'=>'Student not saved',
            'student'=>$student,
            'status'=>201,
            '4'=>$e,

         ]);
           
       }



    }
    public function login(Request $request): JsonResponse
    {
        $user = User::make($request->all(), ["username" => "required|string", "password" => "required"]);
        if ($user->fails()) {
            return response()->json(
                [
                "message" => "System fail to load " . Auth::user()->firstname,
                "status" => "ok",
                ]
            );
        }
        //        finding user name
        if (!Auth::attempt($request->only("username", "password"))) {
            return response()->json(["The credentials are wrong"], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $token = Auth::user()->createToken('Token')->plainTextToken;
        $cookie = cookie('jwt', $token, 30 * 1);
        return response()->json(
            [
                "message" => "System successfully logged " . Auth::user()->firstname,
                "status" => "ok",
                "access_token" => $token,
                "token_type" => "bearer",
                "user " => Auth::user()
            ],
            Response::HTTP_OK
        )->withCookie($cookie);
    }
}