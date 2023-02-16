<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Subject;
use App\Models\Role;
use App\Models\Level;
use App\Models\Assessment;
use App\Models\Department;
use App\Models\Message;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ClassLevelResource;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\MessageResource;

use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\MessageController;

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


//UserController Routes


 

Route::controller(UserController::class)->group(function(){
    Route::get('/users','getAll');

    Route::post('/register-user','store');
    Route::post('/register-user/{id}', 'UserToRoles');
    Route::get('/user/{id}', 'show');
    Route::post('/login', 'login');
    
    Route::put('/user/{id}', 'update');
    Route::delete('/user/{id}', 'destroy');
    Route::get('/search/{key}','Search');
    Route::post('/logout','logout');



});







Route::controller(DepartmentController::class)->group(function(){

//DepartmentS Routes
Route::get('/departments','getAll');
Route::get('/department/{id}', 'show');

Route::post('/register-department','store');


Route::put('/department/{id}', 'update');
Route::delete('/department/{id}','destroy');

});

//Subjects Routes
Route::controller(SubjectController::class)->group(function(){

Route::get('/subjects', 'getAll');

Route::get('/subject/{id}','show');
Route::post('/register-subject','store');


Route::put('/subject/{id}','update');
Route::delete('/subject/{id}', 'destroy');

});

//roles api
Route::controller(RoleController::class)->group(function(){

Route::get('/roles', function() {
    return RoleResource::collection(Role::all());
});


Route::get('/role/{id}', function($id)
 {
    return new RoleResource(Role::findorFail($id));
});

Route::post('/create-role','store');
Route::put('/role/{id}','update');

Route::delete('/role/{id}', 'destroy');
});


//classLevels Routes

Route::controller(ClassController::class)->group(function(){

Route::get('/classes', function() {
    return ClassLevelResource::collection(Level::all());
});
});
Route::controller(AssessmentController::class)->group(function(){

//Assessments

Route::controller(AssessmentController::class)->group(function(){

Route::post('/create-assessment','create');
Route::get('/assessments', 'index' );
});
});

//Messages
Route::controller(MessageController::class)->group(function(){

Route::get('/messages','getAllMessages');
Route::post('/create-message','store');
Route::put('/message/{id}','update');
Route::delete('/message/{id}', 'destroy');


});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
