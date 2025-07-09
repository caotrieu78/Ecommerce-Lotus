<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'Product';
    protected $primaryKey = 'ProductID';
    public $timestamps = false;

    protected $fillable = [
        'ProductName',
        'Description',
        'Gender',
        'CategoryID',
        'ThumbnailURL',
        'Price',
        'StockQuantity',
        'SellerID',
        'Status',
    ];


    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'CategoryID');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'SellerID');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'ProductID');
    }
}