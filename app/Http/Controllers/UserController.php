<?php

namespace App\Http\Controllers;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getAll()
    {
//        using the with function with the name of the function
// u will be able to retrieve the user and his related deps
return User::all();
//        $user = User::with('departments')->get();
//        return \response()->json(['$users' => $user]);

//        return  UserResource::collection(User::all());

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
                ['message' => 'User already exists', 'email' => $user], 409
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
    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show(int $id)
    {
        return new UserResource(User::findorFail($id));
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     */

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if (User::where('id', $id)->exists()) {
            $user = User::find($id);
            $this->userDetailsCommon($request, $user);
            return response()->json([
                'message' => 'User is updated successfully'
            ], 400);
        } else {
            return response()->json([
                'message' => 'No User found with that information '
            ], 401);
        }
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
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
        $user->password =Hash::make($request->input('password'));
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
             return response()->json(
                 [
                     "status" => ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
                     "validation_error" => $validator->errors()
                 ]
             );
         }
         //        finding userName
         if (!Auth::attempt($request->only("email", "password"))) {
             return response()->json(["wrong credentials"], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
         }
         $token = Auth::user()->createToken('Token')->plainTextToken;
         $cookie = cookie('jwt', $token, 30 * 1);
         return response()->json(
             [
                 "message" => "System successfully logged " . Auth::user()->first_name,
                 "status" => "ok",
                 "access_token" => $token,
                 "token_type" => "bearer",
                 "user " => Auth::user()
             ],
             ResponseAlias::HTTP_OK
         )->withCookie($cookie);
     }

     public function UserToRoles(Request $request, int $id)
     {
        $user = User::where('id',  $id)->first();
        if ($user) {
            try {
                $role = Role::where('id', $request->input('id'))->first();
                if ($role) {
                    $user->roles()->syncWithoutDetaching($role);
                }
            } catch (EntityNotFoundException $entityNotFoundException) {
                return $entityNotFoundException;
            }
        }

        }
        public function logout(){
            Auth::logout();
            return response()->json([
            'status'=>'success',
            'message'=>'Successfully logged out',
            ]);
        }

     public function search(Request $request,$key): JsonResponse{
            $user= User::query()
            ->where('firstname','LIKE',"%$key%")
            ->orWhere('surname', 'LIKE', "%$key%")
            ->orWhere('sex', 'LIKE', "%$key%")
            ->orWhere('email', 'LIKE', "%$key%")
            ->orWhere('district', 'LIKE', "%$key%")
            ->orWhere('village', 'LIKE', "%$key%")
            ->get();
            return response()->json([
                'User' => $user,
                'status' => 200,
            ]);



}
}

