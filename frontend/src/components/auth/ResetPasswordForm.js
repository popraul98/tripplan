import axios from "axios";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "./css/styles.css";

const ResetPasswordForm = () => {

    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(null)

    //take parameter from url - token
    let {token} = useParams();

    const [password, setPassword] = useState({
        token: token,
        password: '',
        password_confirm: '',
    })
    const [messageStatus, setMessageStatus] = useState("")

    const onInputChange = e => {
        setPassword({...password, [e.target.name]: e.target.value});
        console.log(token);

    };

    useEffect(() => {
        checkToken()

        console.log(showForm)

    })

    const checkToken = async () => {
        console.log("check Token..")
        const res = await axios.post("http://127.0.0.1:8000/api/check-token-resetPassword", {token})
            .then(response => {
                // console.log(response.data.value)
                setShowForm(true)
            }).catch(error => {
                console.log(error.message);
                alert("Token Invalid! \ Go back to Login")
                navigate("/")
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(password)
        const res = await axios.post("http://127.0.0.1:8000/api/reset-password", password)
            .then(response => {
                //show message to user
                setMessageStatus(response.data.message)

                //clear form
                setPassword({
                    token: null,
                    password: '',
                    password_confirm: '',
                })
            }).catch(error => {
                console.log(error.message);
            })

    }
    if (showForm == true)
        return (
            <div className="bg-white shadow-2xl rounded px-8 pt-6 pb-8 mb-4 bg-gray-100 ">
                <form onSubmit={handleSubmit}>
                    <h3>Reset Your Password</h3>
                    <div className="mb-4">

                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
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
                <div className="text-green-500">{messageStatus}</div>
            </div>
        )

    if (showForm == null)
        return (
            <div className="flex items-center justify-center h-screen">

                <div className="loader">


                </div>

            </div>
        )

}

export default ResetPasswordForm