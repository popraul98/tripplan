<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TripController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {
        //required id user
        $id_user = $req->input('user_id');


        $trips_by_last_date = Trip::byUser($id_user)->orderBy('created_at', 'DESC')->get();
        $trips_by_name = Trip::byUser($id_user)->orderBy('destination', 'ASC')->get();
        $trips_by_start_date = Trip::byUser($id_user)->orderBy('start_date', 'ASC')->get();

        return response()->json([
            'trips_by_last_date' => $trips_by_last_date,
            'trips_by_name' => $trips_by_name,
            'trips_by_start_date' => $trips_by_start_date,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request0
     * 11111     * @return \Illuminate\Http\Response
     */
    public function store(Request $req)
    {
        $id_user = $req->input("id_user");
        $destination = $req->input("destination");
        $start_date = $req->input("start_date");
        $end_date = $req->input("end_date");
        $comment = $req->input("comment");


        DB::table('trips')->insert([
            'id_user' => $id_user,
            'destination' => $destination,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'comment' => $comment,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $trip = Trip::find($id);
        $trip->delete();

        return "Deleted";
    }
}
