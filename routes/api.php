<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Department;
use App\Http\Resources\DepartmentResource;

use App\Http\Resources\UserResource;
use App\Http\Controllers\DepartmentController;

use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Users routes
Route::get('/users', function() {
    return UserResource::collection(User::all());
});


Route::get('/user/{id}', function($id)
 {
    return new UserResource(User::findorFail($id));
});


Route::post('/register-user',[UserController::class,'store']);


Route::put('/user/{id}', [UserController::class,'update']);
Route::delete('/user/{id}', [UserController::class,'destroy']);

//DepartmentS Routes
Route::get('/departments', function() {
    return DepartmentResource::collection(Department::all());
});
Route::get('/department/{id}', function($id)
 {
    return new DepartmentResource(Department::findorFail($id));
});

Route::post('/register-department',[DepartmentController::class,'store']);


Route::put('/department/{id}', [DepartmentController::class,'update']);
Route::delete('/department/{id}', [DepartmentController::class,'destroy']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
