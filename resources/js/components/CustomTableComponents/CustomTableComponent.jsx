import React from "react";
import { Table, Checkbox } from "flowbite-react";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const CustomTableComponent = (props) => {
    const { data, columns } = props;

    return (
        <div className="overflow-x-auto">
            <Table striped>
                <Table.Head>
                    <Table.HeadCell>
                        <Checkbox />
                    </Table.HeadCell>
                    {columns.map((column) => (
                        <Table.HeadCell
                            key={column.Header}
                            className="text-black dark:text-black font-bold text-[1rem]"
                        >
                            {column.Header}
                        </Table.HeadCell>
                    ))}
                </Table.Head>
                <Table.Body className="divide-y">
                    {data.length === 0 ? (
                        <Table.Row>
                            <Table.Cell colSpan={columns.length + 1}>
                                <h1 className="text-xl text-center">No data</h1>
                            </Table.Cell>
                        </Table.Row>
                    ) : (
                        data.map((row) => (
                            <Table.Row
                                key={row.id}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800 py-[0.9rem]"
                            >
                                <Table.Cell className="">
                                    <Checkbox />
                                </Table.Cell>
                                <Table.Cell className="">{row.id}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white py-[0.9rem] text-base">
                                    {row.title}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap  dark:text-white py-[0.9rem] text-base">
                                    {row.firstname}
                                </Table.Cell>
                                <Table.Cell className=" font-medium text-base">
                                    {row.surname}
                                </Table.Cell>
                                <Table.Cell className=" text-base">
                                    <span
                                        className={`px-2 py-2 font-bold rounded-full ${
                                            row.role_name === "Teacher"
                                                ? "bg-orange-400 text-white"
                                                : row.role_name ===
                                                  "Administrator"
                                                ? "bg-green-400 text-white"
                                                : "bg-blue-500 text-white"
                                        }`}
                                    >
                                        {row.role_name}
                                    </span>
                                </Table.Cell>
                                <Table.Cell className=" text-gray-900 text-base">
                                    {row.email}
                                </Table.Cell>
                                <Table.Cell className="flex gap-2 py-[0.9rem] ">
                                    <CiEdit
                                        color="blue"
                                        className="cursor-pointer hover:scale-110"
                                        size={25}
                                    />
                                    <MdDeleteOutline
                                        color="red"
                                        className="cursor-pointer hover:scale-110"
                                        size={25}
                                        onClick={() =>
                                            openDeleteConfirmModal(row)
                                        }
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>
        </div>
    );
};
export default CustomTableComponent;
