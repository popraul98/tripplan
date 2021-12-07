<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var string[]
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var string[]
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];


//    protected function renderJson($request, Throwable $exception)
//    {
//        if ($request->expectsJson()) {
//            if ($exception instanceof AuthenticationException) {
//                return response()->json([
//                    'message' => json_decode($exception->getMessage()) ?? $exception->getMessage()
//                ], JsonResponse::HTTP_UNAUTHORIZED);
//            }
//            if ($exception instanceof AuthorizationException) {
//                return response()->json([
//                    'message' => json_decode($exception->getMessage()) ?? $exception->getMessage()
//                ], JsonResponse::HTTP_FORBIDDEN);
//            }
//        }
//        throw $exception;
//    }
//
//    public function render($request, Throwable $exception)
//    {
//        return $this->renderJson($request, $exception);
//    }
}
