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

    //handle USER routes
    //   api/users/{user}/trips

    Route::group(["prefix" => 'trips', "middleware" => ['isUser']], function () {
        Route::get('', [\App\Http\Controllers\TripController::class, 'index']);
        Route::post('', [\App\Http\Controllers\TripController::class, 'store']);
        Route::put('edit/{trip}', [\App\Http\Controllers\TripController::class, 'update']);

        Route::group(["prefix" => '{trip}'], function () {
            Route::get('', [\App\Http\Controllers\TripController::class, 'show']);
            Route::delete('', [\App\Http\Controllers\TripController::class, 'destroy']);
        });

    });

    //handle ADMIN routes
    Route::group(["prefix" => 'admin', "middleware" => ['isAdmin']], function () {
        Route::get('', [\App\Http\Controllers\AdminPageController::class, 'index']);
        Route::group(["prefix" => '/user/{id}'], function () {
            Route::get('', [\App\Http\Controllers\AdminPageController::class, 'getTripsUser']);
            Route::delete('', [\App\Http\Controllers\AdminPageController::class, 'deleteUser']);
        });

    });
});

Route::get("/refresh_token", [\App\Http\Controllers\UserController::class, 'refreshToken']);
Route::post("/reset-password-request", [\App\Http\Controllers\UserController::class, 'resetPasswordRequest']);
Route::post("/check-token-resetPassword", [\App\Http\Controllers\UserController::class, 'checkTokenResetPassword']);
Route::post("/reset-password", [\App\Http\Controllers\UserController::class, 'resetPassword']);
