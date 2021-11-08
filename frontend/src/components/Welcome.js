import {Link, Route, Routes} from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./Home";
import {useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";

function Welcome() {

    const user = useSelector(selectUser);

    return (
        <div className="">
            {user ? <Home/> : <Login/>}
            {/*<Routes>*/}
            {/*    <Route path="register" element={<Register/>}/>*/}
            {/*    <Route path="login" element={<Login/>}/>*/}
            {/*    <Route path="home" element={<Home/>}/>*/}
            {/*    <Route path="welcome" element={<Welcome/>}/>*/}
            {/*</Routes>*/}
        </div>
    );
}

export default Welcome;