import axios from "axios";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "./css/styles.css";
import {ClipLoader} from "react-spinners";
import {RESET_PASSWORD, VERIFY_TOKEN_RESET_PASSWORD} from "../../config/endpoints";

const ResetPasswordForm = () => {

    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false)
    const [messageStatus, setMessageStatus] = useState("")
    const [messageError, setMessageError] = useState("")
    const [submitProgress, setSubmitProgress] = useState(false)

    //take parameter from url - token
    let {token} = useParams();

    const [password, setPassword] = useState({
        token: token,
        password: '',
        password_confirm: '',
    })

    const onInputChange = e => {
        setPassword({...password, [e.target.name]: e.target.value});
        setMessageError('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.password && password.password_confirm)
            if (password.password === password.password_confirm) {
                setSubmitProgress(true)
                await axios.post(RESET_PASSWORD, password)
                    .then(response => {
                        if (response.status === 200 || response.status === 201)
                            setSubmitProgress(false);
                        setMessageStatus(response.data.message)
                        setPassword({
                            token: null,
                            password: '',
                            password_confirm: '',
                        })
                    }).catch(function (error) {
                        console.log(error.response.status);
                        if (error.response.status === 400)
                            setMessageError('This token is no longer available')
                    });
            } else {
                setMessageError('Passwords doesn\'t match');
                setSubmitProgress(false)
            }
        else {
            setMessageError('Fill all inputs');
        }
    }

    useEffect(() => {
        checkToken()
    })

    const checkToken = async () => {
        await axios.post(VERIFY_TOKEN_RESET_PASSWORD, {token})
            .then(response => {
                console.log("Token Valabil..")
                setShowForm(true)
            }).catch(error => {
                console.log(error.message);
                alert("Token Invalid! \ Go back to Login")
                navigate("/")
            });
    }

    if (showForm === true)
        return (
            <div className="flex justify-center h-screen items-center  bg-gray-900 ">
                <form className="bg-gray-800 shadow-2xl rounded px-8 pt-6 pb-8 mb-4 rounded-xl" onSubmit={handleSubmit}>
                    <h3 className="text-gray-300 font-semibold mb-2">Reset Your Password</h3>
                    <div className="mb-4">

                        <label className="block text-gray-400 text-sm mb-1" htmlFor="email">
                            New Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => onInputChange(e)}
                        />
                        <label className="mt-4 block text-gray-400 text-sm mb-1" htmlFor="email">
                            Confirm New Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password_confirm"
                            name="password_confirm"
                            type="password"
                            placeholder="Confirm New Password"
                            onChange={(e) => onInputChange(e)}
                        />
                        <div className="flex justify-between mt-2">
                            <button
                                className="mt-2 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Submit
                                {submitProgress ? <ClipLoader size={10}/> : ""}
                            </button>
                            <a
                                href="/"
                                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Go
                                back to Login
                            </a>
                        </div>
                        <div className="text-red-500 text-xs mt-1">{messageError}</div>
                        <div className="text-green-500 text-sm mt-1">{messageStatus}</div>
                    </div>
                </form>
            </div>
        )

    if (showForm === false)
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">

                <div className="loader">


                </div>

            </div>
        )

}

export default ResetPasswordForm