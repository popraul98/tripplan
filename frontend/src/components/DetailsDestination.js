import React, {useEffect, useState} from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {useSelector} from "react-redux";
import {selectTokens, selectUser} from "../features/userSlice";
import {useParams} from "react-router-dom";


const DetailsDestination = () => {

    let {id} = useParams();

    const user = useSelector(selectUser);
    const tokens = useSelector(selectTokens)

    const fetchTrip = async () => {
        await axios.post("http://127.0.0.1:8000/api/get-trip/", {
            headers: {
                // Authorization: "Bearer " + (new_access_token ? new_access_token : tokens.access_token),
                // refresh_token: (new_refresh_token ? new_refresh_token : tokens.refresh_token),
            }
        }).then(function (response) {
            console.log(response.data)
        }).catch(function (error) {
            console.log(error)
        });
    }

    useEffect(() => {
        console.log(id)
        if (id)
            fetchTrip()
    }, [])


    return (
        <div className="bg-gradient-to-b from-indigo-100 to-transparent">

            <div className="flex justify-between max-w-2x ">
                <div className="float-left p-5 max-w-xl">
                    <button
                        className=" mb-2 rounded-lg hover:bg-gray-500 px-5 hover:text-gray-800 bg-gray-400 text-white">
                        <ArrowBackIcon/>
                    </button>
                    <p className="p-2 text-white text-2xl max-w-xs bg-gradient-to-r from-blue-400 to-transparent mb-2 bg-opacity-60 rounded-r-3xl ">
                        {/*{trip.destination}*/}
                        Elvetia
                    </p>
                    <table>
                        <tr className="">
                            <th className="text-gray-500 text-sm font-semibold">Start Date:</th>
                            <th className="text-gray-500 text-sm font-semibold">End Date:</th>
                        </tr>
                        <tr>
                            <td className=" text-gray-600 rounded-r-full ">14-10-2021</td>
                            <td className=" text-gray-600 rounded-r-full ">14-10-2021</td>
                        </tr>
                    </table>
                    <p className="mt-4 border-t border-gray-300 shadow-t p-2 max-w-lg text-ellipsis text-gray-600 mb-2  rounded-lg ">
                        {/*{trip.comment}*/}
                        Comentriu demo commmentariu comen acesta este un comenatariu de proba. Face sau nu face
                        hidden
                    </p>
                </div>
                <div className="float right ">
                    {/*<iframe*/}
                    {/*    width="550"*/}
                    {/*    height="350"*/}
                    {/*    frameBorder="0"*/}
                    {/*    src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyD1viFL9PIqRrQ159iA5-pGQ_mKQn-tt14&q=" + trip.destination}>*/}
                    {/*    Map Loading*/}
                    {/*</iframe> */}
                    <iframe
                        width="550"
                        height="350"
                        src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyD1viFL9PIqRrQ159iA5-pGQ_mKQn-tt14&q=Elvetia"}>
                    </iframe>
                </div>
            </div>

        </div>
    )
}

export default DetailsDestination;
