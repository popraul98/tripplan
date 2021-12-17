import React, {useEffect, useState} from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {authorization, selectTokens, selectUser} from "../../features/userSlice";
import {Link, useNavigate, useParams} from "react-router-dom";
import Error404 from "./Error404";
import Error403 from "./Error403";
import ButtonHome from "./ButtonHome";

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
            setTrip(response.data.data)
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
                <div className="w-2/3">
                    <div className="">
                        <button>
                            <ButtonHome/>
                        </button>
                        <div className="flex justify-around  p-3">
                            <div className="float-left border rounded-t-2xl border-gray-700 w-1/3">
                                <h3 className="p-2 pb-4 text-gray-300 italic text-2xl font-semibold">
                                    {trip.destination}
                                </h3>
                                <div className="relative border-t border-gray-700 rounded-t">
                                    <div className="border-r-2 border-gray-500 absolute h-full top-0"
                                         style={{'left': '9px'}}></div>
                                    <ul className="list-none m-0 p-0">
                                        <li className="mb-5  ">
                                            <div className="flex group items-center ">
                                                <div
                                                    className="bg-gray-500 group-hover:bg-red-700 z-10 rounded-full border-2 border-blue-700 ml-1 h-3 w-3">
                                                    <div
                                                        className="bg-gray-400 h-0.5 w-5 items-center  ml-3 mt-1"></div>
                                                </div>
                                                <div className="flex-1 ml-4 z-10 ">
                                                    <div
                                                        className="pl-3 text-gray-300 font-semibold order-1 space-y-2 rounded-lg shadow-only transition-ease lg:w-5/12">
                                                        Start Date:
                                                    </div>
                                                    <div className="pl-3 text-gray-300">
                                                        {trip.start_date}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="">
                                            <div className="flex group items-center ">
                                                <div
                                                    className="bg-gray-500 group-hover:bg-red-700 z-10 rounded-full border-2 border-blue-700 ml-1 h-3 w-3">
                                                    <div
                                                        className="bg-gray-400 h-0.5 w-5 items-center  ml-3 mt-1"></div>
                                                </div>
                                                <div className="flex-1 ml-4 z-10">
                                                    <div
                                                        className="pl-3 text-gray-300 font-semibold order-1 space-y-2 rounded-lg shadow-only transition-ease lg:w-5/12">
                                                        End Date:
                                                    </div>
                                                    <div className="pl-3 text-gray-300">
                                                        {trip.end_date}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <p className="border-t border-gray-700 pt-3 text-ellipsis text-gray-300 rounded pl-2">
                                    {trip.comment}
                                </p>
                            </div>

                            <div className="float right ">
                                <iframe
                                    width="550"
                                    height="350"
                                    src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyD1viFL9PIqRrQ159iA5-pGQ_mKQn-tt14&q=" + trip.destination}>
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default DetailsDestination;
