import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
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
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import "./users.css"; // Import the CSS file
import { size } from "lodash";
import NavbarComponent from "../../NavBarComponent/NavbarComponent";

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
        const timer = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/users");
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

    const handleCloseViewModal = () => {
        setSelectedUser(null);
        setIsViewModalOpen(false);
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
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => handleOpenModal(row.original)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => handleDeleteUser(row.original.id)}
                        >
                            <DeleteIcon sx={{ color: "red" }} />
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
            <Container>
                <Box
                    mb={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginTop="15px"
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal()}
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                        Add User
                    </Button>
                </Box>

                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <Fade in={isModalOpen}>
                        <Paper
                            sx={{
                                p: 4,
                                width: "600px",
                                maxWidth: "90%",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                borderRadius: 2,
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="h2"
                                fontWeight="bold"
                                mb={3}
                            >
                                {selectedUser ? "Edit User" : "Add User"}
                            </Typography>
                            <Box component="form" mt={2}>
                                <Grid container spacing={3}>
                                    {[
                                        "title",
                                        "firstname",
                                        "surname",
                                        "email",
                                        "password",
                                        "sex",
                                        "village",
                                        "traditional_authority",
                                        "district",
                                        "role_name",
                                    ].map((field) => (
                                        <Grid item xs={12} sm={6} key={field}>
                                            <TextField
                                                name={field}
                                                label={
                                                    field
                                                        .replace("_", " ")
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    field
                                                        .replace("_", " ")
                                                        .slice(1)
                                                }
                                                value={formValues[field]}
                                                onChange={handleChange}
                                                fullWidth
                                                required={
                                                    field !== "sex" &&
                                                    field !== "village" &&
                                                    field !==
                                                        "traditional_authority" &&
                                                    field !== "district" &&
                                                    field !== "role_name"
                                                }
                                                type={
                                                    field === "password"
                                                        ? "password"
                                                        : "text"
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            variant="outlined"
                                        >
                                            <InputLabel>Departments</InputLabel>
                                            <Select
                                                name="departments"
                                                value={formValues.departments}
                                                onChange={(e) =>
                                                    setFormValues({
                                                        ...formValues,
                                                        departments:
                                                            e.target.value,
                                                    })
                                                }
                                                multiple
                                                required
                                                label="Departments"
                                            >
                                                {departments.map(
                                                    (department) => (
                                                        <MenuItem
                                                            key={department.id}
                                                            value={
                                                                department.id
                                                            }
                                                        >
                                                            {
                                                                department.departmentName
                                                            }
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box
                                    mt={4}
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleCloseModal}
                                        sx={{
                                            mr: 2,
                                            borderRadius: "20px",
                                            textTransform: "none",
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveUser}
                                        sx={{
                                            borderRadius: "20px",
                                            textTransform: "none",
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Fade>
                </Modal>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                >
                    <Alert
                        severity={snackbar.severity}
                        onClose={() =>
                            setSnackbar({ ...snackbar, open: false })
                        }
                        variant="filled"
                        elevation={6}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                <Box sx={{ height: 600, width: "100%" }}>
                    <MaterialReactTable
                        columns={columns}
                        data={users}
                        enableColumnFilters
                        enableGlobalFilter
                        enablePagination
                        enableSorting
                        muiTableProps={{
                            sx: {
                                tableLayout: "fixed",
                                padding: "0",
                            },
                        }}
                        muiTableHeadCellProps={{
                            sx: {
                                fontWeight: "bolder",
                                backgroundColor: "",
                                color: "black",
                            },
                        }}
                    />
                </Box>
            </Container>
            {/* 
               
         */}
        </div>
    );
};

export default UserManagement;
