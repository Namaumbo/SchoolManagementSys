<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserController extends Controller

{
    /**
     * Display a listing of the resource.
     *
     * @return Collection
     */
    public function index(): Collection
    {
        return User::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
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
        $user = User::where('email', $request->input('email'))->first();
        //Username represents an ID for the student
        if ($user) {
            return response()->json(
                ['message' => 'user already exists', 'User' => $user],
                ResponseAlias::HTTP_CONFLICT
            );
        }
<<<<<<< HEAD
       try{
        $user=new User;
        $user->title=$request->title;
        $user->firstname=$request->firstname;
        $user->surname=$request->surname;
        $user->email=$request->email;
        $user->password =Hash::make($request->password);
        $user->village=$request->village;
        $user->traditional_authority=$request->traditional_authority;
        $user->district=$request->district;
        $user->created_at=carbon::now();
        $user->updated_at=carbon::now();
         $user->save();
         return response()->json([
            'message'=>'Student saved successfully',
            'User'=>$user,
            'status'=>200,

         ]);


       }catch(\Exception $e){

        return response()->json([
            'message'=>'Student not saved',
            'User'=>$user,
            'status'=>201,
            '4'=>$e,

         ]);
           
       }
=======
        try {
            $user = new User;
            $this->extracted($request, $user);
            return response()->json([
                'message' => 'Student saved successfully',
                'User' => $user,
                'status' => 200,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Student not saved',
                'User' => $user,
                'status' => 201,
                '4' => $e,
            ]);
        }
    }
    /**
     * @param Request $request
     * @param $user
     * @return void
     */
    public function extracted(Request $request, $user): void
    {
        $user->firstname = $request->firstname;
        $user->surname = $request->surname;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->class = $request->class;
        $user->village = $request->village;
        $user->traditional_authority = $request->traditional_authority;
        $user->district = $request->district;
        $user->created_at = carbon::now();
        $user->updated_at = carbon::now();
        $user->save();
>>>>>>> 1310ea3ababbda6a1159e9cb6478427a692df741
    }
    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        return User::find($id);
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
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
<<<<<<< HEAD
        if(User::where('id',$id)->exists()){
           $user=User::find($id);
           $user->title=$request->title;
           $user->firstname=$request->firstname;
           $user->surname=$request->surname;
           $user->email=$request->email;
           $user->password =Hash::make($request->password);
           $user->village=$request->village;
           $user->traditional_authority=$request->traditional_authority;
           $user->district=$request->district;
           $user->created_at=carbon::now();
           $user->updated_at=carbon::now();
            $user->save();
=======
        if (User::where('id', $id)->exists()) {
            $user = User::find($id);
            $this->extracted($request, $user);
>>>>>>> 1310ea3ababbda6a1159e9cb6478427a692df741
            return response()->json([
                'message' => 'Student is updated successfully'
            ], 400);
        } else {
            return response()->json([
                'message' => 'No student found with that information '
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        if (User::where('id', $id)->exists()) {
            $user = User::find($id);
            $user->delete();
            return response()->json([
                'message' => 'Student is deleted successfully'
            ], 404);
        } else {
            return response()->json([
                'message' => 'No student found with that information ',
            ]);
        }
    }
}
