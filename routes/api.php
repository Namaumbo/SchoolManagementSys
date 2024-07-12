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
use App\Models\Payment;

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
use App\Http\Controllers\SchoolReportController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PostController;
use App\Models\Post;

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

// UserController Routes
Route::post('/login', [UserController::class, 'login']);
Route::get('/exports', [UserController::class, 'exportIntoExcel']);

// The following are protected routes
    
Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'getUsers');
    Route::get('/department/{id}/users', 'getAllUsersFromEachDepartment');

    Route::post('/register-user', 'registerUser');
    Route::post('/register-user/{id}', 'UserToRoles');
    Route::get('/user/{id}', 'show');
    Route::put('/user/{id}', 'updateUser');
    Route::delete('/user/{id}', 'deleteUser');
    Route::get('/search/{key}', 'Search');
    Route::post('/logout', 'logout');
    Route::post('/allocations/{userId}', 'allocationSubject');
    Route::get('/user/{id}/allocations','getAllocationsForTeacher');


});

Route::controller(DepartmentController::class)->group(function () {
    // Department Routes 
    Route::get('/departments', 'getAll');
    Route::get('/department/{id}', 'show');
    Route::post('/register-department', 'store');
    Route::get('/headOfDepartments', 'getHeadOfDepartments'); // Corrected route definition


    Route::put('/department/{id}', 'update');
    Route::delete('/department/{id}', 'destroy');
    Route::post('/department/{id}/allocate', 'registerUsersToDepartment'); // New route
});


// Subjects Routes
Route::controller(SubjectController::class)->group(function () {
    Route::post('/create-subject', 'store');
    Route::get('/subjects', 'getAll');
    Route::get('/subject/{id}', 'show');
    Route::put('/update-subject/{id}', 'update');
});

// Roles API
Route::controller(RoleController::class)->group(function () {
    $urlPrefix = '/role/{id}';

    Route::get($urlPrefix, function ($role_name) {
        return new RoleResource(Role::findorFail($role_name));
    });

    Route::put($urlPrefix, 'update');
    Route::delete($urlPrefix, 'destroy');
});

// Class Levels Routes
Route::controller(LevelController::class)->group(function () {
    Route::get('/classes', 'getClass');
    Route::post('/create-class', 'store');
    Route::put('/update-class', 'classTeacher');
    Route::get('/class/{id}/students', 'getStudentsByClass');
    Route::get('/class/{id}/usersAllocations', 'getUsersWithAllocations');
    Route::get('/class/{id}/performance', 'getClassPerformance');

});

// Assessments
Route::controller(AssessmentController::class)->group(function () {
    Route::put('/update-assessment', 'UpdateAssessment');
    Route::delete('/assessment', 'deleteAssessment');
});

// School Report
Route::controller(SchoolReportController::class)->group(function () {
    Route::get('/schoolReport', 'store');
});

// Messages
Route::controller(MessageController::class)->group(function () {
    Route::get('/messages', 'getAllMessages');
    Route::post('/create-message', 'store');
    Route::put('/message/{id}', 'update');
    Route::delete('/message/{id}', 'destroy');
});

// Posts
Route::controller(PostController::class)->group(function () {
    Route::get('/posts', 'getAll');
});

// Students API
Route::controller(StudentController::class)->group(function () {
    Route::get('/students', 'getAll');
    Route::post('/create-student', 'registerStudent');
    Route::put('/student/{id}', 'updateStudent');
    Route::delete('/student/{id}', 'deleteStudent');
    Route::post('/register-subject', 'registerSubject');
});

// Payments
Route::controller(PaymentController::class)->group(function () {
    Route::post('/payments', 'feesToStudent');
});

Route::get('/roles', function () {
    return RoleResource::collection(Role::all());
});

