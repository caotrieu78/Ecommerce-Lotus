<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivityLog extends Model
{
    protected $table = 'UserActivityLog';
    protected $primaryKey = 'ActivityID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'ActionType',
        'ReferenceID',
        'Metadata',
        'CreatedAt',
    ];

    protected $casts = [
        'Metadata' => 'array',
        'CreatedAt' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID');
    }
}
