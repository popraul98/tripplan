import React, {useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {authorization, selectTokens, selectUser} from "../../features/userSlice";
import {Link, useNavigate} from 'react-router-dom';
import DatePicker from 'react-date-picker';
import ButtonHome from "./ButtonHome";
import {ADD_TRIP, REFRESH_TOKEN} from "../../config/endpoints";

export default function AddTrip({}) {

    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";
    const [addedSuccessfully, setAddedSuccessfully] = useState(false)

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }

    const [trip, setTrip] = useState({
        id_user: user.user.id,
        destination: "",
        start_date: formatDate(new Date()),
        end_date: formatDate(new Date()),
        comment: "",
    })

    const onSubmit = (e) => {
        e.preventDefault()
        addTrip(trip)
    }

    const onInputChange = e => {
        setTrip({...trip, [e.target.name]: e.target.value});
        setAddedSuccessfully(false);
    };


    const addTrip = async (trip) => {
        let recall = false;
        await axios.post(ADD_TRIP, trip, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(response => {
            // console.log(trip.id_user)
            setTrip({
                id_user: user.user.id,
                destination: "",
                start_date: formatDate(new Date()),
                end_date: formatDate(new Date()),
                comment: ""
            })
            setAddedSuccessfully(true)
        }).catch(function (error) {
                if (error.response.status === 401) {
                    recall = true;
                }
            }
        );

        if (recall)
            if (await requestNewRefreshToken(tokens.refresh_token) !== 401)
                await addTrip(trip)
    }

    //Refresh token if needed
    const requestNewRefreshToken = async (refresh_token) => {
        return await axios.get(REFRESH_TOKEN, {
            headers: {
                refresh_token: refresh_token
            }
        }).then(function (response) {
                //if we have a new refresh token
                if (response.data.value === true) {
                    dispatch(authorization({
                        access_token: response.data.tokens.access_token,
                        refresh_token: response.data.tokens.refresh_token,
                    }));
                    console.log('Tokens was refreshed!')
                    new_access_token = response.data.tokens.access_token;
                    new_refresh_token = response.data.tokens.refresh_token
                }
            }
        ).catch(function (error) {
            console.log(error.response.status, "refresh token expired error")
            if (error.response.status === 401) {
                console.log('You gonna be logout')
                navigate('/', {state: {message: "Your session expired!"}});
                return 401
            }
        });
    }

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-80 transform transition-transform duration-30">
            <div className="bg-gray-100 shadow rounded-xl w-1/2  p-6">
                <div className="font-semibold text-gray-700 text-lg mb-2 underline">
                    Add your Trip:
                </div>
                <div className="font-bold mb-2 text-green-500">
                    {addedSuccessfully ? "Trip added successfully" : ""}
                </div>
                <form onSubmit={onSubmit}>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Destination</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Destination"
                        value={trip.destination}
                        name="destination"
                        onChange={(e) => onInputChange(e)}

                    />

                    <label className="block text-gray-700 text-sm font-semibold mb-1">Start Date <span
                        className="text-sm text-gray-600 font-light">(year-month-day)</span></label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Start Date"
                        name="start_date"
                        value={trip.start_date}
                        onChange={(e) => onInputChange(e)}
                    />

                    <label className="block text-gray-700 text-sm font-semibold mb-1">End Date <span
                        className="text-sm text-gray-600 font-light">(year-month-day)</span></label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="End Date"
                        name="end_date"
                        value={trip.end_date}
                        onChange={(e) => onInputChange(e)}
                    />

                    <label className="block text-gray-700 text-sm font-semibold mb-1">Comment</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Write your comment here..."
                        name="comment"
                        value={trip.comment}
                        onChange={(e) => onInputChange(e)}
                    />

                    <button className=" bg-gray-700 rounded-xl hover:bg-gray-600 border px-2 text-white">
                        Add trip
                    </button>
                </form>

                <div className="mt-4 float-right">
                    <ButtonHome/>
                </div>

            </div>
        </div>
    )
}