import axios from "axios";

const ResetPassword = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
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
                />
                <button
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Submit
                </button>
            </div>
        </form>
    )

}

export default ResetPassword