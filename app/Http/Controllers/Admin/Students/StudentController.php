<?php

namespace App\Http\Controllers\Students;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\Student;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use phpDocumentor\Reflection\Types\Resource_;
use Psy\Util\Json;


class StudentController extends Controller
{
    //Adding Students to the Database

    public function register(Request $request): JsonResponse
    {
        //        adding user in database
        $user = Student::where('username', $request->input('username'))->first();

        if ($user) {
            return response()->json(
                ['message' => 'The Student was arleady Added', 'User' => $user],
                Response::HTTP_CONFLICT
            );
        }
        //            saving the user
        User::create([
            
            'firstname'=>$request->input('firstname'),
            'surname'=>$request->input('surname'),
            'village'=>$request->input('village'),
            't/a'=>$request->input('t/a'),
            'class'=>$request->input('class'),
            'location'=>$request->input('location'),
        ]);
        return response()->json(["status" => "ok", "message" => "Student successfully saved"], Response::HTTP_CREATED);
    }

}
