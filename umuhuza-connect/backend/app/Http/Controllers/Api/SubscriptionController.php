<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * List available employer and seller plans
     */
    public function plans()
    {
        return response()->json([
            'status' => 'success',
            'currency' => 'RWF',
            'plans' => [
                [
                    'id' => 'starter',
                    'name' => 'Starter Talent',
                    'price_monthly' => 0,
                    'price_annual' => 0,
                    'max_active_jobs' => 1,
                    'features' => ['1 Active Job Listing', 'Standard search ranking', '30-day posting']
                ],
                [
                    'id' => 'growth',
                    'name' => 'Growth Pro Hiring',
                    'price_monthly' => 35000,
                    'price_annual' => 350000,
                    'max_active_jobs' => 10,
                    'features' => ['10 Active Job Listings', 'Verified Badge', 'MoMo SMS Alerts', 'Promoted feed placement']
                ],
                [
                    'id' => 'enterprise',
                    'name' => 'Cooperative Enterprise',
                    'price_monthly' => 95000,
                    'price_annual' => 950000,
                    'max_active_jobs' => 999,
                    'features' => ['Unlimited Postings', 'Dedicated HR Manager', 'Pre-vetted pipeline', 'RRA Tax Invoices']
                ]
            ]
        ]);
    }

    /**
     * Subscribe to a plan with MTN MoMo / Airtel Money reference
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|in:growth,enterprise',
            'billing_cycle' => 'required|in:monthly,annual',
            'phone' => 'required|string',
            'payment_method' => 'required|string',
            'momo_transaction_ref' => 'nullable|string',
        ]);

        $prices = [
            'growth' => ['monthly' => 35000, 'annual' => 350000],
            'enterprise' => ['monthly' => 95000, 'annual' => 950000],
        ];

        $amount = $prices[$validated['plan_id']][$validated['billing_cycle']];
        $txnRef = $validated['momo_transaction_ref'] ?? 'MTN-RW-' . rand(100000, 999999);

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription activated successfully via Rwandan Mobile Money',
            'subscription' => [
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'amount_rwf' => $amount,
                'transaction_ref' => $txnRef,
                'status' => 'active',
                'activated_at' => now()->toIso8601String(),
                'expires_at' => $validated['billing_cycle'] === 'monthly' ? now()->addMonth()->toIso8601String() : now()->addYear()->toIso8601String(),
            ]
        ]);
    }
}
