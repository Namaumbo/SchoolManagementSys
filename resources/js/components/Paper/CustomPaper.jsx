import * as React from "react";
import { BiBell } from "react-icons/bi";

export default function CustomPaper({ ...props }) {
    const { heading, count } = props;
    return (
        <>
            <div className="bg-white p-3 rounded-2xl flex flex-col justify-start">
                <div className="flex flex-row items-center p-2">
                    <div className="bg-blue-100 p-[0.65rem] w-fit rounded-full">
                        <BiBell size={23} color="blue" />
                    </div>
                    <div className="ml-2">
                        <p className="text-[18px] font-bold"> {heading}</p>
                    </div>
                </div>
                <div className>
                    <p className=" text-5xl font-medium pl-4">{count}</p>
                </div>
                <hr className="p-1" />
                <p>This is the total of registered users in the system</p>
            </div>
        </>
    );
}
