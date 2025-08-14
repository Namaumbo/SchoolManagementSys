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

    // Getting users from the database
    public function getUsers(): JsonResponse
    {
        return $this->userService->getAll();
    }

    public function getAllUsersFromEachDepartment(int $id): JsonResponse
    {
        return $this->userService->getAllUsersFromEachDepartment($id);
    }

    // Registering users to the database
    public function registerUser(Request $request): JsonResponse
    {
        return $this->userService->store($request);
    }

    public function show(int $id): JsonResponse
    {
        return $this->userService->show($id);
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        return $this->userService->update($request, $id);
    }

    public function deleteUser(int $id): JsonResponse
    {
        return $this->userService->destroy($id);
    }

    // Logging in the system
    public function login(Request $request): JsonResponse
    {
        return $this->userService->login($request);
    }

    public function logout(): JsonResponse
    {
        return $this->userService->logout();
    }


    public function allocationSubject(Request $request, $userId)
    {
        return $this->userService->Allocation($request, $userId);
    }
    
    public function getAllocationsForTeacher(int $id): JsonResponse
    {
        return $this->userService->getAllocationsForTeacher($id);
    }
}
