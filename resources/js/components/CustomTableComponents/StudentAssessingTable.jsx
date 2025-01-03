import React from "react";
import { Table, Checkbox, Button } from "flowbite-react";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { HiMiniEye } from "react-icons/hi2";
import { blue } from "@mui/material/colors";

const StudentAssessingTable = (props) => {
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
                            className="text-black dark:text-black font-bold"
                        >
                            {column.Header}
                        </Table.HeadCell>
                    ))}
                </Table.Head>
                <Table.Body className="divide-y">
                    {data.map((row) => (
                        <Table.Row
                            key={row.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800 py-[0.9rem]"
                        >
                            <Table.Cell>
                                <Checkbox />
                            </Table.Cell>
                            <Table.Cell>{row.id}</Table.Cell>
                            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white py-[0.9rem] text-base">
                                {row.firstname}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap  dark:text-white py-[0.9rem] text-base">
                                {row.surname}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap  dark:text-white py-[0.9rem] text-base">
                                {row.username}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap  dark:text-white py-[0.9rem] text-base">
                                {row.sex}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap  dark:text-white py-[0.9rem] text-base">
                                {row.className}
                            </Table.Cell>
                            <Table.Cell className="flex gap-2">
                                <HiMiniEye
                                    color="gray"
                                    className="cursor-pointer hover:scale-110"
                                    size={25}
                                />
                                <CiEdit
                                    color="blue"
                                    className="cursor-pointer hover:scale-110"
                                    size={25}
                                />

                                <MdDeleteOutline
                                    color="red"
                                    className="cursor-pointer hover:scale-110"
                                    size={25}
                                    onClick={() => openDeleteConfirmModal(row)}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
export default StudentAssessingTable;
