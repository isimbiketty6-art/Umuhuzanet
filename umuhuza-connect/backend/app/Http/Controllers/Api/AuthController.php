<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Register a new Rwandan user (Job seeker, Employer, Seller, Admin)
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'national_id' => 'nullable|string|digits:16',
            'district' => 'required|string|max:100',
            'role' => 'required|in:Job seeker,Employer,Seller,Administrator',
            'company_name' => 'nullable|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'national_id' => $validated['national_id'] ?? null,
            'district' => $validated['district'],
            'role' => $validated['role'],
            'company_name' => $validated['company_name'] ?? null,
            'is_verified' => !empty($validated['national_id']),
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('umuhuza-auth-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully on Umuhuza Connect',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'district' => $user->district,
                'role' => $user->role,
                'is_verified' => $user->is_verified,
            ]
        ], 201);
    }

    /**
     * Authenticate existing user via email or phone
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email_or_phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email_or_phone'])
            ->orWhere('phone', $validated['email_or_phone'])
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Rwandan credentials. Please check your phone/email and password.'
            ], 401);
        }

        $token = $user->createToken('umuhuza-auth-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'district' => $user->district,
                'role' => $user->role,
                'is_verified' => $user->is_verified,
            ]
        ]);
    }

    /**
     * Get authenticated user profile
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => $request->user()
        ]);
    }

    /**
     * Logout and revoke Sanctum tokens
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }
}
