import {Route, Routes} from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import UserPage from "./components/user-interface/UserPage";
import ResetPasswordRequest from "./components/auth/ResetPasswordRequest";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import AdminPage from "./components/AdminPage";
import DetailsDestination from "./components/user-interface/DetailsDestination";
import AddTrip from "./components/user-interface/AddTrip";

function App() {
    return (
        <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/user" exact element={<UserPage/>}/>
            <Route path="/admin" element={<AdminPage/>}/>
            <Route path="/resetPasswordRequest" element={<ResetPasswordRequest/>}/>
            <Route path="/resetPasswordForm/:token" element={<ResetPasswordForm/>}/>
            <Route path="/" exact element={<Login/>}/>
            <Route path="/user/:id/" element={<DetailsDestination/>}/>
            <Route path="/user/add-trip" element={<AddTrip/>}/>
        </Routes>
    );
}

export default App;
