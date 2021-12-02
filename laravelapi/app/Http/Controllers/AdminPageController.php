<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminPageController extends Controller
{
    public function index()
    {
        $users = User::getAllUsers()->get();

        return response()->json([
            'all_users' => $users,
        ]);
    }
}
