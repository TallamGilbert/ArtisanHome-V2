<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.product'])
            ->latest()
            ->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'shipping_name' => 'required|string',
            'shipping_email' => 'required|email',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_state' => 'required|string',
            'shipping_zip' => 'required|string',
            'shipping_country' => 'required|string',
            'payment_method' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.options' => 'nullable|array',
        ]);

        $total = 0;
        $orderItems = [];

        foreach ($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $subtotal = $product->price * $item['quantity'];
            $total += $subtotal;
            $orderItems[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
                'options' => $item['options'] ?? [],
            ];
        }

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'AH-' . strtoupper(Str::random(8)),
            'total' => $total,
            'status' => 'pending',
            'shipping_name' => $data['shipping_name'],
            'shipping_email' => $data['shipping_email'],
            'shipping_address' => $data['shipping_address'],
            'shipping_city' => $data['shipping_city'],
            'shipping_state' => $data['shipping_state'],
            'shipping_zip' => $data['shipping_zip'],
            'shipping_country' => $data['shipping_country'],
            'payment_method' => $data['payment_method'],
            'payment_status' => 'paid', // Demo: always paid
        ]);

        foreach ($orderItems as $item) {
            $order->items()->create($item);
        }

        return response()->json($order->load('items.product'), 201);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return response()->json($order->load('items.product'));
    }
}
