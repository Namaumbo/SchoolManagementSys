import React from "react";

export default function TableComponent({ data }) {
    const tableHeader =
        "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider";

    console.log(data);

    function formatDate(date) {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    const formatRoleMap = {
        admin: "Admin",
        student: "Student",
        teacher: "Teacher",
        parent: "Parent",
    };
    function formatRole(role) {
        return formatRoleMap[role] || "Unknown";
    }

    const formatSexMap = {
        male: "Male",
        female: "Female",
    };
    function formatSex(sex) {
        const value = sex.toLowerCase().trim();
        return formatSexMap[value] || "Unknown";
    }

    return (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">AVAILABLE USERS</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead>
                        <tr>
                            <th className={tableHeader}>FULLNAME</th>
                            <th className={tableHeader}>EMAIL</th>
                            <th className={tableHeader}>SEX</th>
                            <th className={tableHeader}>CREATED</th>
                            <th className={tableHeader}>ROLE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                        <span className="">
                                            {user.firstname} {user.surname}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                        <span className="">
                                            {formatSex(user.sex)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(user.created_at)}
                                    </td>
                                    <td>
                                        <span
                                            className={` border-[3px] border-blue-500 ${
                                                user.role_name.toLowerCase() ===
                                                "administrator"
                                                    ? "font-bold text-blue-500 p-2 rounded-lg  "
                                                    : ""
                                            }`}
                                        >
                                            {user.role_name}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
