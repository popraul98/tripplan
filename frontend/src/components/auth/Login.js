import {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate} from "react-router-dom";
import Register from "./Register";
import {useDispatch, useSelector} from "react-redux";
import {login, selectUser, authorization} from "../../features/userSlice";
import {LOGIN} from '../../config/endpoints.js';

const Login = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const location = useLocation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            error_messages: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
        }),
        onSubmit: async values => {
            console.log("login submit")

            const res = await axios.post(LOGIN, values)
                .then(response => {
                        console.log("login");
                        dispatch(login({
                            user: response.data.user,
                            loggedIn: true,
                        }));
                        dispatch(authorization({
                            access_token: response.data.tokens.access_token,
                            refresh_token: response.data.tokens.refresh_token,
                        }))
                        if (response.data.user.role.id === 3)
                            navigate("/trips")
                        if (response.data.user.role.id === 2)
                            navigate("/admin")
                        if (response.data.user.role.id === 1)
                            navigate("/super-admin")
                    }
                ).catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data.message, 'error00');
                        formik.values.error_messages = error.response.data.message;
                    }
                    console.log(formik.values.error_messages, 'error_messages');

                })
        }
    });

    useEffect(() => {
        if (user) {
            if (user.user.role.id === 2)
                navigate("/admin")
            if (user.user.role.id === 3)
                navigate("/trips")
            // if (user.user.role.id === 1)
            //     navigate("/super-admin")
        }
    })


    return (

        <div
            className="flex justify-center h-screen items-center bg-gradient-to-l bg-gray-900 via-indigo-100 to-gray-100 ">

            <form className="bg-gray-800 shadow-2xl rounded px-8 pt-6 pb-8 mb-4 rounded-xl"
                  onSubmit={formik.handleSubmit}>
                <div className="text-red-400">
                    {location.state ? location.state.message : ""}
                </div>
                <h3 className="font-bold text-xl text-gray-300 mb-6">Login</h3>
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    <div className="text-xs text-red-400 ml-1">
                        {formik.touched.email && formik.errors.email ? (
                            <div>{formik.errors.email}</div>
                        ) : null}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <div className="text-xs text-red-400 ml-1">
                        {formik.touched.password && formik.errors.password ? (
                            <div>{formik.errors.password}</div>
                        ) : null}
                    </div>
                </div>

                <div className="ease-out duration-100 text-sm text-red-400">
                    {formik.values.error_messages}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Login
                    </button>
                    <a href="/resetPasswordRequest" className="underline text-sm text-gray-600 m-2">Do you forgot
                        your
                        password?</a>

                </div>
                <div className="text-sm mt-4 text-gray-600 mb-2">You don't have an account yet?</div>
                <div className="mt text-sm">
                    <nav>
                        <Link
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            to="/register"
                        >
                            Register
                        </Link>
                    </nav>

                    <Routes>
                        <Route path="register" element={<Register/>}/>
                    </Routes>

                </div>
            </form>
        </div>
    )

}

export default Login
