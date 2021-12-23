import React, {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useDispatch, useSelector} from "react-redux";
import {authorization, login, selectTokens, selectUser} from "../../features/userSlice";
import {Link, useNavigate, useParams} from 'react-router-dom';
import DatePicker from 'react-date-picker';
import ButtonHome from "./ButtonHome";
import {ADD_TRIP, DETAILS_TRIP, LOGIN, REFRESH_TOKEN} from "../../config/endpoints";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";


export default function AddTrip({}) {

    let a = 1;
    let {id} = useParams();
    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";
    const [savedSuccessfully, setSavedSuccessfully] = useState(false)
    const [address, setAddress] = useState("");
    const [trip, setTrip] = useState([]);

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

    const fetchTrip = async () => {
        let recall = false;
        await axios.get(DETAILS_TRIP + id, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(function (response) {
            console.log('Token Valabil');
            console.log(response.data.data);
            setAddress(response.data.data.destination);
            edit_trip.values.start_date = formatDate(response.data.data.start_date);
            edit_trip.values.end_date = formatDate(response.data.data.end_date);
            edit_trip.values.comment = response.data.data.comment;
            setTrip(response.data.data)
        }).catch(function (error) {
            console.log(error.response.status, 'error show trip')
            // if (error.response.status === 404)
            //     setErrorNotFound(true);
            // if (error.response.status === 403)
            //     setErrorUnauthorized(true)
            // if (error.response.status === 401)
            recall = true;
        });
        if (recall)
            await requestNewRefreshToken(tokens.refresh_token)
    }

    const edit_trip = useFormik({
        initialValues: {
            id: id,
            id_user: null,
            destination: "",
            start_date: "",
            end_date: "",
            comment: "",
        },
        validationSchema: Yup.object({
            id_user: Yup.number().required('Required'),
            destination: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
            start_date: Yup.date('Invalid Date').required('Required'),
            end_date: Yup.date().required('Required'),
            comment: Yup.string().max(250, 'Must be 250 characters or less').required('Required'),
        }),
        onSubmit: async values => {
            console.log("save submit")
            let recall = false;
            await axios.post(ADD_TRIP, edit_trip.values, {
                headers: {
                    Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                    refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
                }
            }).then(response => {
                resetForm()
                setAddress("")
                setSavedSuccessfully(true)
            }).catch(function (error) {
                    if (error.response.status === 401) {
                        recall = true;
                    }
                }
            );
            if (recall)
                if (await requestNewRefreshToken(tokens.refresh_token) !== 401)
                    edit_trip.handleSubmit()
        }
    });

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

    const resetForm = () => {
        edit_trip.values.destination = "";
        edit_trip.values.start_date = "";
        edit_trip.values.end_date = "";
        edit_trip.values.comment = "";
    }

    useEffect(() => {
        console.log("UseEffects2")
        if (tokens)
            fetchTrip()
    }, [user])

    useEffect(() => {
        console.log("UseEffects")
        if (user)
            edit_trip.values.id_user = user.user.id;
        edit_trip.values.destination = address;
        if (savedSuccessfully === true)
            setSavedSuccessfully(false);
    }, [user, address, trip])

    //DOWN GOOGLE API SEARCH AUTOCOMPLETE
    const handleSelect = (address, placeId, suggestion) => {
        setAddress(address)
        edit_trip.values.destination = address;
    }

    const onError = (status, clearSuggestions) => {
        console.log('Google Maps API returned error with status: ', status)
        clearSuggestions()
    }

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gradient-to-l bg-gray-900 via-indigo-100 to-gray-100 transform transition-transform duration-30">
            <div className="bg-gray-800 shadow rounded-xl w-1/2  p-6">


                <div className="font-semibold text-gray-400 text-xl py-3">
                    Edit Trip
                </div>

                <form onSubmit={edit_trip.handleSubmit}>
                    <label className="block text-gray-300 text-sm font-semibold mb-1">Destination</label>

                    <PlacesAutocomplete
                        name="destination"
                        value={address}
                        onChange={setAddress}
                        onSelect={handleSelect}
                        onError={onError}
                    >
                        {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                            <div className="mb-4">
                                <input
                                    className=" rounded placeholder-gray-500 w-full py-2 px-3 bg-gray-400 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                    {...getInputProps({placeholder: "Destination"})}
                                    name="destination"
                                    onBlur={edit_trip.handleBlur}
                                />
                                <div className="text-xs text-red-400 ml-1">
                                    {edit_trip.touched.destination && edit_trip.errors.destination ? (
                                        <div>{edit_trip.errors.destination}</div>
                                    ) : null}
                                </div>
                                <div className="">

                                    <div className="z-10 absolute rounded">
                                        {suggestions.map((suggestion) => {

                                            const style = {
                                                backgroundColor: suggestion.active ? "rgb(29 78 216)" : "#868686",
                                            }

                                            return (
                                                <div {...getSuggestionItemProps(suggestion, {style})}>
                                                    {suggestion.description}
                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-semibold mb-1">Start Date <span
                            className="text-sm text-gray-500 font-light">(year-month-day)</span></label>
                        <input
                            className=" appearance-none rounded placeholder-gray-500 w-full py-2 px-3 bg-gray-400 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Start Date"
                            name="start_date"
                            onChange={edit_trip.handleChange}
                            onBlur={edit_trip.handleBlur}
                            value={edit_trip.values.start_date}
                        />
                        <div className="text-xs text-red-400 ml-1">
                            {edit_trip.touched.start_date && edit_trip.errors.start_date ? (
                                <div>{edit_trip.errors.start_date}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-semibold mb-1">End Date <span
                            className="text-sm text-gray-500 font-light">(year-month-day)</span></label>
                        <input
                            className=" appearance-none rounded placeholder-gray-500 w-full py-2 px-3 bg-gray-400 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="End Date"
                            name="end_date"
                            onChange={edit_trip.handleChange}
                            onBlur={edit_trip.handleBlur}
                            value={edit_trip.values.end_date}
                        />
                        <div className="text-xs text-red-400 ml-1">
                            {edit_trip.touched.end_date && edit_trip.errors.end_date ? (
                                <div>{edit_trip.errors.end_date}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-semibold mb-1">Comment</label>
                        <textarea
                            className=" appearance-none rounded placeholder-gray-500 w-full py-2 px-3 bg-gray-400 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Write your comment here..."
                            name="comment"
                            onChange={edit_trip.handleChange}
                            onBlur={edit_trip.handleBlur}
                            value={edit_trip.values.comment}
                        />
                        <div className="text-xs text-red-400 ml-1">
                            {edit_trip.touched.comment && edit_trip.errors.comment ? (
                                <div>{edit_trip.errors.comment}</div>
                            ) : null}
                        </div>
                    </div>

                    <button
                        className=" text-gray-300 rounded-xl hover:bg-gray-800 border border-gray-600 px-2 text-white">
                        Save
                    </button>
                    <div className="font-bold mb-2 text-green-500">
                        {savedSuccessfully ? "Trip saved successfully" : ""}
                    </div>
                </form>

                <div className="mt-4 float-right">
                    <ButtonHome/>
                </div>

            </div>
        </div>
    )
}