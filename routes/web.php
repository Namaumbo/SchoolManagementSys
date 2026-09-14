<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Application is healthy',
    ], 200);
});

Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'getAll');
Route::get('/', function () {
    return view('welcome');
});
});
Auth::routes();


