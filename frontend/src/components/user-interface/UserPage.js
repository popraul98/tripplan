import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authorization, logout, selectTokens, selectUser} from "../../features/userSlice";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import React, {useEffect, useState} from "react";
import AddTrip from "./AddTrip";
import Login from "../auth/Login";


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
            const res = await axios.post("http://127.0.0.1:8000/api/logout", {token_access}, {
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
        return await axios.get("http://127.0.0.1:8000/api/refresh_token", {
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
    const getTrips = async (sort_type) => {
        let recall = false;
        let user_id = user.user.id
        await axios.post("http://127.0.0.1:8000/api/get-trips/", {user_id}, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(response => {
            console.log("Token Valabil")
            let data = response.data

            if (!sort_type) {
                // console.log(data.trips_by_last_date, "1")
                setTrips(data.trips_by_last_date)
            }
            if (sort_type === "trips_by_last_date") {
                // console.log(data.trips_by_last_date, "1")
                setTrips(data.trips_by_last_date)
            }
            if (sort_type === "trips_by_name") {
                // console.log(data.trips_by_name, "2")
                setTrips(data.trips_by_name)
            }
            if (sort_type === "trips_by_start_date") {
                // console.log(data.trips_by_start_date, "3")
                setTrips(data.trips_by_start_date)
            }
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
        await axios.delete("http://localhost:8000/api/delete-trip/" + id_trip, {
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

    if (user != null)
        return (
            <div className="flex justify-center bg-gradient-to-l bg-gray-900 via-indigo-100 to-gray-100 h-screen pt-5">
                <div className="w-2/3">
                    <div className="flex text-gray-300 justify-between">
                        <h1>Welcome <span className="font-bold">{user.user.name}</span>. You are login as an
                            <span className="font-bold"> {user.user.role.name_role}</span>
                        </h1>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={(e) => handleLogOut(e)}
                        >
                            LogOut
                        </button>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between">
                            <Link to="/user/add-trip"
                                  className="bg-gray-600 hover:bg-gray-800 mb-2 text-white font-semibold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline">
                                <AddIcon/>
                                Add Trip
                            </Link>
                            <select className="pl-2 mb-2 rounded-lg  bg-gray-600 text-gray-300"
                                    onChange={(e) => handleSort(e)}
                            >
                                <option disabled>Sort by:</option>
                                {options.map((option) => (
                                    <option value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>


                        <table className=" divide-y divide-gray-900 shadow">
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
                                        <p className="text-sm font-medium text-gray-300">
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
                                        <button
                                            className="font-semibold mb-1 mr-2 text-gray-600 hover:text-gray-300">
                                            <Link to={'/user/' + trip.id}>
                                                Details
                                            </Link>
                                        </button>

                                        <a href="#"
                                           className="text-gray-600 hover:text-gray-300 mr-1">Edit</a>
                                        <DeleteIcon
                                            className="text-gray-600 hover:text-gray-300 cursor-pointer"
                                            onClick={() => deleteTrip(trip.id)}
                                        />
                                    </td>
                                </tr>
                            )) : null}
                            </tbody>
                            {trips.length === 0 ?
                                <span className=" p-4 bg-gray-900 flex flex justify-between text-gray-300">
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
}

export default UserPage;