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

//user Login/Register/etc.
Route::post("/register", [\App\Http\Controllers\UserController::class, 'register']);
Route::post("/login", [\App\Http\Controllers\UserController::class, 'login']);
Route::post("/logout", [\App\Http\Controllers\UserController::class, 'logout']);

//Route::get('redirect', function () {
//    Route::get('/redirect', function () {
//        $query = http_build_query([
//            'client_id' => '5',
//            'redirect_uri' => 'http://localhost:3000/callback',
//            'response_type' => 'code',
//            'scope' => '',
//        ]);
//
//        return redirect('http://localhost:3000/oauth/authorize?' . $query);
//    });
//})->name('get-token');
//
//Route::get('/callback', function (Request $request) {
//    $http = new GuzzleHttp\Client;
//
//    $response = $http->post('http://localhost:3000/oauth/token', [
//        'form_params' => [
//            'grant_type' => 'authorization_code',
//            'client_id' => '5',
//            'client_secret' => 'R04JdQoijxxrtmQVRwVR0vrGoNQiOssfLaXVeJIH',
//            'redirect_uri' => 'http://localhost:3000/callback',
//            'code' => $request->code,
//        ],
//    ]);
//
//    return json_decode((string) $response->getBody(), true);
//});


Route::get("/get-user", [\App\Http\Controllers\UserController::class, 'getUser'])->middleware('auth:api');
Route::post("/reset-password-request", [\App\Http\Controllers\UserController::class, 'resetPasswordRequest']);
Route::post("/check-token-resetPassword", [\App\Http\Controllers\UserController::class, 'checkTokenResetPassword']);
Route::post("/reset-password", [\App\Http\Controllers\UserController::class, 'resetPassword']);

//Trips
Route::post('/get-trips', [\App\Http\Controllers\TripController::class, 'index']);
Route::post('/create-trip', [\App\Http\Controllers\TripController::class, 'store']);
Route::delete('/delete-trip/{id}', [\App\Http\Controllers\TripController::class, 'destroy']);



