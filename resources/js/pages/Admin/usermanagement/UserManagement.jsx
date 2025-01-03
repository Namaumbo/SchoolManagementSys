import React, { useState, useEffect } from "react";
import axios from "axios";
import "./users.css";
import NavbarComponent from "../../../components/NavBarComponent/NavbarComponent";
import { BreadcrumbComponent } from "../../../components/BreadcrumbComponent/BreadcrumbComponent";
import CustomTableComponent from "../../../components/CustomTableComponents/CustomTableComponent";
import { UserManagementTableColumns } from "../../../../core/TableColumns";
import { TextInput } from "flowbite-react";
import TableCaptionComponent from "../../../components/TableCaptionComponent/TableCaptionComponent";
import { FiSearch } from "react-icons/fi";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        title: "",
        firstname: "",
        surname: "",
        email: "",
        password: "",
        sex: "",
        village: "",
        traditional_authority: "",
        district: "",
        role_name: "",
        departments: [],
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [currentDateTime, setCurrentDateTime] = useState(
        new Date().toLocaleString()
    );

    useEffect(() => {
        fetchUsers();
        // fetchDepartments();
        // seedStudents(); // Add initial students
    }, []);

    const seedStudents = async () => {
        const studentData = [
            {
                title: "Mr",
                firstname: "John",
                surname: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                sex: "Male",
                village: "Village1",
                traditional_authority: "TA1",
                district: "District1",
                role_name: "student",
            },
            {
                title: "Ms",
                firstname: "Jane",
                surname: "Smith",
                email: "jane.smith@example.com",
                password: "password123",
                sex: "Female",
                village: "Village2",
                traditional_authority: "TA2",
                district: "District2",
                role_name: "student",
            },
            {
                title: "Mr",
                firstname: "Michael",
                surname: "Johnson",
                email: "michael.j@example.com",
                password: "password123",
                sex: "Male",
                village: "Village3",
                traditional_authority: "TA3",
                district: "District3",
                role_name: "student",
            },
            {
                title: "Ms",
                firstname: "Sarah",
                surname: "Williams",
                email: "sarah.w@example.com",
                password: "password123",
                sex: "Female",
                village: "Village4",
                traditional_authority: "TA4",
                district: "District4",
                role_name: "student",
            },
            {
                title: "Mr",
                firstname: "David",
                surname: "Brown",
                email: "david.b@example.com",
                password: "password123",
                sex: "Male",
                village: "Village5",
                traditional_authority: "TA5",
                district: "District5",
                role_name: "student",
            },
            {
                title: "Ms",
                firstname: "Emily",
                surname: "Davis",
                email: "emily.d@example.com",
                password: "password123",
                sex: "Female",
                village: "Village6",
                traditional_authority: "TA6",
                district: "District6",
                role_name: "student",
            },
            {
                title: "Mr",
                firstname: "James",
                surname: "Wilson",
                email: "james.w@example.com",
                password: "password123",
                sex: "Male",
                village: "Village7",
                traditional_authority: "TA7",
                district: "District7",
                role_name: "student",
            },
            {
                title: "Ms",
                firstname: "Emma",
                surname: "Taylor",
                email: "emma.t@example.com",
                password: "password123",
                sex: "Female",
                village: "Village8",
                traditional_authority: "TA8",
                district: "District8",
                role_name: "student",
            },
            {
                title: "Mr",
                firstname: "Daniel",
                surname: "Anderson",
                email: "daniel.a@example.com",
                password: "password123",
                sex: "Male",
                village: "Village9",
                traditional_authority: "TA9",
                district: "District9",
                role_name: "student",
            },
            {
                title: "Ms",
                firstname: "Olivia",
                surname: "Thomas",
                email: "olivia.t@example.com",
                password: "password123",
                sex: "Female",
                village: "Village10",
                traditional_authority: "TA10",
                district: "District10",
                role_name: "student",
            },
        ];

        try {
            // for (const student of studentData) {
            //     await axios.post("http://127.0.0.1:8000/api/register-user", student);
            // }
            setSnackbar({
                open: true,
                message: "Students seeded successfully",
                severity: "success",
            });
            fetchUsers();
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error seeding students",
                severity: "error",
            });
        }
    };

    const fetchUsers = async () => {
        try {
            const apiUrl = import.meta.env.VITE_BASE_ENDPOINT;

            const response = await axios.get(`${apiUrl}users`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            });

            if (
                response.data &&
                response.data.users &&
                Array.isArray(response.data.users)
            ) {
                setUsers(response.data.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            setUsers([]);
            setSnackbar({
                open: true,
                message: "Error fetching users",
                severity: "error",
            });
        }
    };
    return (
        <div>
            <NavbarComponent activePage={"User Management"} />
            <div className=" pb-4">
                <BreadcrumbComponent />
            </div>
            <div className="pl-4 pr-4 ">
                <TableCaptionComponent role={"User"} />
                <div className="bg-[#F9FAFB] flex flex-row items-center ">
                    <form className="flex max-w-md flex-col pt-[-4rem] mt-[-2%] mb-[-1%] w-[50%]">
                        <TextInput
                            id="name"
                            type="text"
                            placeholder="search for a user by first / last / full name "
                            required
                        />
                    </form>
                    <FiSearch
                        className="mb-3 cursor-pointer hover:scale-110"
                        size={25}
                    />
                </div>
                <CustomTableComponent
                    columns={UserManagementTableColumns}
                    data={users}
                />
            </div>
        </div>
    );
};
export default UserManagement;
