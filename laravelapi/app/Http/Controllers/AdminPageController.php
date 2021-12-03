<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DateTimeInterface;

class AdminPageController extends Controller
{
    public function index()
    {
        $users = User::getAllUsers()->get();

        foreach ($users as $user) {
            User::serializeDate($user->created_at);
        }

        return response()->json([
            'all_users' => $users,
        ]);
    }

    //delete user and all his trips
    public function deleteUser($id)
    {
        $user_trips = User::find($id)->trips;
        foreach ($user_trips as $trip) {
            Trip::find($trip->id)->delete();
        }
        User::find($id)->delete();
    }
}
