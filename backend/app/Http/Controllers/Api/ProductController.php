<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private function formatProduct($product)
    {
        $arr = $product->toArray();
        $arr['images'] = $product->images->pluck('url')->toArray();
        return $arr;
    }

    public function index(Request $request)
    {
        $query = Product::with(['category', 'images'])
            ->where('is_active', true);

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->min_price) $query->where('price', '>=', $request->min_price);
        if ($request->max_price) $query->where('price', '<=', $request->max_price);
        if ($request->material) $query->where('material', 'like', "%{$request->material}%");
        if ($request->search) {
            $q = $request->search;
            $query->where(
                fn($sq) => $sq
                    ->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('material', 'like', "%{$q}%")
            );
        }

        switch ($request->sort) {
            case 'price-asc':
                $query->orderBy('price');
                break;
            case 'price-desc':
                $query->orderByDesc('price');
                break;
            case 'rating':
                $query->orderByDesc('rating');
                break;
            case 'newest':
                $query->latest();
                break;
            default:
                $query->orderByDesc('is_featured')->orderByDesc('created_at');
        }

        $paginated = $query->paginate($request->per_page ?? 12);

        // Flatten images on each product
        $paginated->getCollection()->transform(fn($p) => $this->formatProduct($p));

        return response()->json($paginated);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'images', 'reviews.user']);
        return response()->json($this->formatProduct($product));
    }

    public function featured()
    {
        $products = Product::with(['category', 'images'])
            ->where('is_featured', true)->where('is_active', true)
            ->limit(8)->get();
        return response()->json($products->map(fn($p) => $this->formatProduct($p)));
    }

    public function bestSellers()
    {
        $products = Product::with(['category', 'images'])
            ->where('is_best_seller', true)->where('is_active', true)
            ->limit(8)->get();
        return response()->json($products->map(fn($p) => $this->formatProduct($p)));
    }

    public function search(Request $request)
    {
        $q = $request->q;
        $products = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->where(
                fn($query) => $query
                    ->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('material', 'like', "%{$q}%")
                    ->orWhereHas('category', fn($sq) => $sq->where('name', 'like', "%{$q}%"))
            )
            ->limit(20)->get();
        return response()->json($products->map(fn($p) => $this->formatProduct($p)));
    }
}
