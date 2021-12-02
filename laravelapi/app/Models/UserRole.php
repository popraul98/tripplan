<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'role_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');

    }
}
