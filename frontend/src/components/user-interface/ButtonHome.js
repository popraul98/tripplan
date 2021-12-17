import {Link} from "react-router-dom";
import React from "react";

const ButtonHome = () => {
    return (

        <Link to="/trips"
              className="bg-blue-700 px-3 py-2 text-sm text-gray-300 hover:bg-blue-700 rounded-lg">
            Go back to Trips
        </Link>

    )
}

export default ButtonHome;