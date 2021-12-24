import React from "react";
import ButtonHome from "../components/user-interface/ButtonHome";

const PageExceptions = ({codeError, messageError, secondMessage}) => {

    return (
        <div
            className="flex items-center justify-center w-screen min-h-screen bg-gray-900 ">

            {codeError ?
                <p className="mr-4 pr-2 font-semibold md:text-7xl lg:text-9xl text-gray-400 border-gray-400 border-r">
                    {codeError}
                </p>
                : <p className="mr-4 pr-2 font-semibold md:text-7xl lg:text-9xl text-gray-400 border-gray-400 border-r">
                    Ops!
                </p>
            }
            <div>
                {messageError ? <div className=" text-gray-400 font-bold text-4xl">{messageError}</div>
                    : <div className=" text-gray-400 font-bold text-4xl">PAGE NOT FOUND</div>
                }
                {secondMessage ?
                    <div className="text-gray-500 text-sm">{secondMessage}</div>
                    : <div className="text-gray-500 text-sm">The page requested could not be found!</div>
                }
                <div className="mt-4">
                    <ButtonHome/>
                </div>
            </div>
        </div>
    )
}

export default PageExceptions;