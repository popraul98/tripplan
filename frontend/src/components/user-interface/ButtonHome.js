import {Link} from "react-router-dom";
import React from "react";

const ButtonHome = () => {
    return (

        <Link to="/"
              className="bg-blue-700 px-3 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-gray-900 rounded-lg">
            Take me home
        </Link>

    )
}

export default ButtonHome;