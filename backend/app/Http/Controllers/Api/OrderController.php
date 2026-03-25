<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'shipping_name'    => 'required|string|max:255',
            'shipping_email'   => 'required|email|max:255',
            'shipping_address' => 'required|string|max:500',
            'shipping_city'    => 'required|string|max:100',
            'shipping_state'   => 'required|string|max:100',
            'shipping_zip'     => 'required|string|max:20',
            'shipping_country' => 'required|string|max:100',
            'payment_method'   => 'required|string|in:stripe,paypal,bank_transfer',
            'items'            => 'required|array|min:1|max:50',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1|max:100',
            'items.*.options'    => 'nullable|array',
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $total = 0;
            $orderItems = [];

            foreach ($data['items'] as $item) {
                $product = Product::where('id', $item['product_id'])
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($product->stock < $item['quantity']) {
                    abort(422, "Insufficient stock for \"{$product->name}\". Available: {$product->stock}.");
                }

                $product->decrement('stock', $item['quantity']);

                $total += $product->price * $item['quantity'];
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'price'      => $product->price, // server-side price, never trust client
                    'options'    => $item['options'] ?? [],
                ];
            }

            $order = Order::create([
                'user_id'          => $request->user()->id,
                'order_number'     => 'AH-' . strtoupper(Str::random(8)),
                'total'            => $total,
                'status'           => 'pending',
                'shipping_name'    => $data['shipping_name'],
                'shipping_email'   => $data['shipping_email'],
                'shipping_address' => $data['shipping_address'],
                'shipping_city'    => $data['shipping_city'],
                'shipping_state'   => $data['shipping_state'],
                'shipping_zip'     => $data['shipping_zip'],
                'shipping_country' => $data['shipping_country'],
                'payment_method'   => $data['payment_method'],
                'payment_status'   => 'pending',
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            return $order;
        });

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
