import React from "react";
import { Table, Checkbox, Button } from "flowbite-react";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit, FiEye } from "react-icons/fi";

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
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell>
                                <Checkbox />
                            </Table.Cell>
                            <Table.Cell>{row.id}</Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {row.firstname}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {row.surname}
                            </Table.Cell>
                            <Table.Cell>{row.username}</Table.Cell>
                            <Table.Cell>{row.sex}</Table.Cell>
                            <Table.Cell>{row.className}</Table.Cell>
                            <Table.Cell className="flex gap-2">
                                <Button size="sm" pill>
                                    <FiEye className="h-4 w-4" />
                                </Button>
                                <Button color="blue" size="sm" pill>
                                    <FiEdit className="h-4 w-4" />
                                </Button>
                                <Button
                                    color="failure"
                                    size="sm"
                                    pill
                                    onClick={() => openDeleteConfirmModal(row)}
                                >
                                    <MdDeleteOutline className="h-4 w-4" />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
export default StudentAssessingTable;
