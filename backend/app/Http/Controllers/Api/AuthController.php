<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * 7-day httpOnly cookie. Secure flag is only set in production
     * so local http:// development still works.
     */
    private function tokenCookie(string $token): \Symfony\Component\HttpFoundation\Cookie
    {
        return cookie(
            'artisan_token',
            $token,
            60 * 24 * 7,          // minutes (7 days)
            '/',
            null,
            app()->isProduction(), // Secure: HTTPS only in production
            true,                  // HttpOnly: JS cannot read
            false,
            'Lax'                  // SameSite
        );
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'phone', 'is_admin']),
        ], 201)->withCookie($this->tokenCookie($token));
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'phone', 'is_admin']),
        ])->withCookie($this->tokenCookie($token));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'])
            ->withCookie(cookie()->forget('artisan_token'));
    }

    public function user(Request $request)
    {
        return response()->json(
            $request->user()
                ->only(['id', 'name', 'email', 'phone', 'is_admin'])
                + ['addresses' => $request->user()->addresses]
        );
    }
}
