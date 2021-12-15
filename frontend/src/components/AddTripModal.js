import React, {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";
import DatePicker from 'react-date-picker';

export default function AddTripModal({open, children, onClose}) {
    // console.log("open modal add trip:", open)

    const user = useSelector(selectUser);
    const [addedSuccessfully, setAddedSuccessfully] = useState(false)

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

    const [trip, setTrip] = useState({
        id_user: user.user.id,
        destination: "",
        start_date: formatDate(new Date()),
        end_date: formatDate(new Date()),
        comment: "",
    })

    const onSubmit = (e) => {
        e.preventDefault()
        addTrip(trip)
    }

    const onInputChange = e => {
        setTrip({...trip, [e.target.name]: e.target.value});
        setAddedSuccessfully(false);
    };


    const addTrip = async (trip) => {
        console.log(trip)
        const res = await axios.post("http://127.0.0.1:8000/api/create-trip", trip)
            .then(response => {
                setTrip({
                    id_user: user.user,
                    destination: "",
                    start_date: formatDate(new Date()),
                    end_date: formatDate(new Date()),
                    comment: ""
                })
                setAddedSuccessfully(true)
            }).catch(error => {
                    console.log(error, "error")
                }
            )

    }

    if (!open) return null
    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-80 transform transition-transform duration-30">
            <div className="bg-gray-100 shadow rounded-xl w-1/2  p-6">
                <div className="font-semibold text-gray-700 text-lg mb-2 underline">
                    Add your Trip:
                </div>
                <div className="font-bold mb-2 text-green-500">
                    {addedSuccessfully ? "Trip added successfully" : ""}
                </div>
                <form onSubmit={onSubmit}>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Destination</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Destination"
                        value={trip.destination}
                        name="destination"
                        onChange={(e) => onInputChange(e)}

                    />

                    <label className="block text-gray-700 text-sm font-semibold mb-1">Start Date <span
                        className="text-sm text-gray-600 font-light">(year-month-day)</span></label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Start Date"
                        name="start_date"
                        value={trip.start_date}
                        onChange={(e) => onInputChange(e)}
                    />

                    <label className="block text-gray-700 text-sm font-semibold mb-1">End Date <span
                        className="text-sm text-gray-600 font-light">(year-month-day)</span></label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="End Date"
                        name="end_date"
                        value={trip.end_date}
                        onChange={(e) => onInputChange(e)}
                    />

                    <label className="block text-gray-700 text-sm font-semibold mb-1">Comment</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Write your comment here..."
                        name="comment"
                        value={trip.comment}
                        onChange={(e) => onInputChange(e)}
                    />

                    <button className=" bg-gray-700 rounded-xl hover:bg-gray-600 border px-2 text-white">
                        Add trip
                    </button>
                </form>
                <button
                    className="float-right bg-gray-400 rounded-xl text-sm hover:bg-gray-600 border px-2 text-white"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
}