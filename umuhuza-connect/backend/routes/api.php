<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;

Route::prefix('v1')->group(function () {
    // Health & System Information
    Route::get('/health', fn () => response()->json([
        'status' => 'ok',
        'app' => 'Umuhuza Connect API',
        'target_market' => 'Rwanda',
        'currency' => 'RWF',
        'version' => '1.0.0'
    ]));

    // Public Opportunity & Marketplace Catalog
    Route::get('/dashboard', [DashboardController::class, 'show']);
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/{job}', [JobController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/plans', [SubscriptionController::class, 'plans']);

    // Authentication Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected Routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Applications Pipeline
        Route::post('/jobs/{job}/applications', [ApplicationController::class, 'store']);
        Route::get('/my-applications', [ApplicationController::class, 'mine']);

        // Product Catalog Management
        Route::post('/products', [ProductController::class, 'store']);

        // Subscriptions & MoMo Payment
        Route::post('/subscriptions/subscribe', [SubscriptionController::class, 'subscribe']);
    });
});

