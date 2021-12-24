import {Route, Routes} from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import UserPage from "./components/user-interface/UserPage";
import ResetPasswordRequest from "./components/auth/ResetPasswordRequest";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import AdminPage from "./components/admin-interface/AdminPage";
import DetailsDestination from "./components/user-interface/DetailsDestination";
import AddTrip from "./components/user-interface/AddTrip";
import EditTrip from "./components/user-interface/EditTrip";
import UserTrips from "./components/admin-interface/UserTrips"
import PageExceptions from "./features/PageExceptions";
import React from "react";

function App() {
    return (
        <Routes>
            <Route path="/resetPasswordRequest" element={<ResetPasswordRequest/>}/>
            <Route path="/resetPasswordForm/:token" element={<ResetPasswordForm/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/" exact element={<Login/>}/>

            //user interface
            <Route path="/trips" exact element={<UserPage/>}/>
            <Route path="/trips/:id/" element={<DetailsDestination/>}/>
            <Route path="/trips/add-trip" element={<AddTrip/>}/>
            <Route path="/trips/:id/edit-trip" element={<EditTrip/>}/>

            //admin interface
            <Route path="/admin" element={<AdminPage/>}/>
            <Route path="/admin/user/:id" element={<UserTrips/>}/>

            <Route path="*" element={
                <PageExceptions
                    codeError={404}
                    messageError={'Sorry, this page doesn\'t exist or the URL is wrong.'}
                    secondMessage={'The page you requested could not be found'}
                />
            }/>
        </Routes>
    );
}

export default App;
