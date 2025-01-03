import React from "react";

import { ModalComponent } from "../ModalComponent/ModalComponent";
const TableCaptionComponent = (props) => {
    const { role } = props;
    return (
        <div className="flex bg-[#F9FAFB] flex-row justify-between  items-center">
            <div className=" w-full pr-5 pl-5 pt-2 pb-3 text-lg font-semibold text-left text-gray-900  dark:text-white dark:bg-gray-800 ">
                <h3 className="font-bold text-[1.5rem]">{role} List</h3>
                <p className="mt-1 text-[1rem] font-normal text-gray-500 dark:text-gray-400">
                    A list of all {role} in the system
                </p>
            </div>
            <div className="p-1 flex flex-row justify-center  items-center">
                <div>
                    <ModalComponent role={role} />
                </div>
            </div>
        </div>
    );
};

export default TableCaptionComponent;
