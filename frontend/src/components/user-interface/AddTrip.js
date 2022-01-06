import React, {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useDispatch, useSelector} from "react-redux";
import {authorization, login, selectTokens, selectUser} from "../../features/userSlice";
import {Link, useNavigate} from 'react-router-dom';
import ButtonHome from "./ButtonHome";
import {ADD_TRIP, LOGIN, REFRESH_TOKEN} from "../../config/endpoints";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
import DatePicker from "react-date-picker";


export default function AddTrip({}) {

    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";
    const [addedSuccessfully, setAddedSuccessfully] = useState(false);
    const [submitErrors, setSubmitErrors] = useState([]);
    const [address, setAddress] = useState("");

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

    const new_trip = useFormik({
        initialValues: {
            destination: address,
            start_date: formatDate(new Date()),
            end_date: formatDate(new Date()),
            comment: "",
        },
        validationSchema: Yup.object({
            destination: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
            start_date: Yup.date('Invalid Date').required('Required'),
            end_date: Yup.date().required('Required'),
            comment: Yup.string().max(250, 'Must be 250 characters or less').required('Required'),
        }),
        onSubmit: async values => {
            console.log("add submit")
            let recall = false;
            await axios.post(ADD_TRIP, new_trip.values, {
                headers: {
                    Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                    refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
                }
            }).then(response => {
                resetForm()
                setAddress("")
                setAddedSuccessfully(true)
                setSubmitErrors([])
            }).catch(function (error) {
                    if (error.response.status === 401) {
                        recall = true;
                    }
                    if (error.response.status === 422) {
                        setSubmitErrors(error.response.data)
                        console.log(submitErrors)
                    }
                }
            );
            if (recall)
                if (await requestNewRefreshToken(tokens.refresh_token) !== 401)
                    new_trip.handleSubmit()
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
        new_trip.values.destination = "";
        new_trip.values.start_date = "";
        new_trip.values.end_date = "";
        new_trip.values.comment = "";
    }


    useEffect(() => {
        console.log("UseEffects")
        new_trip.values.destination = address;
        if (addedSuccessfully === true)
            setAddedSuccessfully(false);
    }, [user, address])

    //DOWN GOOGLE API SEARCH AUTOCOMPLETE
    const handleSelect = (address, placeId, suggestion) => {
        setAddress(address)
        new_trip.values.destination = address;
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
                    Add new trip
                </div>
                <div className="font-bold mb-2 text-green-500">
                    {addedSuccessfully ? "Trip added successfully" : ""}
                </div>
                <div className="font-semibold text-sm mb-2 text-red-500 text-opacity-80">
                    {submitErrors ? submitErrors.destination : null}
                </div>
                <form onSubmit={new_trip.handleSubmit}>
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
                                    onBlur={new_trip.handleBlur}
                                />
                                <div className="text-xs text-red-400 ml-1">
                                    {new_trip.touched.destination && new_trip.errors.destination ? (
                                        <div>{new_trip.errors.destination}</div>
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
                            onChange={new_trip.handleChange}
                            onBlur={new_trip.handleBlur}
                            value={new_trip.values.start_date}
                        />
                        <div className="text-xs text-red-400 ml-1">
                            {new_trip.touched.start_date && new_trip.errors.start_date ? (
                                <div>{new_trip.errors.start_date}</div>
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
                            onChange={new_trip.handleChange}
                            onBlur={new_trip.handleBlur}
                            value={new_trip.values.end_date}
                        />
                        <div className="text-xs text-red-400 ml-1">
                            {new_trip.touched.end_date && new_trip.errors.end_date ? (
                                <div>{new_trip.errors.end_date}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-semibold mb-1">Comment</label>
                        <textarea
                            className=" appearance-none rounded placeholder-gray-500 w-full py-2 px-3 bg-gray-400 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Write your comment here..."
                            name="comment"
                            onChange={new_trip.handleChange}
                            onBlur={new_trip.handleBlur}
                            value={new_trip.values.comment}
                        />
                        <div className="text-xs text-red-400 ml-1">
                            {new_trip.touched.comment && new_trip.errors.comment ? (
                                <div>{new_trip.errors.comment}</div>
                            ) : null}
                        </div>
                    </div>

                    <button
                        className=" text-gray-300 rounded-xl hover:bg-gray-800 border border-gray-600 px-2 text-white">
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