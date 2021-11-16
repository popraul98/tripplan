import {Link, Route, Routes} from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./Home";
import {useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";
import ResetPasswordRequest from "./auth/ResetPasswordRequest";

function Welcome() {

    const user = useSelector(selectUser);

    return (
        <div className="">
            WELCOME PAGE
        </div>
    );
}

export default Welcome;