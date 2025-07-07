<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    protected $table = 'Shipping';
    protected $primaryKey = 'ShippingID';
    public $timestamps = false;

    protected $fillable = [
        'OrderID',
        'RecipientName',
        'Phone',
        'Address',
        'City',
        'ShippingStatus',
        'ShippedAt',
        'DeliveredAt',
    ];

    protected $casts = [
        'ShippedAt' => 'datetime',
        'DeliveredAt' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }
}
