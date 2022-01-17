import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authorization, logout, selectTokens, selectUser} from "../../features/userSlice";
import AddIcon from '@mui/icons-material/Add';
import {Checkbox} from "@material-ui/core";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import React, {useEffect, useState} from "react";
import Login from "../auth/Login";
import {DELETE_TRIP, GET_TRIPS, LOGOUT, REFRESH_TOKEN} from "../../config/endpoints";
import DatePicker from "react-datepicker";
import {Pagination} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";

const UserPage = () => {

    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";

    const [trips, setTrips] = useState([])
    const [copyTrips, setCopyTrips] = useState([]);
    const [searchBar, setSearchBar] = useState("");
    const [errorFilterDate, setErrorFilterDate] = useState(false);
    const [eventFilter, setEventFilter] = useState("");

    //Paginate
    const [paginate, setPaginate] = useState({
        total_pages: 0,
        current_page: 0,
    })


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
                handleLogOut(true);
                return 401
            }
        });
    }

    // get trips for user
    useEffect(() => {
        console.log("UseEffects")
        if (user != null)
            getTrips(1)
    }, [tokens, eventFilter])


    //get Trips from server
    const getTrips = async (page) => {
        let recall = false;
        await axios.get(GET_TRIPS + '?page=' + page, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(response => {
                console.log("Token Valabil")

                console.log(eventFilter, 'eventFilter')
                console.log(response.data)

                switch (eventFilter) {
                    case 'coming_soon':
                        setTrips(response.data.trips_coming_soon.data)
                        setCopyTrips(response.data.trips_coming_soon.data)
                        setPaginate({
                            total_pages: response.data.trips_coming_soon.last_page,
                        })
                        break;
                    case 'ended':
                        setTrips(response.data.trips_ended.data)
                        setCopyTrips(response.data.trips_ended.data)
                        setPaginate({
                            total_pages: response.data.trips_ended.last_page,
                        })
                        break;
                    default:
                        setTrips(response.data.trips_pag.data)
                        setCopyTrips(response.data.trips_pag.data)
                        setPaginate({
                            total_pages: response.data.trips_pag.last_page,
                        })
                        setEventFilter('');
                }

            }
        ).catch(function (error) {
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

//sort trips
    const options = [
        {value: 'sort_by_last_date', label: 'Last Added'},
        {value: 'sort_by_name', label: 'Name (asc)'},
        {value: 'sort_by_start_date', label: 'Start Date (desc)'}
    ]

    const handleSort = (e) => {
        setTypeSort(e.target.value)

        if (e.target.value === "sort_by_last_date") {
            trips.sort(function (a, b) {
                let da = new Date(a.created_at).getTime();
                let db = new Date(b.created_at).getTime();
                return da > db ? 1 : da < db ? -1 : 0
            });
        }
        if (e.target.value === "sort_by_name") {
            trips.sort(function (a, b) {
                if (a.destination.toLowerCase() < b.destination.toLowerCase()) {
                    return -1;
                }
                if (a.destination.toLowerCase() > b.destination.toLowerCase()) {
                    return 1;
                }
                return 0;
            })

        }
        if (e.target.value === "sort_by_start_date") {
            trips.sort(function (a, b) {
                let da = new Date(a.start_date).getTime();
                let db = new Date(b.start_date).getTime();
                return da > db ? -1 : da < db ? 1 : 0
            });
        }

    }
    const [typeSort, setTypeSort] = useState(options[0].value)

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

// search trips
    const searchTrips = (searched_item) => {
        setSearchBar(searched_item)
        const new_trips = [];
        setTrips([]);
        for (let i = 0; i < copyTrips.length; i++) {
            if (copyTrips[i].destination.toLowerCase().indexOf(searched_item.toLowerCase()) >= 0) {
                new_trips.push(copyTrips[i]);
            }
            setTrips(new_trips);
        }
    }

//filter Trips coming soon
    const [checkedTripsComingSoon, setCheckedTripsComingSoon] = useState(false);
    const handleChangeCheckedTripsComingSoon = () => {
        if (checkedTripsComingSoon) {
            setCheckedTripsComingSoon(false);
            setEventFilter('');
        } else {
            setCheckedTripsComingSoon(true)
            if (checkedTripsEnded) {
                setCheckedTripsEnded(false);
            }
            setEventFilter('coming_soon');
        }
    }

//filter Trips ended
    const [checkedTripsEnded, setCheckedTripsEnded] = useState(false);
    const handleChangeCheckedTripsEnded = () => {
        if (checkedTripsEnded) {
            setCheckedTripsEnded(false);
            setEventFilter('');
        } else {
            setCheckedTripsEnded(true)
            if (checkedTripsComingSoon) {
                setCheckedTripsComingSoon(false);
            }
            setEventFilter('ended');
            // const new_trips = [];
            // for (let i = 0; i < copyTrips.length; i++) {
            //     if (counterDaysLeft(copyTrips[i].end_date) < 0)
            //         new_trips.push(copyTrips[i]);
            // }
            // setTrips(new_trips);
        }
    }

//filter by date
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);

    const filterByDates = () => {
        const new_trips = [];
        setErrorFilterDate(false);

        if (!filterStartDate && !filterEndDate)
            setErrorFilterDate(true);

        if (filterStartDate) {
            let firstDate = formatDate(filterStartDate)
            if (filterEndDate) {
                let secondDate = formatDate(filterEndDate)

                if (firstDate > secondDate) {
                    setErrorFilterDate(true)
                }

                for (let i = 0; i < trips.length; i++) {
                    if (trips[i].start_date > firstDate && trips[i].start_date < secondDate)
                        new_trips.push(trips[i]);
                }
            }
            if (!filterEndDate) {
                for (let i = 0; i < trips.length; i++) {
                    if (trips[i].start_date > firstDate)
                        new_trips.push(trips[i]);
                }
            }
            setTrips(new_trips);
        }
        if (!filterStartDate && filterEndDate) {
            let secondDate = formatDate(filterEndDate)
            for (let i = 0; i < trips.length; i++) {
                if (trips[i].start_date < secondDate)
                    new_trips.push(trips[i]);
            }
            setTrips(new_trips);
        }
    }

//reset filters
    const resetFilters = () => {
        setTrips(copyTrips)
        setCheckedTripsComingSoon(false)
        setCheckedTripsEnded(false)
        setFilterStartDate(null)
        setFilterEndDate(null)
        setErrorFilterDate(false)
        setSearchBar("");

    }


//paginate
    const setPage = (event, value) => {
        getTrips(value)
    };

    if (user != null)
        if (user.user.role.id === 3)
            return (
                <div className="flex justify-center bg-gray-900 min-h-screen pt-5 ">


                    <div className="">
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
                                  className="bg-gray-600 hover:bg-gray-800 mb-2 text-white font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                                <AddIcon/>
                                Add Trip
                            </Link>
                        </div>
                        <div className="flex">
                            <div className=" mr-2">
                                <div className="bg-gray-700 p-2 py-4 ">
                                    <h2 className="text-gray-300 mb-2 font-semibold text-center">Filter</h2>
                                    <input
                                        value={searchBar}
                                        name="search_bar"
                                        onChange={(e) => searchTrips(e.target.value)}
                                        placeholder="Search"
                                        className="rounded py-1 px-2 bg-gray-600"
                                    />

                                    <p className="mt-4 text-sm text-gray-400">Start Date</p>
                                    <DatePicker
                                        className="rounded py-1 px-2 bg-gray-600 text-gray-200"
                                        selected={filterStartDate}
                                        onChange={(date) => setFilterStartDate(date)}/>

                                    <p className="text-sm text-gray-400">End Date</p>
                                    <DatePicker
                                        className="rounded py-1 px-2 bg-gray-600 text-gray-200"
                                        selected={filterEndDate}
                                        onChange={(date) => setFilterEndDate(date)}/>
                                    <div>
                                        <button
                                            className="bg-blue-700 text-sm hover:bg-blue-800 text-gray-300 mt-2 px-2 rounded"
                                            onClick={filterByDates}
                                        >
                                            Filter by date
                                        </button>
                                    </div>
                                    {errorFilterDate ?
                                        <p className="text-red-400 text-opacity-60 text-xs">
                                            Invalid Dates
                                        </p>
                                        : ""}


                                    <div className="flex mt-2">
                                        <p className="mt-2 text-gray-400">Trips coming soon</p>
                                        <Checkbox
                                            style={{color: "#1D4ED8",}}
                                            checked={checkedTripsComingSoon}
                                            onChange={handleChangeCheckedTripsComingSoon}
                                        />
                                    </div>
                                    <div className="flex">
                                        <p className="mt-2 text-gray-400">Trips ended</p>
                                        <Checkbox
                                            style={{color: "#1D4ED8",}}
                                            checked={checkedTripsEnded}
                                            onChange={handleChangeCheckedTripsEnded}
                                        />
                                    </div>


                                    <select className="pl-1 rounded py-1 bg-gray-600 text-gray-300 w-48"
                                            onChange={(e) => handleSort(e)}
                                    >
                                        <option disabled>Sort by:</option>
                                        {options.map((option) => (
                                            <option value={option.value}>{option.label}</option>
                                        ))}
                                    </select>

                                    <button
                                        className="mt-5 flex bg-gray-800 text-sm hover:bg-gray-900 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </button>


                                </div>
                            </div>
                            <div>
                                <table className="">
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
                                                <p className="text-sm w-52 font-medium text-gray-300 overflow-hidden truncate ">
                                                    {trip.destination}
                                                </p>
                                                <div className="font-light text-xs text-gray-500">
                                                    {trip.start_date < formatDate(new Date()) && trip.end_date > formatDate(new Date()) ?
                                                        <p className="inline-flex  text-xs text-green-300">
                                                            ongoing
                                                        </p>
                                                        : ""}
                                                    {counterDaysLeft(trip.start_date) > 0 ? "( " + counterDaysLeft(trip.start_date) + " days left )" : ""}</div>

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {trip.start_date < formatDate(new Date()) && trip.end_date > formatDate(new Date()) ?
                                                    <span
                                                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {trip.start_date}
                                                </span>
                                                    : <div className="text-sm text-gray-300">{trip.start_date}</div>
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {trip.start_date < formatDate(new Date()) && trip.end_date > formatDate(new Date()) ?
                                                    <span
                                                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {trip.end_date}
                                                </span>
                                                    : <div className="text-sm text-gray-300">{trip.end_date}</div>
                                                }
                                            </td>
                                            <td className="px-6 py-4  text-sm text-gray-300">
                                                <div className="">
                                                    <p className="truncate w-44">
                                                        {trip.comment}
                                                    </p>
                                                </div>
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
                                <div className="bg-gray-700">
                                    <Pagination
                                        count={paginate.total_pages}
                                        onChange={setPage}
                                        color="primary"
                                    />
                                </div>
                            </div>
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