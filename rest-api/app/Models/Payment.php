<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'Payments';
    protected $primaryKey = 'PaymentID';
    public $timestamps = false;

    protected $fillable = [
        'OrderID',
        'PaymentMethod',
        'PaymentStatus',
        'PaidAt',
    ];

    protected $casts = [
        'PaidAt' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID');
    }
}
