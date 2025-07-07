<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecommendationLog extends Model
{
    protected $table = 'RecommendationLogs';
    protected $primaryKey = 'RecID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'ProductID',
        'RecommendedAt',
        'WasClicked',
    ];

    protected $casts = [
        'RecommendedAt' => 'datetime',
        'WasClicked' => 'boolean',
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
