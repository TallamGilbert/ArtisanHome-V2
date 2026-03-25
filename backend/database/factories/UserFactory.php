<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'password'          => Hash::make('password'),
            'phone'             => null,
            'is_admin'          => false,
            'email_verified_at' => now(),
        ];
    }

    public function admin(): static
    {
        return $this->state(['is_admin' => true]);
    }

    public function unverified(): static
    {
        return $this->state(['email_verified_at' => null]);
    }
}
