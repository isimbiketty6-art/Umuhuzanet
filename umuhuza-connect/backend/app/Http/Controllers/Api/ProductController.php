<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()->with('seller:id,name')
            ->where('status', 'published')
            ->when($request->query('q'), fn ($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->latest()->paginate(12);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', 'string', 'max:80'],
            'price_amount' => ['required', 'integer', 'min:0'],
            'currency' => ['nullable', 'in:RWF'],
        ]);

        $product = Product::create([
            ...$data,
            'seller_id' => $request->user()->id,
            'slug' => Str::slug($data['name']).'-'.Str::lower(Str::random(6)),
            'currency' => $data['currency'] ?? 'RWF',
            'status' => 'pending_review',
        ]);

        return response()->json(['data' => $product], 201);
    }
}
