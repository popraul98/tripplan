import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authorization, logout, selectTokens, selectUser} from "../../features/userSlice";
import AddIcon from '@mui/icons-material/Add';
import {Checkbox} from "@material-ui/core";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import React, {useEffect, useState} from "react";
import AddTrip from "./AddTrip";
import Login from "../auth/Login";
import {DELETE_TRIP, GET_TRIPS, LOGOUT, REFRESH_TOKEN} from "../../config/endpoints";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {CheckBox} from "@mui/icons-material";

const UserPage = () => {

    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";

    //message for expired session
    const [sentMessage, setSentMessage] = useState(false);

    //logOut & invalidate token after logout
    const handleLogOut = async (e) => {
        let recall = false
        if (tokens.access_token) {
            let token_access = (new_access_token ? new_access_token : tokens.access_token);
            const res = await axios.post(LOGOUT, {token_access}, {
                headers: {
                    Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                    refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
                }
            }).catch(function (error) {
                console.log(error)
            });
        }
        new_access_token = "";
        new_access_token = "";
        dispatch(logout());
        if (e == true) {
            navigate('/', {state: {message: "Your session expired!"}});
        } else {
            navigate('/');
        }
    };

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
                setSentMessage(true);
                handleLogOut(true);
                return 401
            }
        });
    }

