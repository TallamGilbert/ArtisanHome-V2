<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_number', 'total', 'status',
        'shipping_name', 'shipping_email', 'shipping_address',
        'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country',
        'payment_method', 'payment_status', 'notes',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }
}
