import {Link} from "react-router-dom";
import React from "react";

const Page404 = () => {
    return (
        <div
            className="flex items-center justify-center w-screen min-h-screen bg-gray-900 ">
            <p className="mr-4 pr-2 font-semibold md:text-7xl lg:text-9xl text-gray-400 border-gray-400 border-r">404</p>
            <div>
                <div className=" text-gray-400 font-bold text-4xl">
                    Oops, the requested URL is invalid or was not found.
                </div>
                <div className="text-gray-500 text-sm">
                    Click on below button to leave this page!
                </div>
                <div className="mt-4">
                    <Link to="/"
                          className="bg-blue-700 px-3 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-gray-900 rounded-lg">
                        Take me back
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Page404;