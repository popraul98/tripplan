import {Route, Routes} from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import ResetPasswordRequest from "./components/auth/ResetPasswordRequest";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import AdminPage from "./components/AdminPage";
import DetailsDestination from "./components/DetailsDestination";

function App() {
    return (
        <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/home" exact element={<Home/>}/>
            <Route path="/admin" element={<AdminPage/>}/>
            <Route path="/resetPasswordRequest" element={<ResetPasswordRequest/>}/>
            <Route path="/resetPasswordForm/:token" element={<ResetPasswordForm/>}/>
            <Route path="/" exact element={<Login/>}/>
            <Route path="/home/:id/" element={<DetailsDestination/>}/>
        </Routes>
    );
}

export default App;