//sort trips
    const options = [
        {value: 'trips_by_last_date', label: 'sort by Last Added'},
        {value: 'trips_by_name', label: 'sort by Name ASC'},
        {value: 'trips_by_start_date', label: 'sort by Start Date DESC'}
    ]

    const [typeSort, setTypeSort] = useState(options[0].value)
    const [trips, setTrips] = useState([])

    const handleSort = (e) => {
        setTypeSort(e.target.value)
        getTrips(e.target.value)
    }


    // get trips for user
    useEffect(() => {
        console.log("UseEffects")
        if (user != null)
            getTrips()
    }, [tokens])


    //get Trips from server
    const getTrips = async () => {
        let recall = false;
        await axios.get(GET_TRIPS, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(response => {
            console.log("Token Valabil")
            setTrips(response.data.user_trips.trips)
        }).catch(function (error) {
            console.log(error.response.status, 'error get trips')
            recall = true;
        });

        if (recall) {
            await requestNewRefreshToken(tokens.refresh_token)
        }
    }

    //delete Trip from Server
    const deleteTrip = async (id_trip) => {
        let recall = false;
        await axios.delete(DELETE_TRIP + id_trip, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(response => {
                console.log('Deleted')
                getTrips()
            }
        ).catch(function (error) {
            console.log(error.response)
            if (error.response.status === 401)
                recall = true;
        });
        if (recall) {
            await requestNewRefreshToken(tokens.refresh_token);
            deleteTrip()
        }
    }

    //Counter Days Left
    const counterDaysLeft = (date) => {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        date = new Date(date);
        let dateToday = new Date();
        const utc1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        const utc2 = Date.UTC(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate());
        // console.log(Math.floor(((utc1 - utc2) / _MS_PER_DAY) + 1))
        return Math.floor(((utc1 - utc2) / _MS_PER_DAY) + 1);
    }

    const [startDate, setStartDate] = useState(new Date());

    if (user != null)
        if (user.user.role.id === 3)
            return (
                <div className="flex justify-center bg-gray-900 min-h-screen pt-5">
                    <div className="w-2/3">

                        <div className="flex text-gray-400 justify-between">
                            <h1>Welcome
                                <span className="font-bold text-gray-300">  {user.user.name}</span>
                                . You are logged in as
                                <span className="font-bold text-gray-300"> {user.user.role.name_role}</span>
                            </h1>
                            <button
                                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                onClick={(e) => handleLogOut(e)}>
                                LogOut
                            </button>
                        </div>
                        <div className="flex justify-between mt-2">
                            <Link to="/trips/add-trip"
                                  className="bg-gray-600 hover:bg-gray-800 mb-2 text-white font-semibold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline">
                                <AddIcon/>
                                Add Trip
                            </Link>

                        </div>
                        <div className="flex justify-center">
                            <div className="mr-2 min-w-1/2">
                                <div className="bg-gray-700 p-2 py-4 rounded">
                                    <h2 className="text-gray-300 mb-2 font-semibold text-center">Filter</h2>
                                    <input
                                        placeholder="Search bar"
                                        className="rounded py-1 px-2 bg-gray-600"
                                    />

                                    <p className="mt-4 text-gray-400">Start Date</p>
                                    <DatePicker
                                        className="rounded py-1 px-2 bg-gray-600 text-gray-200"
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}/>

                                    <p className="mt-4 text-gray-400">End Date</p>
                                    <DatePicker
                                        className="rounded py-1 px-2 bg-gray-600 text-gray-200"
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}/>

                                    <div className="flex mt-2">
                                        <p className="mt-2 text-gray-400">Trips coming soon</p>
                                        <Checkbox
                                            style={{
                                                color: "#1D4ED8",
                                            }}
                                            // checked={checked}
                                            // onChange={handleChange}
                                            // inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </div>
                                    <div className="flex">
                                        <p className="mt-2 text-gray-400">Trips ended</p>
                                        <Checkbox
                                            style={{
                                                color: "#1D4ED8",
                                            }}
                                            // checked={checked}
                                            // onChange={handleChange}
                                            // inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </div>

                                    <select className="pl-1 rounded py-1 bg-gray-600 text-gray-300"
                                            onChange={(e) => handleSort(e)}
                                    >
                                        <option disabled>Sort by:</option>
                                        {options.map((option) => (
                                            <option value={option.value}>{option.label}</option>
                                        ))}
                                    </select>

                                    <div className="flex justify-between mt-8">
                                        <button
                                            className="bg-blue-700 text-sm hover:bg-blue-800 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Apply filter
                                        </button>
                                        <button
                                            className="bg-gray-800 text-sm hover:bg-gray-900 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Reset
                                        </button>
                                    </div>

                                </div>
                            </div>
                            <table className=" divide-y divide-gray-900 shadow mb-5">
                                <thead className="bg-gray-700">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Destination
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase  ">
                                        Comment
                                    </th>
                                    <th scope="col" className=" px-6 py-3">
                                        <span
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-900">
                                {trips.length > 0 ? trips.map((trip) => (
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-gray-300 overflow-hidden truncate w-72">
                                                {trip.destination} <span
                                                className="font-light text-sm text-gray-500">
                                                {counterDaysLeft(trip.start_date) > 0 ? "( " + counterDaysLeft(trip.start_date) + " days left )" : ""}</span>
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{trip.start_date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {trip.end_date}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-300">
                                            <p className="overflow-hidden truncate w-72 ">{trip.comment}</p>
                                        </td>
                                        <td className="pr-10 py-4 whitespace-nowrap flex justify-between text-sm font-medium">

                                            <Link to={'/trips/' + trip.id}
                                                  className="font-semibold mb-1 mr-2 text-gray-600 hover:text-gray-300">
                                                Details
                                            </Link>

                                            <Link to={trip.id + '/edit-trip'}
                                                  className="font-semibold mb-1 mr-2 text-gray-600 hover:text-gray-300">
                                                Edit
                                            </Link>
                                            <DeleteIcon
                                                className="text-gray-600 hover:text-gray-300 cursor-pointer"
                                                onClick={() => deleteTrip(trip.id)}
                                            />
                                        </td>
                                    </tr>
                                )) : null}
                                </tbody>
                                {trips.length === 0 ?
                                    <span
                                        className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex justify-between text-gray-300">
                                    You don't have any records
                                </span> : ""}
                            </table>
                        </div>
                    </div>
                </div>
            )
        else return (
            <Login/>
        )
    else return (
        <Login/>
    )
}

export default UserPage;