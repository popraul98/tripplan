<?php

namespace App\Http\Requests;

use App\Models\Trip;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class EditTripRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if (Auth::check()) {
            $user = Auth::user();
            $trip = Trip::find($this->id);
            if ($user->id == $trip->id_user)
                return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'required',
            'destination' => 'required',
            'start_date' => 'date | required',
            'end_date' => 'date | required',
            'comment' => 'string',
        ];
    }
}
