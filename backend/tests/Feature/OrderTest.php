<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    private function validPayload(Product $product, int $quantity = 1): array
    {
        return [
            'shipping_name'    => 'Jane Doe',
            'shipping_email'   => 'jane@example.com',
            'shipping_address' => '1 Test Street',
            'shipping_city'    => 'London',
            'shipping_state'   => 'England',
            'shipping_zip'     => 'SW1A 1AA',
            'shipping_country' => 'GB',
            'payment_method'   => 'stripe',
            'items'            => [
                ['product_id' => $product->id, 'quantity' => $quantity],
            ],
        ];
    }

    public function test_user_can_create_order(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => 100]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->validPayload($product, 2));

        $response->assertStatus(201)
            ->assertJsonFragment(['status' => 'pending', 'payment_status' => 'pending']);

        $this->assertDatabaseHas('orders', ['user_id' => $user->id]);
    }

    public function test_stock_is_decremented_after_order(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);
        Sanctum::actingAs($user);

        $this->postJson('/api/orders', $this->validPayload($product, 3));

        $this->assertEquals(7, $product->fresh()->stock);
    }

    public function test_cannot_order_more_than_available_stock(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create(['stock' => 2]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->validPayload($product, 5));

        $response->assertStatus(422);
        $this->assertEquals(2, $product->fresh()->stock); // stock unchanged
    }

    public function test_cannot_order_inactive_product(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'is_active' => false]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->validPayload($product));

        $response->assertStatus(404);
    }

    public function test_order_total_is_calculated_server_side(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => 500.00]);
        Sanctum::actingAs($user);

        $payload           = $this->validPayload($product, 2);
        $payload['items'][0]['price'] = 1; // attacker sends a fake price

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['total' => '1000.00']); // server price used, not client's
    }

    public function test_user_cannot_view_another_users_order(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $order = Order::factory()->for($owner)->create();
        Sanctum::actingAs($other);

        $this->getJson("/api/orders/{$order->id}")->assertStatus(403);
    }

    public function test_user_can_view_own_order(): void
    {
        $user  = User::factory()->create();
        $order = Order::factory()->for($user)->create();
        Sanctum::actingAs($user);

        $this->getJson("/api/orders/{$order->id}")->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_create_order(): void
    {
        $product = Product::factory()->create(['stock' => 5]);

        $this->postJson('/api/orders', $this->validPayload($product))->assertStatus(401);
    }

    public function test_payment_method_must_be_valid(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create(['stock' => 5]);
        Sanctum::actingAs($user);

        $payload                   = $this->validPayload($product);
        $payload['payment_method'] = 'bitcoin'; // not in allowed list

        $this->postJson('/api/orders', $payload)->assertStatus(422);
    }
}
