import Welcome from "./components/Welcome"
import {Route, Switch,Routes} from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import ResetPasswordRequest from "./components/auth/ResetPasswordRequest";

function App() {
    return (
       <Routes>
           <Route path="/register" element={<Register/>}/>
           <Route path="/home" element={<Home/>}/>
           <Route path="/resetPassword" element={<ResetPasswordRequest/>}/>
           <Route path="/" exact element={<Login/>}/>
           {/*<Route path="/welcome" element={<Welcome/>}/>*/}
       </Routes>
    );
}

export default App;
