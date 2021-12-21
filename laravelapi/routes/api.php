<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Console\Kernel;
use App\Http\Middleware;
use App\Http\Middleware\IsAdmin;

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


Route::post("/register", [\App\Http\Controllers\UserController::class, 'register']);
Route::post("/login", [\App\Http\Controllers\UserController::class, 'login']);

Route::group(["middleware" => ['auth:api']], function () {
    Route::post("/logout", [\App\Http\Controllers\UserController::class, 'logout']);
    Route::get("/get-user", [\App\Http\Controllers\UserController::class, 'getUser']);

    //handle USER routes
    //   api/users/{user}/trips
    Route::group(["prefix" => 'trips', "middleware" => ['isUser']], function () {
        Route::get('', [\App\Http\Controllers\TripController::class, 'index']);
        Route::post('', [\App\Http\Controllers\TripController::class, 'store']);
        Route::group(["prefix" => '{trip}'], function () {
            Route::delete('', [\App\Http\Controllers\TripController::class, 'destroy']);
            Route::get('', [\App\Http\Controllers\TripController::class, 'show']);
        });
        Route::delete('{trip}', [\App\Http\Controllers\TripController::class, 'destroy']);
        Route::get('{trip}', [\App\Http\Controllers\TripController::class, 'show']);
    });

    //handle ADMIN routes
    Route::group(["middleware" => ['isAdmin']], function () {
        Route::get('/get-list-users', [\App\Http\Controllers\AdminPageController::class, 'index']);
        Route::delete('/delete-user/{id}', [\App\Http\Controllers\AdminPageController::class, 'deleteUser']);
    });
});

Route::get("/refresh_token", [\App\Http\Controllers\UserController::class, 'refreshToken']);
Route::post("/reset-password-request", [\App\Http\Controllers\UserController::class, 'resetPasswordRequest']);
Route::post("/check-token-resetPassword", [\App\Http\Controllers\UserController::class, 'checkTokenResetPassword']);
Route::post("/reset-password", [\App\Http\Controllers\UserController::class, 'resetPassword']);
