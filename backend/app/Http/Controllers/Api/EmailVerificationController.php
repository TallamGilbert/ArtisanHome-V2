<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    /**
     * Verify the signed email link.
     * The link is clicked in the user's email client, hits the backend,
     * marks the email as verified, then redirects to the frontend.
     */
    public function verify(Request $request, int $id, string $hash)
    {
        $user = User::findOrFail($id);
        $frontend = rtrim(config('frontend.url'), '/');

        // Check signature (includes expiry) before doing any hash comparison
        if (!$request->hasValidSignature()) {
            return redirect("{$frontend}/email-verified?error=expired");
        }

        if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
            return redirect("{$frontend}/email-verified?error=invalid");
        }

        if ($user->hasVerifiedEmail()) {
            return redirect("{$frontend}/email-verified?already=true");
        }

        $user->markEmailAsVerified();

        return redirect("{$frontend}/email-verified");
    }

    /**
     * Resend the verification email for the currently authenticated user.
     */
    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email is already verified.'], 422);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent.']);
    }
}
