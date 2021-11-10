<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//user
Route::post("/register", [\App\Http\Controllers\UserController::class, 'register']);
Route::post("/login", [\App\Http\Controllers\UserController::class, 'login']);

//Trips
Route::post('/get-trips', [\App\Http\Controllers\TripController::class, 'index']);
Route::post('/create-trip', [\App\Http\Controllers\TripController::class, 'store']);
Route::delete('/delete-trip/{id}', [\App\Http\Controllers\TripController::class, 'destroy']);



