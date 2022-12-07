<?php

namespace App\Http\Controllers;
use App\Models\Department;

use Illuminate\Http\Request;
use Carbon\Carbon;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    { 
          return Department::all();
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $department = Department::where('DepartmentName', $request->input('DepartmentName'))->first();
        //Username represents an ID for the student
        if ($department) {
            return response()->json(
                ['message' => 'Department already exists', 'DepartmentName' => $department],
                Response::HTTP_CONFLICT
            );
        }
       try{
        $department=new Department;
        $department->DepartmentName=$request->DepartmentName;
        $department->HeadOfDepartment=$request->HeadOfDepartment;
        $department->created_at=carbon::now();
        $department->updated_at=carbon::now();
        $department->save();
         return response()->json([
            'message'=>'Department saved successfully',
            'Department'=>$department,
            'status'=>200,

         ]);


       }catch(\Exception $e){

        return response()->json([
            'message'=>'Department not saved',
            'Department'=>$department,
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
        
            return Department::find($id);
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
        if(Department::where('id',$id)->exists()){
            $department=Department::find($id);
            $department->DepartmentName=$request->DepartmentName;
            $department->HeadOfDepartment=$request->HeadOfDepartment;
            $department->created_at=carbon::now();
            $department->updated_at=carbon::now();
             $department->save();
             return response()->json([
                 'message'=>'Department is updated successfully'
         
             ],400);
         }else{
             return response()->json([
                 'message'=>'No Department found with that information '
         
 
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
        if(Department::where('id',$id)->exists()){
            $department=Department::find($id);
            $department->delete();
            return response()->json([
                'message'=>'Department is deleted successfully'
     
            ],404);


 }else{
            return response()->json([
                'message'=>'No Department found with that information ',
           
            ]);
            }

    }
}
