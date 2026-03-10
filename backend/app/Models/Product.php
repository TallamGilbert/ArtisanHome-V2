<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'original_price',
        'category_id', 'material', 'dimensions', 'weight', 'finish',
        'stock', 'colors', 'rating', 'reviews_count',
        'is_featured', 'is_best_seller', 'is_active',
    ];

    protected $casts = [
        'price'          => 'decimal:2',
        'original_price' => 'decimal:2',
        'colors'         => 'array',
        'is_featured'    => 'boolean',
        'is_best_seller' => 'boolean',
        'is_active'      => 'boolean',
        'rating'         => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
