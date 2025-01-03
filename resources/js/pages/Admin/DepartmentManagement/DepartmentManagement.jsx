import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
    Modal,
    Paper,
    Fade,
    TextField,
    Grid,
    Container,
    CircularProgress,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import DepartmentCard from "./DepartmentCard";
import DepartmentUsers from "./DepartmentUsers";
import { useNavigate } from "react-router-dom";
import "./department.css";
import NavbarComponent from "../../../components/NavBarComponent/NavbarComponent";
import { BreadcrumbComponent } from "../../../components/BreadcrumbComponent/BreadcrumbComponent";

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        departmentName: "",
        headOfDepartment: "",
        description: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [isLoading, setIsLoading] = useState(false);
    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
        fetchUsers();
    }, []);

    const fetchDepartments = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/departments"
            );
            if (response.data && Array.isArray(response.data)) {
                setDepartments(response.data);
                console.log(response.data)
            } else {
                setDepartments([]);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error fetching departments",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/headOfDepartments"
            );
            if (response.data && Array.isArray(response.data.users)) {
                setUsers(response.data.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error fetching users",
                severity: "error",
            });
        }
    };

    const handleSaveDepartment = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/register-department",
                formValues
            );
            fetchDepartments();
            handleCloseModal();
            setSnackbar({
                open: true,
                message: "Department saved successfully",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message || "Error saving department",
                severity: "error",
            });
        }
    };

    const handleOpenModal = () => {
        setFormValues({
            departmentName: "",
            headOfDepartment: "",
            description: "",
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleViewUsers = (departmentId) => {
        navigate(`/department/${departmentId}/users`);
    };

    const isAdminOrHeadTeacher =
        window.atob(loggedIn) && window.atob(role) === "admin";
    const isHeadOfDepartment =
        window.atob(loggedIn) && window.atob(role) === "Head Of Department";

    if (isAdminOrHeadTeacher) {
        return (
            <>
                {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Department Management</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            <AddIcon /> Add Department
          </Button>
        </Box> */}

                {/* {isLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box className="department-container">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onCardClick={() => handleViewUsers(department.id)}
              />
            ))}
          </Box>
        )} */}

                <NavbarComponent activePage="Department Management" />
                <BreadcrumbComponent />

                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <Fade in={isModalOpen}>
                        <Paper
                            sx={{
                                p: 3,
                                width: "600px",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <Typography variant="h5">Add Department</Typography>
                            <Box component="form" mt={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="departmentName"
                                            label="Department Name"
                                            value={formValues.departmentName}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required>
                                            <InputLabel>
                                                Head of Department
                                            </InputLabel>
                                            <Select
                                                name="headOfDepartment"
                                                value={
                                                    formValues.headOfDepartment
                                                }
                                                onChange={handleChange}
                                            >
                                                {users.map((user) => (
                                                    <MenuItem
                                                        key={user.id}
                                                        value={user.email}
                                                    >
                                                        {user.email}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="description"
                                            label="Description"
                                            value={formValues.description}
                                            onChange={handleChange}
                                            fullWidth
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                </Grid>
                                <Box
                                    mt={2}
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveDepartment}
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
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert
                        onClose={() =>
                            setSnackbar({ ...snackbar, open: false })
                        }
                        severity={snackbar.severity}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </>
        );
    } else if (isHeadOfDepartment) {
        return (
            <>
                <DepartmentUsers />
            </>
        );
    }

    return null;
};

export default DepartmentManagement;
