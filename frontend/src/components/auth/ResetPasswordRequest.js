import axios from "axios";
import React, {useState} from "react";
import {RESET_PASSWORD_REQ} from "../../config/endpoints";
import {ClipLoader} from "react-spinners";

const ResetPasswordRequest = () => {

    const [email, setEmail] = useState(null)
    const [messageStatus, setMessageStatus] = useState("")
    const [messageError, setMessageError] = useState("")
    const [submitProgress, setSubmitProgress] = useState(false)

    const handleChange = (e) => {
        setEmail(e.target.value)
        setMessageError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessageError("")
        if (email) {
            setSubmitProgress(true);
            await axios.post(RESET_PASSWORD_REQ, {email})
                .then(response => {
                    setMessageStatus(response.data.message)
                    console.log(response)
                    if (response.status === 200 || response.status === 201)
                        setSubmitProgress(false);
                }).catch(function (error) {
                    if (error.response.status === 404) {
                        setSubmitProgress(false);
                        setMessageStatus("")
                        setMessageError("No user registered with this email")
                    }
                })
        } else {
            setMessageError('Enter your email address!')
        }
    }

    return (
        <div className="flex justify-center h-screen items-center  bg-gray-900 ">
            <form onSubmit={handleSubmit} className="bg-gray-800 shadow-2xl rounded px-8 pt-6 pb-8 mb-4 rounded-xl">
                <h3 className="text-gray-300 font-semibold mb-4">Forgot Password?</h3>
                <div className="mb-4">
                    <label className="block text-gray-400 text-xs mb-2" htmlFor="email">
                        Enter your email address:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Email"
                        onChange={handleChange}
                    />
                    <div className="flex justify-between">
                        <button
                            className="mt-2 mr-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                            Submit
                            {submitProgress ? <ClipLoader size={10}/> : ""}
                        </button>
                        <a
                            href="/"
                            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                            Go back to Login
                        </a>
                    </div>
                    <div>
                        {messageStatus ? <div className="mt-2 text-sm text-green-500">{messageStatus}</div> : ""}
                    </div>
                    <div>
                        {messageError ? <div className="mt-2 text-xs text-red-500">{messageError}</div> : ""}
                    </div>
                </div>
            </form>
        </div>

    )

}

export default ResetPasswordRequest