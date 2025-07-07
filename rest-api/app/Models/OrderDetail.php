<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'OrderDetails';
    protected $primaryKey = 'OrderDetailID';
    public $timestamps = false;

    protected $fillable = [
        'OrderID',
        'VariantID',
        'Quantity',
        'Price',
    ];

    protected $casts = [
        'Price' => 'decimal:2',
        'Quantity' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'VariantID', 'VariantID');
    }


    public function product()
    {
        return $this->hasOneThrough(
            Product::class,
            ProductVariant::class,
            'VariantID',   // Foreign key on ProductVariant
            'ProductID',   // Foreign key on Product
            'VariantID',   // Local key on OrderDetail
            'ProductID'    // Local key on ProductVariant
        );
    }
}
