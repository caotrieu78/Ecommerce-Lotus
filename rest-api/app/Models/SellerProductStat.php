<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerProductStat extends Model
{
    protected $table = 'SellerProductStats';
    protected $primaryKey = 'StatID';
    public $timestamps = false;

    protected $fillable = [
        'SellerID',
        'ProductID',
        'Views',
        'Sales',
        'LastSoldAt',
    ];

    protected $casts = [
        'LastSoldAt' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'SellerID');
    }
}
