<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        return [
            'name'           => ucfirst($name),
            'slug'           => Str::slug($name) . '-' . fake()->randomNumber(4),
            'description'    => fake()->paragraph(),
            'price'          => fake()->randomFloat(2, 100, 5000),
            'original_price' => null,
            'category_id'    => Category::factory(),
            'stock'          => 10,
            'colors'         => [],
            'rating'         => 0,
            'reviews_count'  => 0,
            'is_featured'    => false,
            'is_best_seller' => false,
            'is_active'      => true,
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(['stock' => 0]);
    }
}
