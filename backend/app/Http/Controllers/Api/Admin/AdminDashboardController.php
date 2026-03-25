<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'total_orders' => Order::count(),
            'total_customers' => User::where('is_admin', false)->count(),
            'total_products' => Product::where('is_active', true)->count(),
            'recent_orders' => Order::with(['user:id,name,email', 'items.product'])
                ->latest()->limit(10)->get(),
            'top_products' => Product::withCount('orderItems')
                ->orderByDesc('order_items_count')
                ->limit(5)->get(),
        ]);
    }
}
