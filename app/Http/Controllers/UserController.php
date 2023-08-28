<?php

namespace App\Http\Controllers;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    
    protected $userService;

     public function __construct(UserService $userService)

     {
        $this->userService = $userService;


     }
     //getting users from the database
    public function getUsers()
    {
      return  $this->userService->getAll();
    }
    //registering users to the database

    public function registerUser(Request $userService){
        return  $this->userService->store($userService);
    }
    //Updating users

    public function updateUser(Request $userService,int $id){
         return $this->userService->update($userService,$id);
    }


    public function deleteUser(int $id){
        return $this->userService->destroy($id);
    }
    //logging in the system

    public function login(Request $userService){
    return $this->userService->login($userService);


    }

    public function logout(){

   return $this->userService->logout();


    }
  
}
