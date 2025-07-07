<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerInfo extends Model
{
    protected $table = 'SellerInfo';
    protected $primaryKey = 'SellerID';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'SellerID',
        'StoreName',
        'Description',
        'LogoURL',
        'Address',
        'Phone',
        'Email',
        'CreatedAt',
    ];

    protected $casts = [
        'CreatedAt' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'SellerID');
    }
}
