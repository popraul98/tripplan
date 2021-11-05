import {Link, Route, Routes} from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./Home";

function Welcome() {

    const login = localStorage.getItem("isLoggedIn");
    if (login) {
        return <Home/>;
    }
    return (
        <div className="">
            WELCOME PAGE
            <nav className="place-content-center">
                <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    to="/login"
                >
                    Login
                </Link>
                <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    to="/register"
                >
                    Register
                </Link>
                <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    to="/"
                >
                    WELCOME
                </Link>
            </nav>

            <Routes>
                <Route path="register" element={<Register/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="home" element={<Home/>}/>
                <Route path="welcome" element={<Welcome/>}/>
            </Routes>
        </div>
    );
}

export default Welcome;