<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;

class TripController extends Controller
{
    //

    public function add()
    {
        $attributes = request();

        Trip::create([
            'id_user' => $attributes['id_user'],
            'destination' => $attributes['destination'],
            'start_date' => $attributes['start_date'],
            'end_date' => $attributes['end_date'],
            'comment' => $attributes['comment']
        ]);
    }
}
