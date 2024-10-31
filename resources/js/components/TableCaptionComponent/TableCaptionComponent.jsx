import React from "react";
import { HiPlus } from "react-icons/hi";
import { Button } from "flowbite-react";
import { roRO } from "@mui/x-date-pickers";
const TableCaptionComponent = (props) => {
    const { role  } = props;
    return (
        <div className="flex bg-[#F9FAFB] flex-row justify-between">
            <div className=" w-full pr-5 pl-5 pt-2 pb-3 text-lg font-semibold text-left text-gray-900  dark:text-white dark:bg-gray-800 ">
                {role} List
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                    A list of all {role} in the system
                </p>
            </div>
            <div className="p-4">
                <Button color="blue" size="sm" className="w-max">
                    <HiPlus className="mt-1 mr-2 h-3 w-3" />
                    <span className="font-semibold">New {role}</span>
                </Button>
            </div>
        </div>
    );
};

export default TableCaptionComponent;
