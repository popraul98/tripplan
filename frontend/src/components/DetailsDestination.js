import React, {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";


export default function DetailsDestination({open, children, onClose, trip}) {

    // console.log("open modal details destination:", open)
    // console.log("props:", trip)


    if (!open) return null
    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-80 transform transition-transform duration-30">
            <div className="bg-gray-100 shadow rounded-xl w-auto min-w-full p-6">
                <div className="font-semibold text-gray-700 text-lg mb-4 mt-4 underline pl-4">
                    Details Destinations
                </div>
                <div className="flex justify-between ">
                    <div className="float-left pl-4">
                        <h2 className="block text-gray-500 text-sm font-semibold">Destination:</h2>
                        <p className="font-semibold pl-4  text-gray-600  bg-gray-100 mb-2 bg-opacity-80 rounded-r-full ">
                            {trip.destination}
                        </p>
                        <h2 className="block text-gray-500 text-sm font-semibold">Start Date:</h2>
                        <p className="font-semibold pl-2  text-gray-600 mb-2 bg-gray-100 bg-opacity-10 rounded-r-full ">
                            {trip.start_date}
                        </p>
                        <h2 className="block text-gray-500 text-sm font-semibold">End Date:</h2>
                        <p className="font-semibold pl-2  text-gray-600 mb-2 bg-gray-100 bg-opacity-10 rounded-r-full ">
                            {trip.end_date}
                        </p>
                        <h2 className="block text-gray-500 text-sm font-semibold">Comment:</h2>
                        <p className="font-semibold pl-2  text-gray-600 mb-2 bg-gray-100 bg-opacity-10 rounded-r-full ">
                            {trip.comment}
                        </p>
                    </div>
                    <div className="float right pr-4">
                        <iframe
                            width="450"
                            height="250"
                            frameBorder="0"
                            src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyD1viFL9PIqRrQ159iA5-pGQ_mKQn-tt14&q=" + trip.destination }>
                            Map Loading
                        </iframe>

                    </div>
                </div>

                <button
                    className="float-right bg-gray-600 rounded-xl text-sm hover:bg-gray-300 hover:text-gray-800 border px-2 m-5 text-white"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
}
