<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerEarning extends Model
{
    protected $table = 'SellerEarnings';
    protected $primaryKey = 'EarningID';
    public $timestamps = false;

    protected $fillable = [
        'SellerID',
        'OrderID',
        'Amount',
        'CommissionRate',
        'PayoutStatus',
        'EarnedAt',
    ];

    protected $casts = [
        'EarnedAt' => 'datetime',
        'Amount' => 'decimal:2',
        'CommissionRate' => 'decimal:2',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'SellerID');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID');
    }
}
