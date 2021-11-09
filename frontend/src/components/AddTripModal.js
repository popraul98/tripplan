import React from "react";

export default function AddTripModal({open, children, onClose}) {
    console.log(open)
    if (!open) return null

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-80 transform transition-transform duration-30">
            <div className="bg-gray-100 shadow rounded-xl w-1/2  p-6">
                <div className="font-semibold text-gray-700 text-lg mb-2 underline">
                    Add your Trip:
                </div>
                <form>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Destination</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Destination"
                    />
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Start Date</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Start Date"
                    />
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Destination</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="End Date"
                    />
                    <label className="block text-gray-700 text-sm font-semibold mb-1">End Date</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="End Date"
                    />
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Comment</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Write your comment here..."
                    />
                    <button className=" bg-gray-700 rounded-xl hover:bg-gray-600 border px-2 text-white">
                        Add trip
                    </button>
                </form>
                <button
                    className="float-right bg-gray-400 rounded-xl text-sm hover:bg-gray-600 border px-2 text-white"
                    onClick={onClose}
                >
                    Close Modal
                </button>
            </div>
        </div>
    )
}