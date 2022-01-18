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
    public function index(User $user, Request $req)
    {
        $user = Auth::user();
        $filter_start_date = $req->input('filterStartDate');
        $filter_end_date = $req->input('filterEndDate');
        $filter_by_date = null;

        if ($filter_start_date > '2000-01-01') {
            if ($filter_end_date > '2000-01-01')
                $filter_by_date = Trip::byUser($user->id)->whereBetween('start_date', [$filter_start_date, $filter_end_date])->Paginate(4);

            else
                $filter_by_date = Trip::byUser($user->id)->where('start_date', '>', $filter_start_date)->Paginate(4);
        } else if ($filter_end_date > '2000-01-01')
            $filter_by_date = Trip::byUser($user->id)->where('start_date', '<', $filter_end_date)->Paginate(4);


        return response()->json([
            'trips_pag' => Trip::byUser($user->id)->Paginate(4),
            'trips_coming_soon' => Trip::byUser($user->id)->where('start_date', '>', Carbon::today())->Paginate(4),
            'trips_ended' => Trip::byUser($user->id)->where('end_date', '<', Carbon::today())->Paginate(4),

            'filter_by_date' => $filter_by_date,

            'trips_sort_by_name' => Trip::byUser($user->id)->orderBy('destination', 'ASC')->Paginate(4),
            'trips_sort_by_start_date' => Trip::byUser($user->id)->orderBy('start_date', 'DESC')->Paginate(4),
            'trips_sort_by_last_added' => Trip::byUser($user->id)->orderBy('created_at', 'ASC')->Paginate(4),

            'user_trips' => new UserResource($user),

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
