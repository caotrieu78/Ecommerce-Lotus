<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    protected $table = 'ProductReview';
    protected $primaryKey = 'ReviewID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'ProductID',
        'Rating',
        'Comment',
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
