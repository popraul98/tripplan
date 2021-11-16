import axios from "axios";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from "./Login";

const Register = (props) => {

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            password_confirm: ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
        }),
        onSubmit: values => {
            console.log(values)
            try {
                axios.post("http://127.0.0.1:8000/api/register", values)
            } catch (error) {
                console.error(error);
            }

        },
    });


    return (
        <div className="flex justify-center h-screen items-center ">
            <form className="bg-white shadow-2xl rounded px-8 pt-6 pb-8 mb-4 bg-gray-100"
                  onSubmit={formik.handleSubmit}>
                <h3 className="font-bold text-xl mb-6">Register</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    <div className="text-xs text-red-400 ml-1">
                        {formik.touched.name && formik.errors.name ? (
                            <div>{formik.errors.name}</div>
                        ) : null}
                    </div>
                </div>
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
                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Confirm Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirm_password"
                        name="password_confirm"
                        type="password_confirm"
                        placeholder="password_confirm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password_confirm}
                    />
                    <div className="text-xs text-red-400 ml-1">
                        {formik.touched.password_confirm && formik.errors.password_confirm ? (
                            <div>{formik.errors.password_confirm}</div>
                        ) : null}
                    </div>

                </div>
                {/*<div className="">*/}
                {/*    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm_Password">*/}
                {/*        Password*/}
                {/*    </label>*/}
                {/*    <input*/}
                {/*        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"*/}
                {/*        id="confirm-password"*/}
                {/*        type="password"*/}
                {/*        placeholder="Confirm Password"*/}
                {/*        value={confirm_password}*/}
                {/*        onChange={e => onInputChange(e)}*/}
                {/*    />*/}
                {/*</div>*/}
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        // onClick={register}
                    >
                        Register
                    </button>
                </div>
                <div className="text-green-500">You have been registered!</div>
                <div className="text-sm mt-4 text-gray-500 mb-2">You already have an account?</div>
                <div className="mt text-sm">

                    <nav>
                        <Link
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            to="/"
                        >
                            Login
                        </Link>
                    </nav>

                    <Routes>
                        <Route path="login" element={<Login/>}/>
                    </Routes>
                </div>
            </form>
        </div>
    )
}

export default Register
