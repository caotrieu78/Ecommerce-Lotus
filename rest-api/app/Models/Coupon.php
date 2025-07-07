<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $table = 'Coupons';
    protected $primaryKey = 'CouponID';
    public $timestamps = false;

    protected $fillable = [
        'Code',
        'DiscountType',
        'DiscountValue',
        'ExpirationDate',
        'MinOrderValue',
        'IsActive',
    ];

    protected $casts = [
        'DiscountValue' => 'decimal:2',
        'MinOrderValue' => 'decimal:2',
        'ExpirationDate' => 'datetime',
        'IsActive' => 'boolean',
    ];
}
