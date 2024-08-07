<?php
namespace App\Services;
use App\Exceptions\Handler;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Level;
use App\Models\Allocationable;
use App\Models\Department;
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
       public $response = [];
        public$code = 404;
        public function getAll()
        {
            // Get the logged-in user
            $user = User::all();
             
        
            return response()->json([
                'message' => 'User details retrieved successfully',
                'status' => 'success',
                'users' => $user,
            ]);
        }
        
        public function store(Request $request): JsonResponse
        {
            $user = User::where('email', $request->input('email'))->first();
        
            // Check if the user already exists
            if ($user) {
                return response()->json(['message' => 'User already exists', 'email' => $user], 409);
            }
        
            try {
                // Create a new user
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
                    'error' => $e->getMessage(),
                ], 404);
            }
        }
        

        public function Allocation(Request $request): JsonResponse
        {
            try {
                $user = User::where('email', $request->input('email'))->first();
                $subject = Subject::where('name', $request->input('name'))->first();
                $level = Level::where('className', $request->input('className'))->first();
        
                if (!$user || !$level || !$subject) {
                    return $this->handleAllocationError(
                        'Information provided doesn\'t exist in the database',
                        $user,
                        $level,
                        $subject
                    );
                }
        
                // Allocate users with subject and class
                $subject->users()->syncWithoutDetaching($user);
                $subject->levels()->syncWithoutDetaching($level);
                $subject->save();
        
                return $this->handleAllocationSuccess($user, $level, $subject);
            } catch (\Exception $e) {
                return $this->handleAllocationError(
                    'Error allocating subject and class: ' . $e->getMessage(),
                    $user ?? null,
                    $level ?? null,
                    $subject ?? null
                );
            }
        }
        
        private function handleAllocationSuccess(User $user, Level $level, Subject $subject): JsonResponse
        {
            return response()->json([
                'message' => 'Subject and class allocated successfully',
                'status' => 'success',
                'Teacher' => $user->firstname . ' ' . $user->surname,
                'Email' => $user->email,
                'Class' => $level->className,
                'Subject' => $subject->name,
            ], 201);
        }
        
        private function handleAllocationError(string $errorMessage, ?User $user, ?Level $level, ?Subject $subject): JsonResponse
        {
            return response()->json([
                'message' => $errorMessage,
                'status' => 'fail',
                'Teacher' => $user ? $user->firstname . ' ' . $user->surname : null,
                'Email' => $user ? $user->email : null,
                'Class' => $level ? $level->className : null,
                'Subject' => $subject ? $subject->name : null,
            ]);
        }
        
    public function show(int $id){
        try{
      $user=User::findorfail($id);
      return $user;

     } catch (\Exception $e) {
        $response['message'] = $e->getMessage();
      
    

    return response()->json($response);
}

    }
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $this->userDetailsCommon($request, $user);
            return response()->json([
                'message' => 'Success',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            throw $e;
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
        $user->role_name = $request->role_name;
        $user->created_at = carbon::now();
        $user->updated_at = carbon::now();
        $user->save();
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */



     /**
      * Handle user login request.
      *
      * @param Request $request The request object containing email and password.
      * @return JsonResponse The JSON response containing the access token and user details.
      */
     public function login(Request $request): JsonResponse
     {
         // Validate the request data using Laravel Validator class.
         $validator = Validator::make($request->all(), [
             "email" => "required|string", // Email is required and must be a string.
             "password" => "required", // Password is required.
         ]);

         // If validation fails, return a JSON response with validation errors.
         if ($validator->fails()) {
             return response()->json([
                 "status" => "error", // Set the status to error.
                 "message" => "Validation Error", // Set the error message.
                 "errors" => $validator->errors(), // Include the validation errors.
             ], 422);
         }
         
         // Retrieve the user from the database using the email.
         $user = User::where('email', $request->email)->first();
         
         // Increment the login count for the user, and the last_login
         $user->login_count = $user->login_count + 1;
         $user->last_login = now();
         $user->save();
         
         // Attempt to authenticate the user using the provided email and password.
         if (!Auth::attempt($request->only("email", "password"))) {
             return response()->json([
                 "status" => "error", // Set the status to error.
                 "message" => "Invalid credentials", // Set the error message.
             ], 401);
         }
 
         // Create a new access token for the authenticated user.
         $token = Auth::user()->createToken('Token')->plainTextToken;
         
         // Create a cookie with the access token and set it to expire in 30 days.
         $cookie = cookie('jwt', $token, 30 * 1);
 
         // Return a JSON response with the access token, user details, and cookie.
         return response()->json([
             "status" => "success", // Set the status to success.
             "message" => "System successfully logged " . Auth::user()->first_name, // Set the success message.
             "access_token" => $token, // Include the access token.
             "token_type" => "bearer", // Include the token type.
             "user" => Auth::user(), // Include the authenticated user's details.
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