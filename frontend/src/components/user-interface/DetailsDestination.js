import React, {useEffect, useState} from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {authorization, selectTokens, selectUser} from "../../features/userSlice";
import {Link, useNavigate, useParams} from "react-router-dom";
import ButtonHome from "./ButtonHome";
import {DETAILS_TRIP, REFRESH_TOKEN} from "../../config/endpoints";
import RatingStars from "./RatingStars";
import {ClipLoader} from "react-spinners";
import PageExceptions from "../../features/PageExceptions";

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
    const [insights, setInsights] = useState([]);

    const fetchTrip = async () => {
        let recall = false;
        await axios.get(DETAILS_TRIP + id, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(function (response) {
            console.log('Token Valabil');
            setTrip(response.data.data)
            fetchInsights(response.data.data.destination)
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
        if (id && tokens) {
            fetchTrip()
        }

    }, [tokens, errorUnauthorized, errorNotFound])


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

    const fetchInsights = async (destination) => {
        let language = 'en';
        let key = 'AIzaSyD1viFL9PIqRrQ159iA5-pGQ_mKQn-tt14';
        const proxyUrl = "https://cors-anywhere.herokuapp.com/"
        if (destination)
            await axios.get(proxyUrl +
                "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + destination + "+things-to-do&language=" + language + "&key=" + key, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            ).then(function (response) {
                console.log(response.data.results);
                setInsights(response.data.results)
            }).catch(function (error) {
                console.log(error, 'error la insights')
            });
    }

    if (errorUnauthorized)
        return (
            <PageExceptions
                codeError={403}
                messageError={'This action is unauthorized.'}
                secondMessage={'Your are not the owner of this trip or the server doesn\'t allow you to take this action!'}
            />
        )
    if (errorNotFound)
        return (
            <PageExceptions
                codeError={404}
                messageError={'Sorry, this trip doesn\'t exist'}
                secondMessage={'The page you requested could not be found'}
            />
        )
    else
        return (
            <div
                className="flex justify-center bg-gray-900 min-h-screen  pt-5">
                <div className="w-2/3 ">
                    <ButtonHome/>
                    <div className="flex  py-4">
                        <div className="float-left border rounded-lg bg-gray-800 shadow border-gray-700 w-1/2 mr-5 ">
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

                        <div className="float-right flex-1 ">
                            <iframe
                                width="100%"
                                height="350"
                                src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyD1viFL9PIqRrQ159iA5-pGQ_mKQn-tt14&q=" + trip.destination}>
                            </iframe>
                        </div>
                    </div>
                    <div className="flex justify-between py-2 h-96 ">
                        <div className="float-left border rounded-lg bg-gray-800 shadow border-gray-700 w-1/2 mr-5 ">
                            DE IMPLEMENTAT: USER UL POATE SA ISI SALVEZE OBIECTIVELE TURISTICE SAU SA INTERACTIONEZE CU
                            ACESTEA

                        </div>
                        <div className="grid grid-cols-2 gap-2 overflow-y-auto -mr-5 ">
                            {insights.length > 0 ? insights.map((insight) => (
                                <div className="bg-gray-700 rounded-lg pb-1">
                                    <img src={insight.icon}
                                        // src={require("../../images/map_grid_template.png").default}
                                         className='object-none h-32 w-full rounded-t-lg'
                                         alt="map-grid"
                                    />
                                    <div className="pl-1">
                                        <h3 className="text-gray-300 font-semibold">
                                            {insight.name}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {insight.formatted_address}
                                        </p>
                                        <RatingStars rating={insight.rating}/>
                                    </div>
                                </div>
                            )) : <div className="flex flex-col pt-24 pr-5">
                                <ClipLoader size={80}/>
                                <div>.. loading insights</div>
                            </div>}


                        </div>
                    </div>

                </div>
            </div>
        )
}

export default DetailsDestination;
