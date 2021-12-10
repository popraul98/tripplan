import {Link, Navigate, Route, Routes} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login, logout, selectUser, authorization, selectTokens} from "../features/userSlice";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import React, {useState, useEffect, ComponentLifecycle} from "react";
import Select from "react-select";
import Login from "./auth/Login";


const AdminPage = () => {

    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let new_access_token = "";
    let new_refresh_token = "";
    const [listUsers, setListUsers] = useState([]);

    //message for expired session
    const [sentMessage, setSentMessage] = useState(false);

    //logOut & invalidate token after logout
    const handleLogOut = async (e) => {
        let recall = false
        if (tokens.access_token) {
            let token_access = (new_access_token ? new_access_token : tokens.access_token);
            const res = await axios.post("http://127.0.0.1:8000/api/logout", {token_access}, {
                headers: {
                    Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                    refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
                }
            }).catch(function (error) {
                console.log(error)
            });
        }
        new_access_token = "";
        new_access_token = "";
        dispatch(logout());
        if (e == true) {
            navigate('/', {state: {message: "Your session expired!"}});
        } else {
            navigate('/');
        }
    };

    //Check token for user and receive User with Trips (also refresh token)
    // const checkToken = async () => {
    //     new_access_token = "";
    //     new_access_token = "";
    //     if (tokens.access_token != null) {
    //         const need_refresh_token = await axios.get("http://127.0.0.1:8000/api/get-user", {
    //             headers: {
    //                 Authorization: "Bearer " + tokens.access_token,
    //                 refresh_token: tokens.refresh_token,
    //             }
    //         }).then(function (response) {
    //             if (response.status === 200 || response.status === 201) {
    //                 console.log("Token Valabil")
    //                 return false
    //             }
    //         }).catch(function (error) {
    //             console.log(error.response.status, '=access_token')
    //             if (error.response.status === 401) {
    //                 return true;
    //             }
    //         });
    //         if (need_refresh_token === true) {
    //             return await requestNewRefreshToken(tokens.refresh_token);
    //         }
    //     } else {
    //         console.log('You gonna be logout, Token doesn\'t exist')
    //         setSentMessage(true);
    //         handleLogOut(true);
    //     }
    // }

    //Refresh token if needed
    const requestNewRefreshToken = async (refresh_token) => {
        return await axios.get("http://127.0.0.1:8000/api/refresh_token", {
            headers: {
                refresh_token: refresh_token
            }
        }).then(function (response) {
                //if we have a new refresh token
                if (response.data.value === true) {
                    dispatch(authorization({
                        access_token: response.data.tokens.access_token,
                        refresh_token: response.data.tokens.refresh_token,
                    }));
                    console.log('Tokens was refreshed!')
                    new_access_token = response.data.tokens.access_token;
                    new_refresh_token = response.data.tokens.refresh_token
                }
            }
        ).catch(function (error) {
            console.log(error.response.status, "refresh token expired error")
            if (error.response.status === 401) {
                console.log('You gonna be logout')
                setSentMessage(true);
                handleLogOut(true);
                return 401
            }
        });
    }

    // get trips for user
    useEffect(() => {
        console.log("UseEffects")
        if (user != null)
            getListUsers()
    }, [tokens])


    const getListUsers = async () => {
        let recall = false;

        await axios.get("http://127.0.0.1:8000/api/get-list-users", {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(response => {
            console.log("Token Valabil")
            setListUsers(response.data.all_users)
        }).catch(function (error) {
            console.log(error.response.status, 'error server get users list')
            if (error.response.status === 401) {
                recall = true
            }
        });
        if (recall) {
            await requestNewRefreshToken(tokens.refresh_token)
        }
    }


//delete USER (and all his trips)
    const deleteUser = async (id_user) => {
        let recall = false;

        await axios.delete("http://localhost:8000/api/delete-user/" + id_user, {
            headers: {
                Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(response => {
                console.log('Deleted')
                getListUsers()
            }
        ).catch(function (error) {
            console.log(error.response.status, "Error Delete User")
            if (error.response.status === 401) {
                recall = true
            }
        });
        if (recall) {
            if (await requestNewRefreshToken(tokens.refresh_token) !== 401)
                await deleteUser(id_user);
        }

    }

    if (user != null)
        return (
            <div className="content-center bg-gray-100 p-2">
                <h1>Welcome <span className="font-bold">{user.user.name}</span>.
                    You are login as an <span className="font-bold">{user.user.role.name_role}</span></h1>
                <div className="p-5">

                    <div className="-my-2 overflow-x-hidden sm:-mx-6 lg:-mx-8">
                        <h2 className="px-6 py-3 text-left  font-semibold text-sm font-medium text-gray-500 uppercase tracking-wider">
                            List with Users:
                        </h2>
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 ">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nume User
                                        </th>
                                        <th scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email User
                                        </th>
                                        <th scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>

                                        <th scope="col" className=" px-4 py-3">
                                        <span
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                                            Actions
                                        </span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {listUsers.length > 0 ? listUsers.map((user) => (
                                        <tr>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.created_at}</div>
                                            </td>
                                            <td className="pr-10 py-4 whitespace-nowrap flex justify-between text-sm font-medium">
                                                {/*<button*/}
                                                {/*    className="font-semibold mb-1 mr-2 text-indigo-600 hover:text-indigo-900"*/}
                                                {/*    // onClick={() => handleOnClick(trip.id)}*/}
                                                {/*>*/}
                                                {/*    Details*/}
                                                {/*</button>*/}
                                                {/*<a href="#"*/}
                                                {/*   className="text-indigo-600 hover:text-indigo-900 mr-1">Edit</a>*/}
                                                <DeleteIcon
                                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                    onClick={() => deleteUser(user.id)}
                                                />
                                            </td>
                                        </tr>
                                    )) : null}

                                    </tbody>
                                    {listUsers.length === 0 ?
                                        <span className=" p-4 bg-gray-100 flex flex justify-between text-gray-500">
                                        You don't have any user registered
                                    </span> : ""}
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
    else return (
        <Login/>
    )
}

export default AdminPage;