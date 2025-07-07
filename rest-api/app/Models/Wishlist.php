<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $table = 'Wishlist';
    protected $primaryKey = 'WishlistID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'ProductID',
        'CreatedAt',
    ];

    protected $casts = [
        'CreatedAt' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID');
    }
}
