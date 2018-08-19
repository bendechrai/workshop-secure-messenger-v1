<?php

use Illuminate\Http\Request;

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
Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth')->get('/user/{user}/keys', 'Api\UserController@show');
Route::middleware('auth')->post('/user/{user}/keys', 'Api\UserController@update');

