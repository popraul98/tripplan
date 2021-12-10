import {Link, Navigate, Route, Routes} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login, logout, selectUser, authorization, selectTokens} from "../features/userSlice";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import React, {useState, useEffect, ComponentLifecycle} from "react";
import AddTripModal from "./AddTripModal";
import DetailsDestination from "./DetailsDestination";
import Select from "react-select";
import Login from "./auth/Login";


const Home = () => {

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

    //Check token for user and receive User with Trips (also refresh token)
    // const checkToken = async () => {
    //     new_access_token = "";
    //     new_access_token = "";
    //     if (tokens.access_token != null) {
    //         const need_refresh_token = await axios.get("http://127.0.0.1:8000/api/get-user", {
    //             headers: {
    //                 Authorization: "Bearer " + tokens.access_token,
    //                 refresh_token: tokens.refresh_token,
    //             }
    //         }).then(function (response) {
    //             if (response.status === 200 || response.status === 201) {
    //                 console.log("Token Valabil")
    //                 return false
    //             }
    //         }).catch(function (error) {
    //             console.log(error.response.status, '=access_token')
    //             if (error.response.status === 401) {
    //                 return true;
    //             }
    //         });
    //         if (need_refresh_token === true) {
    //             return await requestNewRefreshToken(tokens.refresh_token);
    //         }
    //     } else {
    //         console.log('You gonna be logout, Token doesn\'t exist')
    //         setSentMessage(true);
    //         handleLogOut(true);
    //     }
    // }

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


    const [trips, setTrips] = useState([])

    const getTrips = async (sort_type) => {
        const tripsFromServer = await fetchTrips(sort_type)
        setTrips(tripsFromServer)
    }

    //get Trips from server
    const fetchTrips = async (sort_type) => {

        let user_id = user.user.id
        const res = await axios.post("http://127.0.0.1:8000/api/get-trips/", {user_id})
        const data = await res.data


        if (!sort_type) {
            // console.log(data.trips_by_last_date, "1")
            return data.trips_by_last_date
        }


        if (sort_type === "trips_by_last_date") {
            // console.log(data.trips_by_last_date, "1")
            return data.trips_by_last_date
        }


        if (sort_type === "trips_by_name") {
            // console.log(data.trips_by_name, "2")
            return data.trips_by_name
        }


        if (sort_type === "trips_by_start_date") {
            // console.log(data.trips_by_start_date, "3")
            return data.trips_by_start_date
        }
        return data
    }

//delete Trip from Server
    const deleteTrip = async (id_trip) => {
        await axios.delete("http://localhost:8000/api/delete-trip/" + id_trip)
            .then(response => {
                    console.log('Deleted')
                    getTrips()
                }
            )
    }


//Modal Add Trip
    const [modalAddTripOpen, setModalAddTripOpen] = useState(false)

    const handleCloseAddTripModal = () => {
        setModalAddTripOpen(false)
        getTrips();
    }

//Modal Details Destination
    const [modalDetailsDest, setModalDetailsDest] = useState(false)

    const handleCloseDetailsDest = () => {
        setModalDetailsDest(false)
    }

    const [tripModalDetailsDest, setTripModalDetailsDest] = useState(null)

    const handleOnClick = (id_trip) => {
        for (let i = 0; i < trips.length; i++) {
            if (trips[i].id == id_trip) {
                setTripModalDetailsDest(trips[i]);
                break;
            }
        }
        setModalDetailsDest(true);
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
            <div className="content-center bg-gray-100 p-2">
                <h1>Welcome <span className="font-bold">{user.user.name}</span>.
                    You are login as an <span className="font-bold">{user.user.role.name_role}</span></h1>
                <div className="p-5">

                    {/*---MODALS---*/}
                    <AddTripModal open={modalAddTripOpen} onClose={handleCloseAddTripModal}>
                        Add a new Trip
                    </AddTripModal>

                    <DetailsDestination
                        open={modalDetailsDest}
                        trip={tripModalDetailsDest}
                        onClose={handleCloseDetailsDest}
                    >
                        Details
                    </DetailsDestination>

                    <div className="flex justify-between">
                        <button
                            className="bg-gray-400 hover:bg-gray-600 mb-2 text-white font-semibold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline"
                            onClick={() => setModalAddTripOpen(true)}
                        >
                            <AddIcon/>Add a new Trips
                        </button>

                        <select className="border border-gray-300 pl-3 mb-2 rounded-xl text-gray-700"
                            // value={typeSort}
                                onChange={(e) => handleSort(e)}
                        >
                            <option disabled>Sort by:</option>
                            {options.map((option) => (
                                <option value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="-my-2 overflow-x-hidden sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 ">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Destination
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Date
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                                            Comment
                                        </th>
                                        <th scope="col" className=" px-6 py-3">
                                        <span
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Actions</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {trips.length > 0 ? trips.map((trip) => (
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {trip.destination} <span
                                                    className="font-light text-xs text-gray-600">
                                                {counterDaysLeft(trip.start_date) > 0 ? "( " + counterDaysLeft(trip.start_date) + " days left )" : ""}</span>
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{trip.start_date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {trip.end_date}
                                     </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <p className="truncate w-1/2">{trip.comment}</p>
                                            </td>
                                            <td className="pr-10 py-4 whitespace-nowrap flex justify-between text-sm font-medium">
                                                <button
                                                    className="font-semibold mb-1 mr-2 text-indigo-600 hover:text-indigo-900"
                                                    onClick={() => handleOnClick(trip.id)}
                                                >
                                                    Details
                                                </button>
                                                <a href="#"
                                                   className="text-indigo-600 hover:text-indigo-900 mr-1">Edit</a>
                                                <DeleteIcon
                                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                    onClick={() => deleteTrip(trip.id)}
                                                />
                                            </td>
                                        </tr>
                                    )) : null}
                                    </tbody>
                                    {trips.length === 0 ?
                                        <span className=" p-4 bg-gray-100 flex flex justify-between text-gray-500">You
                                            don't
                                            have any records</span> : ""}

                                </table>

                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={(e) => handleLogOut(e)}
                >
                    LogOut
                </button>

            </div>
        )
    else return (
        <Login/>
    )
}

export default Home;