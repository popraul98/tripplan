import React, {useEffect, useState} from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {authorization, selectTokens, selectUser} from "../../features/userSlice";
import {Link, useNavigate, useParams} from "react-router-dom";
import Error404 from "./Error404";
import Error403 from "./Error403";

const DetailsDestination = () => {

    let {id} = useParams();
    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";

    const [trip, setTrip] = useState([]);
    const [errorUnauthorized, setErrorUnauthorized] = useState(false);
    const [errorNotFound, setErrorNotFound] = useState(false);

    const fetchTrip = async () => {
        let recall = false;
        await axios.get("http://127.0.0.1:8000/api/show-trip/" + id, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(function (response) {
            console.log('Token Valabil');
            setTrip(response.data)
        }).catch(function (error) {
            console.log(error.response.status, 'error show trip')
            if (error.response.status === 404)
                setErrorNotFound(true);
            if (error.response.status === 403)
                setErrorUnauthorized(true)
            if (error.response.status === 401)
                recall = true;
        });
        if (recall)
            await requestNewRefreshToken(tokens.refresh_token)
    }

    useEffect(() => {
        if (id && tokens)
            fetchTrip()
    }, [tokens, errorUnauthorized, errorNotFound])

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
                navigate('/', {state: {message: "Your session expired!"}});
                return 401
            }
        });
    }

    const onSubmit = () => {
        console.log("click")
    }

    if (errorUnauthorized)
        return (
            <Error403/>
        )
    if (errorNotFound)
        return (
            <Error404/>
        )
    else
        return (
            <div
                className="flex justify-center bg-gradient-to-l bg-gray-900 via-indigo-100 to-gray-100 h-screen pt-5">
                <div className="w-1/3">
                    <div className="">
                        <button
                            className="font-semibold px-3 text-gray-500 mb-2 rounded-lg hover:bg-gray-400 border border-gray-400 hover:text-gray-800  text-white"
                            // onClick={() => navigate(-1)}
                        >
                            <Link to='/user/'>
                                <ArrowBackIcon className="pb-1"/>TRIPS
                            </Link>
                        </button>
                        <form>
                            <label className="block text-gray-300 text-sm font-semibold mb-1">Destination</label>
                            <input
                                className="shadow bg-gray-300 appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Destination"
                                value={trip.destination}
                                name="destination"
                                // onChange={(e) => onInputChange(e)}

                            />

                            <label className="block text-gray-700 text-sm font-semibold mb-1">Start Date <span
                                className="text-sm text-gray-600 font-light">(year-month-day)</span></label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Start Date"
                                name="start_date"
                                value={trip.start_date}
                                // onChange={(e) => onInputChange(e)}
                            />

                            <label className="block text-gray-700 text-sm font-semibold mb-1">End Date <span
                                className="text-sm text-gray-600 font-light">(year-month-day)</span></label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="End Date"
                                name="end_date"
                                value={trip.end_date}
                                // onChange={(e) => onInputChange(e)}
                            />

                            <label className="block text-gray-700 text-sm font-semibold mb-1">Comment</label>
                            <textarea
                                className="shadow appearance-none border rounded w-full resize-y  py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Write your comment here..."
                                name="comment"
                                value={trip.comment}
                                // onChange={(e) => onInputChange(e)}
                            />

                            <button
                                type="button"
                                className=" bg-gray-500 px-4 py-1 rounded-xl hover:bg-gray-300 px-2 text-gray-900 font-semibold"
                                onClick={onSubmit}
                            >
                                Save
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        )
}

export default DetailsDestination;
