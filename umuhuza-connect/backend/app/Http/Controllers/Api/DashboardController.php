<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $user ? $user->only(['id', 'name', 'email']) : null,
            'stats' => [
                'published_jobs' => Job::where('status', 'published')->count(),
                'my_applications' => $user ? Application::where('user_id', $user->id)->count() : 0,
                'my_products' => $user ? Product::where('seller_id', $user->id)->count() : 0,
            ],
            'note' => 'Counts are live database values. Do not expose private records from other users.',
        ]);
    }
}
