import React from "react";
import { Table, Checkbox, Button } from "flowbite-react";

import { Badge } from "flowbite-react";

const UserTableComponent = (props) => {
    const { data, columns } = props;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[20px] font-bold">Users Available</h2>
                <Button>
                    <p className="font-bold">See More</p>
                </Button>
            </div>
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
                                <Table.Cell className="py-[1rem]">
                                    <Checkbox />
                                </Table.Cell>
                                <Table.Cell className="py-[1rem]">
                                    {row.id}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white py-[0.9rem] text-[1rem]">
                                    {row.firstName}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-[0.9rem] text-[1rem]">
                                    {row.lastName}
                                </Table.Cell>
                                <Table.Cell className="py-[1rem] text-[6rem]">
                                    {row.role === "Administrator" ? (
                                        <Badge color="success">
                                            <span className="font-bold">
                                                Administrator
                                            </span>
                                        </Badge>
                                    ) : row.role === "Teacher" ? (
                                        <Badge color="info">
                                            <span className="font-bold">
                                                Teacher
                                            </span>
                                        </Badge>
                                    ) : row.role === "HeadOfDepartment" ? (
                                        <Badge color="warning">
                                            <span className="font-bold">
                                                Head Of Department
                                            </span>
                                        </Badge>
                                    ) : (
                                        <Badge color="gray">{row.role}</Badge>
                                    )}
                                </Table.Cell>
                                <Table.Cell className="py-[0.9rem] text-[1rem]">
                                    {row.email}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
};
export default UserTableComponent;
