<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'order_number'     => 'AH-' . strtoupper(Str::random(8)),
            'total'            => fake()->randomFloat(2, 100, 5000),
            'status'           => 'pending',
            'payment_status'   => 'pending',
            'payment_method'   => 'stripe',
            'shipping_name'    => fake()->name(),
            'shipping_email'   => fake()->safeEmail(),
            'shipping_address' => fake()->streetAddress(),
            'shipping_city'    => fake()->city(),
            'shipping_state'   => fake()->state(),
            'shipping_zip'     => fake()->postcode(),
            'shipping_country' => 'US',
        ];
    }
}
