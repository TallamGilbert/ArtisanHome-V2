<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminTest extends TestCase
{
    public function test_unauthenticated_user_cannot_access_admin(): void
    {
        $this->getJson('/api/admin/dashboard')->assertStatus(401);
    }

    public function test_non_admin_cannot_access_admin_dashboard(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/admin/dashboard')->assertStatus(403);
    }

    public function test_admin_can_access_dashboard(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson('/api/admin/dashboard')->assertStatus(200)
            ->assertJsonStructure([
                'total_revenue',
                'total_orders',
                'total_customers',
                'total_products',
                'recent_orders',
                'top_products',
            ]);
    }

    public function test_admin_can_update_order_status(): void
    {
        $admin = User::factory()->admin()->create();
        $order = Order::factory()->for(User::factory()->create())->create(['status' => 'pending']);
        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/admin/orders/{$order->id}/status", [
            'status' => 'processing',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('processing', $order->fresh()->status);
    }

    public function test_non_admin_cannot_update_order_status(): void
    {
        $user  = User::factory()->create();
        $order = Order::factory()->for(User::factory()->create())->create();
        Sanctum::actingAs($user);

        $this->putJson("/api/admin/orders/{$order->id}/status", ['status' => 'shipped'])
            ->assertStatus(403);
    }

    public function test_admin_response_does_not_expose_user_password(): void
    {
        $admin = User::factory()->admin()->create();
        Order::factory()->for(User::factory()->create())->create();
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/dashboard');

        $responseBody = $response->content();
        $this->assertStringNotContainsString('"password"', $responseBody);
        $this->assertStringNotContainsString('"remember_token"', $responseBody);
    }
}
