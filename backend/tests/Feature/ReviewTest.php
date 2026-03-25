<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    public function test_user_can_post_review(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson("/api/products/{$product->id}/reviews", [
            'rating'  => 5,
            'comment' => 'Absolutely stunning piece.',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['rating' => 5]);

        $this->assertDatabaseHas('reviews', [
            'product_id' => $product->id,
            'user_id'    => $user->id,
            'rating'     => 5,
        ]);
    }

    public function test_user_cannot_post_duplicate_review(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson("/api/products/{$product->id}/reviews", [
            'rating'  => 5,
            'comment' => 'First review.',
        ]);

        $response = $this->postJson("/api/products/{$product->id}/reviews", [
            'rating'  => 3,
            'comment' => 'Second review attempt.',
        ]);

        $response->assertStatus(422);
        $this->assertCount(1, $product->fresh()->reviews);
    }

    public function test_review_updates_product_rating_and_count(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create(['rating' => 0.0, 'reviews_count' => 0]);
        Sanctum::actingAs($user);

        $this->postJson("/api/products/{$product->id}/reviews", [
            'rating'  => 4,
            'comment' => 'Great quality.',
        ]);

        $product->refresh();
        $this->assertEquals(4.0, $product->rating);
        $this->assertEquals(1, $product->reviews_count);
    }

    public function test_deleting_review_updates_product_rating_and_count(): void
    {
        $admin   = User::factory()->admin()->create();
        $user    = User::factory()->create();
        $product = Product::factory()->create(['rating' => 0.0, 'reviews_count' => 0]);
        Sanctum::actingAs($user);

        $this->postJson("/api/products/{$product->id}/reviews", [
            'rating'  => 5,
            'comment' => 'Amazing.',
        ]);

        $review = $product->fresh()->reviews->first();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/admin/reviews/{$review->id}")->assertStatus(200);

        $product->refresh();
        $this->assertEquals(0.0, $product->rating);
        $this->assertEquals(0, $product->reviews_count);
    }

    public function test_unauthenticated_user_cannot_post_review(): void
    {
        $product = Product::factory()->create();

        $this->postJson("/api/products/{$product->id}/reviews", [
            'rating'  => 5,
            'comment' => 'Great.',
        ])->assertStatus(401);
    }
}
