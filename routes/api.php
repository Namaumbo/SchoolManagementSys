<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Resources\UserResource;
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

Route::get('/users', function() {
    return UserResource::collection(User::all());
});


Route::get('/user/{id}', function($id)
 {
    return new UserResource(User::findorFail($id));
});


Route::post('/register-user',[UserController::class,'store']);


Route::put('/user/{id}', [UserController::class,'update']);
Route::delete('/user/{id}', [UserController::class,'destory']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
