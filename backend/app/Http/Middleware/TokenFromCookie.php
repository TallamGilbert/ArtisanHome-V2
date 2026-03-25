<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * If no Authorization header is present but the httpOnly artisan_token
 * cookie exists, inject it as a Bearer token so Sanctum's auth:sanctum
 * middleware can validate it without exposing the token to JavaScript.
 */
class TokenFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->bearerToken() && $request->cookie('artisan_token')) {
            $request->headers->set(
                'Authorization',
                'Bearer ' . $request->cookie('artisan_token')
            );
        }

        return $next($request);
    }
}
