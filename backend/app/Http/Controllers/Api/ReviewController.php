<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Product $product)
    {
        return response()->json($product->reviews()->with('user:id,name')->latest()->paginate(10));
    }

    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        if ($product->reviews()->where('user_id', $request->user()->id)->exists()) {
            return response()->json(['error' => 'You have already reviewed this product.'], 422);
        }

        $review = $product->reviews()->create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        $product->update([
            'rating'        => $product->reviews()->avg('rating'),
            'reviews_count' => $product->reviews()->count(),
        ]);

        return response()->json($review->load('user:id,name'), 201);
    }

    public function destroy(Review $review)
    {
        $product = $review->product;
        $review->delete();

        if ($product) {
            $product->update([
                'rating'        => $product->reviews()->avg('rating') ?? 0,
                'reviews_count' => $product->reviews()->count(),
            ]);
        }

        return response()->json(['message' => 'Review deleted']);
    }

    public function adminIndex()
    {
        return response()->json(
            \App\Models\Review::with(['user:id,name,email', 'product:id,name'])
                ->latest()->paginate(25)
        );
    }
}
