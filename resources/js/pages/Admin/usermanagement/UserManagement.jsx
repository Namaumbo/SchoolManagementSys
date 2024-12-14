import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Modal,
    Paper,
    Fade,
    TextField,
    Grid,
    Container,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    People as PeopleIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./users.css"; // Import the CSS file
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
        departments: [], // Array to hold selected departments
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
        fetchDepartments();
    }, []);

    const fetchUsers = async () => {
        try {
            const apiUrl = import.meta.env.VITE_BASE_ENDPOINT;
            const response = await axios.get(`${apiUrl}users`, {
                withCredentials: true,
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
                console.log(response.data.users);
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

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/departments"
            );
            if (response.data && Array.isArray(response.data)) {
                setDepartments(response.data);
            } else {
                setDepartments([]);
            }
        } catch (error) {
            setDepartments([]);
            setSnackbar({
                open: true,
                message: "Error fetching departments",
                severity: "error",
            });
        }
    };

    const handleSaveUser = async () => {
        try {
            let response;
            if (selectedUser) {
                response = await axios.put(
                    `http://127.0.0.1:8000/api/user/${selectedUser.id}`,
                    formValues
                );
            } else {
                response = await axios.post(
                    "http://127.0.0.1:8000/api/register-user",
                    formValues
                );
            }
            fetchUsers();
            handleCloseModal();
            setSnackbar({
                open: true,
                message: "User saved successfully",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error saving user",
                severity: "error",
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/user/${userId}`);
            fetchUsers();
            setSnackbar({
                open: true,
                message: "User deleted successfully",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error deleting user",
                severity: "error",
            });
        }
    };

    const handleOpenModal = (user = null) => {
        setSelectedUser(user);
        if (user) {
            setFormValues({
                title: user.title,
                firstname: user.firstname,
                surname: user.surname,
                email: user.email,
                password: "",
                sex: user.sex,
                village: user.village,
                traditional_authority: user.traditional_authority,
                district: user.district,
                role_name: user.role_name,
                departments: user.departments.map(
                    (department) => department.id
                ), // Populate department IDs
            });
        } else {
            setFormValues({
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
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const columns = [
        { accessorKey: "id", header: "ID", size: 20 },
        { accessorKey: "title", header: "Title", size: 50 },
        { accessorKey: "firstname", header: "First Name", size: 100 },
        { accessorKey: "surname", header: "Surname", size: 100 },
        { accessorKey: "sex", header: "Sex", size: 50 },
        { accessorKey: "email", header: "Email", size: 100 },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box>
                    <Tooltip title="View">
                        <IconButton
                            onClick={() => handleViewUser(row.original)}
                        >
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded">
                                <VisibilityIcon sx={{ color: "white" }} />
                            </button>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => handleOpenModal(row.original)}
                        >
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded">
                                <EditIcon sx={{ color: "white" }} />
                            </button>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => handleDeleteUser(row.original.id)}
                        >
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded">
                                <DeleteIcon sx={{ color: "white" }} />
                            </button>
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            size: 100,
        },
    ];
    return (
        <div>
            <NavbarComponent activePage={"User Management"} />
            <div className=" pb-4">
                <BreadcrumbComponent />
            </div>
            <div className="pl-4 pr-4 ">
                <TableCaptionComponent role={"Users"} />
                <div className="bg-[#F9FAFB] flex flex-row items-center ">
                    <form className="flex max-w-md flex-col pt-[-4rem] mt-[-2%] mb-[-1%] w-[50%]">
                        <TextInput
                            id="email1"
                            type="email"
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
