<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category', 'images'])
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(100);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric',
            'category_id'    => 'required|exists:categories,id',
            'material'       => 'nullable|string',
            'dimensions'     => 'nullable|string',
            'weight'         => 'nullable|string',
            'finish'         => 'nullable|string',
            'stock'          => 'required|integer|min:0',
            'colors'         => 'nullable|array',
            'is_featured'    => 'boolean',
            'is_best_seller' => 'boolean',
            'images'         => 'nullable|array|max:20',
            'images.*'       => 'nullable|url|max:2048|regex:/^https:\/\//',
        ]);

        $product = Product::create([
            ...$data,
            'slug'      => Str::slug($data['name']) . '-' . Str::random(6),
            'is_active' => true,
            'images'    => null, // stored in product_images table
        ]);

        // Store CDN image URLs
        if (!empty($data['images'])) {
            foreach ($data['images'] as $i => $url) {
                $product->images()->create([
                    'url'        => $url,
                    'sort_order' => $i,
                ]);
            }
        }

        return response()->json($this->formatProduct($product), 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'           => 'sometimes|string|max:255',
            'description'    => 'nullable|string',
            'price'          => 'sometimes|numeric|min:0',
            'original_price' => 'nullable|numeric',
            'category_id'    => 'sometimes|exists:categories,id',
            'material'       => 'nullable|string',
            'dimensions'     => 'nullable|string',
            'weight'         => 'nullable|string',
            'finish'         => 'nullable|string',
            'stock'          => 'sometimes|integer|min:0',
            'colors'         => 'nullable|array',
            'is_featured'    => 'boolean',
            'is_best_seller' => 'boolean',
            'is_active'      => 'boolean',
            'images'         => 'nullable|array|max:20',
            'images.*'       => 'nullable|url|max:2048|regex:/^https:\/\//',
        ]);

        $images = $data['images'] ?? null;
        unset($data['images']);

        $product->update($data);

        // Replace images if provided
        if ($images !== null) {
            $product->images()->delete();
            foreach ($images as $i => $url) {
                $product->images()->create([
                    'url'        => $url,
                    'sort_order' => $i,
                ]);
            }
        }

        return response()->json($this->formatProduct($product));
    }

    public function destroy(Product $product)
    {
        $product->images()->delete();
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    private function formatProduct(Product $product)
    {
        $product->load(['category', 'images']);
        $arr = $product->toArray();
        // Flatten images to URL strings for frontend
        $arr['images'] = $product->images->pluck('url')->toArray();
        return $arr;
    }
    public function show(Product $product)
    {
        return response()->json($this->formatProduct($product));
    }
}
