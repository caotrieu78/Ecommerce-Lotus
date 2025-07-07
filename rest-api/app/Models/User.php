<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasUuids;

    protected $table = 'Users';
    protected $primaryKey = 'UserID';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'Username',
        'Password',
        'Email',
        'FullName',
        'Avatar',
        'RoleID',
        'IsActive',
        'remember_token',
    ];

    protected $hidden = [
        'Password',
        'remember_token',
    ];

    protected $casts = [
        'IsActive' => 'boolean',
        'CreatedAt' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'RoleID');
    }

    public function sellerInfo()
    {
        return $this->hasOne(SellerInfo::class, 'SellerID', 'UserID');
    }
}
