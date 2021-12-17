import {Link} from "react-router-dom";
import React from "react";
import ButtonHome from "./ButtonHome";

const Error404 = () => {
    return (
        <div
            className="flex items-center justify-center w-screen h-screen bg-gradient-to-l bg-gray-900 via-indigo-100 to-gray-100">
            <p className="mr-4 pr-2 font-semibold md:text-7xl lg:text-9xl text-gray-400 border-gray-400 border-r">404</p>
            <div>
                <div className=" text-gray-400 font-bold text-4xl">Sorry, Page Not Found</div>
                <div className="text-gray-500 text-sm">The page you requested could not be found</div>
                <div className="mt-4">
                    <ButtonHome/>
                </div>
            </div>
        </div>
    )
}

export default Error404;