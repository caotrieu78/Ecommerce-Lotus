<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSearch extends Model
{
    protected $table = 'ProductSearches';
    protected $primaryKey = 'SearchID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'SearchKeyword',
        'SearchedAt',
    ];

    protected $casts = [
        'SearchedAt' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID');
    }
}
