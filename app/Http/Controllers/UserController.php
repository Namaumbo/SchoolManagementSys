<?php

namespace App\Http\Controllers;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    

     public function __construct(UserService $userService)

     {
        $this->UserService = $userService;


     }
     //getting users from the database
    public function getUsers()
    {
      return  $this->UserService->getAll();

    
    }
    //registering users to the database

    public function registerUser(Request $userService){
        return  $this->UserService->store($userService);
    }
    //Updating users

    public function updateUser(Request $userService,int $id){
         return $this->UserService->update($userService,$id);
    }

    // deleting the user

<<<<<<< HEAD
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {

        try {

            $user = User::where('email', $request->input('email'))->first();
            //Username represents a
            if ($user) {
                return response()->json(
                    ['message' => 'User already exists', 'email' => $user],
                    409
                );
            }

            $user = new User;
            $this->userDetailsCommon($request, $user);

            return response()->json([
                'message' => 'User saved successfully',
                'User' => $user,
                'status' => 201,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'errors' =>   `{$e->getMessage()}`,
                'message' => 'User not saved',
                'status' => 404,
                '4' => $e,
            ], 404);
        }
=======
    public function deleteUser(int $id){
        return $this->UserService->destroy($id);
    }
    //logging in the system

    public function login(Request $userService){
    return $this->UserService->login($userService);

>>>>>>> 2e3aa2c84aa5ef906c69b991d6e47ab3dce243e2
    }

    public function logout(){

   return $this->UserService->logout();


    }
  
}
