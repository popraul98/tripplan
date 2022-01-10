import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authorization, selectTokens, selectUser} from "../../features/userSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {DETAILS_TRIP, GET_USER_TRIPS, REFRESH_TOKEN} from "../../config/endpoints";
import PageExceptions from '../../features/PageExceptions';

const UserTrips = () => {

    let {id} = useParams();
    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";

    const [trips, setTrips] = useState([])
    const [userDetails, setUserDetails] = useState([])
    const [errorNotFound, setErrorNotFound] = useState(false);


    const fetchTrips = async () => {
        let recall = false;
        await axios.get(GET_USER_TRIPS + id, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(function (response) {
            console.log('Token Valabil');
            setTrips(response.data.user_and_trips.trips)
            setUserDetails(response.data.user_and_trips)
        }).catch(function (error) {
            console.log(error.response.status, 'error show trips')
            if (error.response.status === 404)
                setErrorNotFound(true);
            if (error.response.status === 401)
                recall = true;
        });
        if (recall)
            await requestNewRefreshToken(tokens.refresh_token)
    }

    useEffect(() => {
        if (id && tokens) {
            fetchTrips()
        }
    }, [tokens])


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

    // get trips for user
    useEffect(() => {
        console.log("UseEffects")

    }, [userDetails])

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


    if (errorNotFound)
        return (
            <PageExceptions
                codeError={404}
                messageError={"Oops, this user doesn't exist."}
            />
        )
    else
        return (
            <div
                className="flex justify-center bg-gradient-to-l bg-gray-900 via-indigo-100 to-gray-100  min-h-screen pt-5">
                <div className="w-2/3">
                    <Link to="/admin"
                          className="text-sm font-semibold bg-blue-400 text-gray-900 py-1 px-3 rounded-lg hover:bg-blue-700"
                    >
                        Go back
                    </Link>
                    <div className="flex text-gray-400 border border-gray-700 rounded-lg p-4 my-1">
                        <p className="text-sm pr-2">User details:</p>
                        <p className="text-sm pr-4">email: <span className="font-bold">{userDetails.email}</span></p>
                        <p className="text-sm pr-4">nume: <span className="font-bold">{userDetails.name}</span></p>
                        <p className="text-sm pr-4">nume: <span className="font-bold">user</span></p>
                        <p className="text-sm pr-4">created at: <span
                            className="font-bold">{userDetails.created_at}</span>
                        </p>
                    </div>
                    <div className="flex justify-center">
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
                                        <div className="text-sm text-gray-300">{trip.start_date}</div>
                                    </td>
                                    <td className="px-6 py-4  text-sm text-gray-300">
                                        <p className="overflow-hidden truncate w-72 ">{trip.comment}</p>
                                    </td>
                                    <td className="pr-10 py-4 whitespace-nowrap flex justify-between text-sm font-medium">
                                        {/*<button*/}
                                        {/*    className="font-semibold mb-1 mr-2 text-gray-600 hover:text-gray-300">*/}
                                        {/*    <Link to={'/admin/user/' + trip.id}>*/}
                                        {/*        Details*/}
                                        {/*    </Link>*/}
                                        {/*</button>*/}
                                        {/*<DeleteIcon*/}
                                        {/*    className="text-gray-600 hover:text-gray-300 cursor-pointer"*/}
                                        {/*    // onClick={() => deleteTrip(trip.id)}*/}
                                        {/*/>*/}
                                    </td>
                                </tr>
                            )) : null}
                            </tbody>
                            {trips.length === 0 ?
                                <span
                                    className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex justify-between text-gray-300">
                                    This user doesn't have any trips.
                                </span> : ""}
                        </table>
                    </div>
                </div>
            </div>
        )

}

export default UserTrips;