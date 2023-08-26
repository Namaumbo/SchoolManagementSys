<?php

namespace App\Http\Controllers;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
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


    public function deleteUser(int $id){
        return $this->UserService->destroy($id);
    }
    //logging in the system

    public function login(Request $userService){
    return $this->UserService->login($userService);


    }

    public function logout(){

   return $this->UserService->logout();


    }
  
}
