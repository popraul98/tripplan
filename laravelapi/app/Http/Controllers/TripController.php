<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddTripRequest;
use App\Http\Requests\EditTripRequest;
use App\Http\Requests\TripRequest;
use App\Http\Resources\TripResource;
use App\Http\Resources\UserResource;
use App\Models\Trip;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TripController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(User $user)
    {
        $user = Auth::user();

        $today_date = Carbon::today();

        return response()->json([
            'trips_pag' => Trip::byUser($user->id)->Paginate(2),
            'trips_coming_soon' => Trip::byUser($user->id)->where('start_date', '>', $today_date)->Paginate(2),
            'trips_ended' => Trip::byUser($user->id)->where('end_date', '<', $today_date)->Paginate(2),
            'user_trips' => new UserResource($user),

        ]);

//        $id_user = $user->id;

//        $trips_by_last_date = Trip::byUser($id_user)->orderBy('created_at', 'ASC')->get();
//        $trips_by_name = Trip::byUser($id_user)->orderBy('destination', 'ASC')->get();
//        $trips_by_start_date = Trip::byUser($id_user)->orderBy('start_date', 'ASC')->get();

//        return response()->json([
//            'trips_by_last_date' => $trips_by_last_date,
//            'trips_by_name' => $trips_by_name,
//            'trips_by_start_date' => $trips_by_start_date,
//        ]);
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
    public function store(AddTripRequest $req)
    {
        $user = Auth::user();
        $id_user = $user->id;

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
     * @param int $id_trip
     * @return \Illuminate\Http\Response
     */
    public function show(TripRequest $request, Trip $trip)
    {
        return new TripResource($trip);
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
     * @param \Illuminate\Http\Request $trip
     * @param int $trip
     * @return \Illuminate\Http\Response
     */
    public function update(EditTripRequest $request)
    {
        try {
            Trip::find($request->id)
                ->update([
                    'destination' => $request->destination,
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'comment' => $request->comment
                ]);
        } catch (\Exception $e) {
            echo 'Message: ' . $e->getMessage();
        }
        return response()->json([
            'feedback' => true,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id_trip
     * @return \Illuminate\Http\Response
     */
    public function destroy(TripRequest $request, Trip $trip)
    {
        $trip->delete();

        return "Deleted";
    }
}
