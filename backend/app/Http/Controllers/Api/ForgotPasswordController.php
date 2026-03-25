<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Intentionally ambiguous response — never confirm whether the email exists
        Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => 'If that email address is registered, a password reset link has been sent.',
        ]);
    }
}
