import axios from "axios";
import {useState} from "react";

const ResetPasswordRequest = () => {

    const [email, setEmail] = useState(null)
    const [messageStatus, setMessageStatus] = useState("")

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const em = {email}
        const res = await axios.post("http://127.0.0.1:8000/api/reset-password-request", em)
            .then(response => {
                console.log(response.data.message)
                setMessageStatus(response.data.message)
            }).catch(error => {
                console.log(error.message);
            })

    }


    return (

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded px-8 pt-6 pb-8 mb-4 bg-gray-100 ">
            <h3>Forgot Password?</h3>
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
                    onChange={handleChange}
                />
                <div className="flex justify-between">
                    <button
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Submit
                    </button>
                    <a
                        href="/"
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Go
                        back to Login
                    </a>
                </div>
            </div>
        </form>
    )

}

export default ResetPasswordRequest