<?php

use Illuminate\Support\Facades\Route;

// We’ll be using React
// Router to handle routing in our application.
// For this, we need to render a single view file for all our application routes

Route::view('/{path?}', 'welcome');

//Route::get('{reactRoutes}', static function () {
//    return view('mainView'); // your start view
//})->where('reactRoutes', '^((?!api).)*$'); // except 'api' word
