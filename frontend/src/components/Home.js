import {Link, Navigate, Route, Routes} from "react-router-dom";
import {useNavigate} from "react-router-dom";

const Home = (props) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
        console.log("ai")
        navigate('/login')
    }
    const user = localStorage.getItem("userData");

    return (
        <div>
            <h2>hi {user}</h2>
            <p>You are login</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={logout}
            >
                LogOut
            </button>
        </div>
    )
}

export default Home;