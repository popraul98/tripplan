<?php

namespace App\Http\Middleware;


use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        /**
         * Handle an incoming request.
         *
         * @param User $user
         * @return mixed
         */

        $user = Auth::user();
        if ($user->isAdmin()) {
            return $next($request);
        } else {
            return response('Unauthorized.', 403);
        }
    }
}
