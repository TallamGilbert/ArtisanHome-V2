<?php
// CategoryController.php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index() {
        return response()->json(Category::withCount('products')->get());
    }
    public function show(Category $category) {
        return response()->json($category);
    }
    public function products(Category $category, Request $request) {
        $products = $category->products()
            ->with(['images'])
            ->where('is_active', true)
            ->paginate(12);
        return response()->json($products);
    }
}
