import {Link} from "react-router-dom";
import React from "react";
import ButtonHome from "./ButtonHome";

const Error403 = () => {
    return (
        <div
            className="flex items-center justify-center w-screen min-h-screen bg-gray-900 ">
            <p className="mr-4 pr-2 font-semibold md:text-7xl lg:text-9xl text-gray-400 border-gray-400 border-r">403</p>
            <div>
                <div className=" text-gray-400 font-bold text-4xl">This action is unauthorized.</div>
                <div className="text-gray-500 text-sm">
                    Your are not the owner of this trip or the server doesn't allow you to take this action!
                </div>
                <div className="mt-4">
                    <ButtonHome/>
                </div>
            </div>
        </div>
    )
}

export default Error403;