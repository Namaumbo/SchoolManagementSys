<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Subject;
use App\Models\Role;
use App\Models\Level;

use App\Models\Department;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ClassLevelResource;

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

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
Route::post('/register-user/{id}', [UserController::class, 'UserToRoles']);

Route::post('/login', [UserController::class, 'login']);

Route::put('/user/{id}', [UserController::class,'update']);
Route::delete('/user/{id}', [UserController::class,'destroy']);
Route::get('/search/{key}',[UserController::class,'Search']);

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


//Subjects Routes

Route::get('/subjects', function() {
    return SubjectResource::collection(Subject::all());
});

Route::get('/subject/{id}', function($id)
 {
    return new SubjectResource(Subject::findorFail($id));
});

Route::post('/register-subject',[SubjectController::class,'store']);


Route::put('/subject/{id}', [SubjectController::class,'update']);
Route::delete('/subject/{id}', [SubjectController::class,'destroy']);


//roles api
Route::get('/roles', function() {
    return RoleResource::collection(Role::all());
});


Route::get('/role/{id}', function($id)
 {
    return new RoleResource(Role::findorFail($id));
});

Route::post('/create-role',[RoleController::class,'store']);
Route::put('/role/{id}', [RoleController::class,'update']);

Route::delete('/role/{id}', [RoleController::class,'destroy']);

//classLevels Routes
Route::get('/classes', function() {
    return ClassLevelResource::collection(Level::all());
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
