import React from "react";
import { Table, Checkbox, Button } from "flowbite-react";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

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
                    {data.map((row) => (
                        <Table.Row
                            key={row.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800 py-[0.9rem]"
                        >
                            <Table.Cell className="py-[0.9rem]">
                                <Checkbox />
                            </Table.Cell>
                            <Table.Cell className="py-[0.9rem]">
                                {row.id}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white py-[0.9rem] text-[1rem]">
                                {row.firstname}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-[0.9rem] text-[1rem]">
                                {row.surname}
                            </Table.Cell>
                            <Table.Cell className="py-[0.9rem] text-[1rem]">
                                {row.username}
                            </Table.Cell>
                            <Table.Cell className="py-[0.9rem] text-[1rem]">
                                {row.sex}
                            </Table.Cell>
                            <Table.Cell className="py-[0.9rem] text-[1rem]">
                                {row.className}
                            </Table.Cell>
                            {/* <Table.Cell className="flex gap-2 py-[0.9rem] ">
                                <Button size="sm" className="bg-blue-600" pill>
                                    <FiEdit size={20} />
                                </Button>
                                <Button
                                    className="bg-red-700"
                                    size="sm"
                                    onClick={() => openDeleteConfirmModal(row)}
                                    pill
                                >
                                    <MdDeleteOutline size={20} />
                                </Button>
                            </Table.Cell> */}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
export default CustomTableComponent;
