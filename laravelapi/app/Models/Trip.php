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

    //get trips for specific USER
    public function scopeGetTripsSortByLastAdded($query, $id_user)
    {
        return $query->where('id_user', $id_user);
    }

    public function scopeGetTripsSortByNameDestination($query, $id_user)
    {
        return $query->where('id_user', $id_user)->orderBy('destination', "ASC");
    }

    public function scopeGetTripsSortByStartDate($query, $id_user)
    {
        return $query->where('id_user', $id_user)->orderBy('start_date', "DESC");
    }

}
