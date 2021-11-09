import {Link, Navigate, Route, Routes} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login, logout, selectUser} from "../features/userSlice";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import {useState, useEffect} from "react";
import AddTripModal from "./AddTripModal"

const Home = (props) => {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const handleLogOut = (e) => {
        e.preventDefault();

        dispatch(logout());
    };

    const [trips, setTrips] = useState([])
    const getTrips = async () => {
        const tripsFromServer = await fetchTrips()
        setTrips(tripsFromServer)
    }

    useEffect(() => {
        getTrips()
    }, [])

    //get Trips from server
    const fetchTrips = async () => {
        const res = await axios.post("http://127.0.0.1:8000/api/get-trips/", user)
        const data = await res.data
        return data.trips
    }

    //delete Trip from Server
    const deleteTrip = async (id_trip) => {
        await axios.delete("http://localhost:8000/api/delete-trip/" + id_trip)
            .then(response => {
                    console.log('Deleted')
                    getTrips()
                }
            )

    }

    const [modalIsOpen, setModalIsOpen] = useState(false)

    return (
        <div className="content-center bg-gray-100 p-2">
            <h1>Welcome <span className="font-bold">{user.email}</span></h1>
            <div className="p-5">

                <AddTripModal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                    Add a new Trip
                </AddTripModal>
                <button
                    className="bg-gray-400 hover:bg-gray-600 mb-2 text-white font-semibold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline"
                    onClick={() => setModalIsOpen(true)}
                >
                    <AddIcon/>Add a new Trips
                </button>

                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 ">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Destination
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                                        Comment
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {trips.length > 0 ? trips.map((trip) => (
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {trip.destination}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{trip.start_date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {trip.end_date}
                                     </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate ">
                                            {trip.comment}
                                        </td>
                                        <td className="pr-10 py-4 whitespace-nowrap flex justify-between text-sm font-medium">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900"> Edit</a>
                                            <DeleteIcon
                                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                onClick={() => deleteTrip(trip.id)}
                                            />
                                        </td>
                                    </tr>
                                )) : ""}
                                </tbody>
                                {trips.length === 0 ?
                                    <div className=" p-4 bg-gray-100 flex flex justify-between text-gray-500">You don't
                                        have any records</div> : ""}

                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={(e) => handleLogOut(e)}
            >
                LogOut
            </button>
        </div>
    )
}

export default Home;