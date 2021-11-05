import {useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import Register from "./Register";
import Home from "../Home";


const Login = (props) => {

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
        }),
        onSubmit: values => {
            try {
                axios.post("http://127.0.0.1:8000/api/login", values)
                    .then(response => {
                            if (response.data !== 0) {
                                console.log("login")
                                localStorage.setItem("isLoggedIn", true);
                                localStorage.setItem("userData", JSON.stringify(response.data));
                                <Home/>

                            } else {
                                console.log("BAD")
                            }
                        }
                    )
            } catch (error) {
                console.error(error);
            }

        },
    });

    const navigate = useNavigate();
    const login = localStorage.getItem("isLoggedIn");
    if (login) {
        navigate("/home");
    } else {

        return (
            <div className="flex justify-center h-screen items-center ">

                <form className="bg-white shadow-2xl rounded px-8 pt-6 pb-8 mb-4 bg-gray-100 "
                      onSubmit={formik.handleSubmit}>
                    <h3 className="font-bold text-xl mb-6">Login</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                    <div className="text-sm mt-4 text-gray-500 mb-2">You don't have an account yet?</div>
                    <div className="mt text-sm">

                        <nav>
                            <Link
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
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
}

export default Login
