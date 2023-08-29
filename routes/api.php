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
use App\Models\Student;
use App\Models\Relationship;
use App\Models\Allocationable;
use App\Models\School;


use App\Http\Resources\DepartmentResource;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ClassLevelResource;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\MessageResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\RelationshipResource;

use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\SchoolController;

use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
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
Route::post('/login', [UserController::class, 'login']);
Route::get('/exports', [UserController::class, 'exportIntoExcel']);


//The following are protected routes
//Route::middleware('auth:sanctum')->group(function () {
Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'getUsers');
 

    Route::post('/register-user', 'registerUser');
    Route::post(
        '/register-user/{id}',
        'UserToRoles'
    );
    Route::get('/user/{id}', 'show');
    Route::put(
        '/user/{id}',
        'updateUser'
    );
    Route::delete('/user/{id}', 'deleteUser');
    Route::get('/search/{key}',  'Search'
    );
    Route::post('/logout', 'logout');

    Route::post('/allocations', 'Allocation');

});
Route::controller(DepartmentController::class)->group(function () {
    // DepartmentS Routes 
    Route::get('/departments', 'getAll');
    Route::get('/department/{id}', 'show');
    Route::post(
        '/register-department',
        'store'
    );
    Route::put('/department/{id}', 'update');
    Route::delete('/department/{id}', 'destroy');
});
//Subjects Routes
Route::controller(SubjectController::class)->group(function () {
    Route::post('/create-subject/{id}', 'store');
    Route::get('/subjects', 'getAll');
    Route::get('/subject/{id}', 'show');

    Route::put('/update-subject/{id}', 'update');
});
//roles api
Route::controller(RoleController::class)->group(function () {
    $urlPrefix = '/role/{id}';

    // whats the use?
    Route::get($urlPrefix, function ($role_name) {
        return new
            RoleResource(Role::findorFail($role_name));
    });

    Route::put($urlPrefix, 'update');
    Route::delete($urlPrefix, 'destroy');
});
// classLevels Routes
Route::controller(LevelController::class)->group(function () {
    Route::get('/classes', function () {
        return
            ClassLevelResource::collection(Level::all());

    });
    Route::post('/create-class', 'store');
    Route::put('/update-class', 'classTeacher');


}); //Assessments
Route::controller(AssessmentController::class)->group(function () {
    Route::put('/create-assessment/{id}', 'updateAssessment');


});


//Messages
Route::controller(MessageController::class)->group(function () {
    Route::get('/messages', 'getAllMessages');
    Route::post('/create-message', 'store');
    Route::put('/message/{id}', 'update');
    Route::delete('/message/{id}', 'destroy');
});
//});
// Api for students
Route::controller(StudentController::class)->group(function () {
    Route::get('/students', 'getStudents');
    Route::post('/create-student', 'registerStudent');
    Route::put('/student/{id}', 'updateStudent');
    Route::delete('/student/{id}', 'destroy');
    Route::post('/student/register-subject', 'registerSubject');

});

Route::get('/roles', function () {
    return RoleResource::collection(Role::all());
});
