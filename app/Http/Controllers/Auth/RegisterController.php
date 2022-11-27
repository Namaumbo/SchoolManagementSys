<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $user)
    {
        return Validator::make($user, [
            'firstname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        try{
            $user=new User;
            $user->email=$request->email;

            $user->firstname=$request->firstname;

            $user->surname=$request->surname;
            $user->username=$request->username;
            $user->password =Hash::make($request->password);
            $user->village=$request->village;
            $user->traditional_authority=$request->traditional_authority;
            $user->location=$request->location;
            $user->class=$request->class;
            $user->role=$request->role;
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
}
