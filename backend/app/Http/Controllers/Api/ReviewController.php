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
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);
        $review = $product->reviews()->create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);
        // Update product avg rating
        $product->update(['rating' => $product->reviews()->avg('rating')]);
        return response()->json($review->load('user:id,name'), 201);
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(['message' => 'Review deleted']);
    }

    public function adminIndex()
    {
        return response()->json(
            \App\Models\Review::with(['user:id,name,email', 'product:id,name'])
                ->latest()->paginate(200)
        );
    }
}
