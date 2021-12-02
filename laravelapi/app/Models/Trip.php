<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'destination',
        'start_date',
        'end_date',
        'comment'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');

    }

    public function scopeByUser($query, $id_user)
    {
        return $query->where('id_user',$id_user);
    }

}
