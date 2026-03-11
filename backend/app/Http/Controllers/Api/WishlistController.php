<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request) {
        return response()->json($request->user()->wishlist()->with(['category', 'images'])->get());
    }

    public function store(Request $request) {
        $data = $request->validate(['product_id' => 'required|exists:products,id']);
        $request->user()->wishlist()->syncWithoutDetaching([$data['product_id']]);
        return response()->json(['message' => 'Added to wishlist']);
    }

    public function destroy(Request $request, Product $product) {
        $request->user()->wishlist()->detach($product->id);
        return response()->json(['message' => 'Removed from wishlist']);
    }
}
