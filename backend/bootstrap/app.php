<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
        $middleware->appendToGroup('api', \App\Http\Middleware\TokenFromCookie::class);

        // The api middleware group does not run EncryptCookies, so the raw
        // token cookie must be stored unencrypted for TokenFromCookie to read it.
        // The token itself is an opaque random string — encryption adds nothing here.
        $middleware->encryptCookies(except: ['artisan_token']);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
