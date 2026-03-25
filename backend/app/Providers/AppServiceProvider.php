<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Password reset email links point to the frontend reset-password page.
        // The frontend collects the new password and calls POST /api/reset-password.
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
            return "{$frontend}/reset-password?token={$token}&email=" . urlencode($user->email);
        });
    }
}
