<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductView extends Model
{
    protected $table = 'ProductViews';
    protected $primaryKey = 'ViewID';
    public $timestamps = false;

    protected $fillable = [
        'ProductID',
        'UserID',
        'ViewedAt',
        'DurationSeconds',
    ];

    protected $casts = [
        'ViewedAt' => 'datetime',
        'DurationSeconds' => 'integer',
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
