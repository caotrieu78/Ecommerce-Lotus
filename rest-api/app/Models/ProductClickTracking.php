<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductClickTracking extends Model
{
    protected $table = 'ProductClickTracking';
    protected $primaryKey = 'ClickID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'ProductID',
        'SourcePage',
        'ClickedAt',
    ];

    protected $casts = [
        'ClickedAt' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID');
    }
}
