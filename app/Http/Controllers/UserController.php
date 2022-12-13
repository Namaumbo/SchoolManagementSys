<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;
use Carbon\Carbon;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    { 
          return User::all();
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $user)
    {
       
        $user->title=$request->title;
        $user->firstname=$request->firstname;
        $user->surname=$request->surname;
        $user->email=$request->email;
        $user->password=$request->password;
        $user->sex=$request->sex;
        $user->village=$request->village;
        $user->traditional_authority=$request->traditional_authority;
        $user->district=$request->district;

        $user->created_at=carbon::now();
        $user->updated_at=carbon::now();
        $user->save();

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = User::where('email', $request->input('email'))->first();
        //Username represents an ID for the student
        if ($user) {
            return response()->json(
                ['message' => 'User already exists', 'email' => $user],
                Response::HTTP_CONFLICT
            );
        }
       try{
        $user=new User;
        $this->create($request, $user);

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

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
            return User::find($id);
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
        if(User::where('id',$id)->exists()){
            $user=User::find($id);
             $this->create($request, $user);

             return response()->json([
                 'message'=>'Student is updated successfully'
         
             ],400);
         }else{
             return response()->json([
                 'message'=>'No Student found with that information '
         
 
             ],401);
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
        if(User::where('id',$id)->exists()){
            $user=User::find($id);
            $user->delete();
            return response()->json([
                'message'=>'Student is deleted successfully'
     
            ],404);


 }else{
            return response()->json([
                'message'=>'No  Student found with that information ',
           
            ]);
            }

    }
}
