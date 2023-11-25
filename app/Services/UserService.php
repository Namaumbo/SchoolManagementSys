<?php
namespace App\Services;
use App\Exceptions\GeneralException;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Level;
use App\Models\Allocationable;


use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\Foundation\Application;
use Psy\Util\Json;

      class UserService {
        use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function getAll()
    {
        return User::all();
    }

    public function store(Request $request): JsonResponse
    {
        $user = User::where('email', $request->input('email'))->first();
        //Username represents a
        if ($user) {
            return response()->json(
                ['message' => 'User already exists', 'email' => $user],
                409
            );
        }

        try {
            $user = new User;
            $this->userDetailsCommon($request, $user);
          
            return response()->json([
                'message' => 'User saved successfully',
                'User' => $user,
                'status' => 201,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User not saved',
                'status' => 404,
                '4' => $e,
            ], 404);
        }
    }

    public function Allocation(Request $request): JsonResponse
    {   

        $user = User::where('email', $request->input('email'))->first();
        $level=Level::where('className',$request->input('className'))->first();
        $subject=Subject::where('name',$request->input('name'))->first();
        try {
            $response = [
                'message' => '',
                'status' => '',
                'Teacher' => null,
                'Email' => null,
                'Class' => null,
                'Subject' => null,

            ];
            $code = 200;
        
       
        if (!$user || !$level || !$subject) {
            $response['message'] = 'Information provided doesnt exists in the database';
             $response['status'] = 'success';
                $response['Teacher'] = $user->firstname.' '.$user->surname;
                $response['Email'] = $user->email;
                $response['Class'] = $level->className;
                $response['Subject'] = $subject->name;


            $code = 201;
        }
             else{
            $user->subjects()->attach($subject);
            $user->levels()->attach($level);
    
                $response['message'] = 'Subject and class allocated successfully';
                $response['status'] = 'success';
                $response['Teacher'] = $user->firstname.' '.$user->surname;
                $response['Email'] = $user->email;
                $response['Class'] = $level->className;
                $response['Subject'] = $subject->name;


                $code = 201;
             }
            
        } catch (\Exception $e) {
            $response['message'] = 'Error allocating subject and class';
            $response['status'] = 'fail';
            $code = 500;
        }
        return response()->json($response, $code);
        
       

        }
    public function UserToDepartment(){
       

     }



    public function update(Request $request, int $id)
    {

        
        
        try{

        if (User::where('id', $id)->exists()) {
            $user = User::find($id);
            $this->userDetailsCommon($request, $user);
            return response()->json([
                'message' => 'success',
                'User' => $user,
            ],200);
        } 

    } catch (GeneralException $e) {

        throw new GeneralException( $e->getMessage());
     
    

 
    }
    }
  
    public function destroy($id): JsonResponse
    {
        if (User::where('id', $id)->exists()) {
            $user = User::find($id);

            $user->delete();


            return response()->json([
                'message' => 'The User is deleted successfully'
            ], 404);
        } else {
            return response()->json([
                'message' => 'No  User found with that information ',
            ]);
        }
    }
    /**
     * Show the form for creating a new resource.
     *
     * @param $user
     * @return void
     */
    public function userDetailsCommon(Request $request, $user): void
    {

        $user->title = $request->title;
        $user->firstname = $request->firstname;
        $user->surname = $request->surname;
        $user->email = $request->email;
        $user->password = Hash::make($request->input('password'));
        $user->sex = $request->sex;
        $user->village = $request->village;
        $user->traditional_authority = $request->traditional_authority;
        $user->district = $request->district;
        $user->role_id = $request->role_id;
        $user->departmentName = $request->departmentName;
        $user->created_at = carbon::now();
        $user->updated_at = carbon::now();
        $user->save();
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */

     public function login(Request $request): JsonResponse
     {
         $validator = Validator::make($request->all(), ["email" => "required|string", "password" => "required"]);
         if ($validator->fails()) {
             return response()->json([
                 "status" => "error",
                 "message" => "Validation Error",
                 "errors" => $validator->errors(),
             ], 422);
         }
 
         if (!Auth::attempt($request->only("email", "password"))) {
             return response()->json([
                 "status" => "error",
                 "message" => "Invalid credentials",
             ], 401);
         }
 
         $token = Auth::user()->createToken('Token')->plainTextToken;
         $cookie = cookie('jwt', $token, 30 * 1);
 
         return response()->json([
             "status" => "success",
             "message" => "System successfully logged " . Auth::user()->first_name,
             "access_token" => $token,
             "token_type" => "bearer",
             "user" => Auth::user(),
         ])->withCookie($cookie);
     }
 


    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }
    
}