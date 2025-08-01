import React, { useMemo, useState, useEffect } from "react";
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import {
    Box,
    // Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import * as IconSection from "react-icons/fi";
import NavbarComponent from "../../components/NavBarComponent/NavbarComponent";
import { Button } from "flowbite-react";
import { Spinner } from "flowbite-react";
import CustomTableComponent from "../../components/CustomTableComponents/CustomTableComponent";
import { StudentTableColumns } from "../../../core/TableColumns";
import { BreadcrumbComponent } from "../../components/BreadcrumbComponent/BreadcrumbComponent";
import TableCaptionComponent from "../../components/TableCaptionComponent/TableCaptionComponent";
import { TextInput } from "flowbite-react";
import { FiSearch } from "react-icons/fi";
const showErrorAlert = (title, text) => {
    console.error(`${title}: ${text}`);
};

const showSuccessAlert = (title, text) => {
    console.log(`${title}: ${text}`);
};

const showLoadingAlert = () => {
    console.log("Loading...");
};

const hideLoadingAlert = () => {
    console.log("Loading completed.");
};

const Panel = ({ severity, onClose, children }) => {
    const backgroundColor =
        severity === "success"
            ? "#4CAF50"
            : severity === "error"
            ? "#FF5733"
            : "#f5f5f5";
    const borderColor = severity === "error" ? "red" : "green";

    return (
        <div
            style={{
                border: `1px solid ${borderColor}`,
                padding: "1rem",
                margin: "1rem 0",
                borderRadius: "4px",
                backgroundColor,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>{children}</div>
                <button
                    onClick={onClose}
                    style={{
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "none",
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const Students = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const [students, setStudents] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
    const [creatingUser, setCreatingUser] = useState(false);
    const [newUserData, setNewUserData] = useState({
        firstname: "",
        surname: "",
        className: "",
        sex: "male",
        village: "",
        traditional_authority: "",
        district: "",
        role_name: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);

    const role = window.atob(localStorage.getItem("role"));
    const apiUrl = import.meta.env.VITE_BASE_ENDPOINT;

    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoadingAlert();
                await new Promise((resolve) => setTimeout(resolve, 15));

                const usersResponse = await axios.get(`${apiUrl}students`);
                const classesResponse = await axios.get(`${apiUrl}classes`);
                setStudents(usersResponse?.data?.data);
                setClassOptions(classesResponse?.data);
            } catch (error) {
                showErrorAlert(
                    "Error",
                    "Failed to fetch students. Please try again later."
                );
            } finally {
                hideLoadingAlert();
                setIsLoadingInitialData(false);
            }
        };

        fetchData();
    }, [creatingUser]);

    const createUser = async (values) => {
        try {
            setIsLoadingCreate(true);
            const createData = {
                firstname: values.firstname,
                surname: values.surname,
                className: values.className,
                sex: values.sex,
                village: values.village,
                traditional_authority: values.traditional_authority,
                district: values.district,
            };

            await axios.post(
                "http://127.0.0.1:8000/api/create-student",
                createData
            );
            setSuccessMessage("Student created successfully");
            setCreatingUser(false);
            refreshStudents();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to create student. Please try again later."
            );
        } finally {
            setIsLoadingCreate(false);
        }
    };

    const openDeleteConfirmModal = async (row) => {
        const { id } = row;
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this student!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(
                    `http://127.0.0.1:8000/api/student/${id}`
                );
                if (response.status === 200) {
                    console.log("Student deleted successfully");
                    setStudents((prevUsers) =>
                        prevUsers.filter((user) => user.id !== id)
                    );
                    setSuccessMessage(
                        response.data.message || "Student deleted successfully"
                    );
                } else {
                    console.error("Failed to delete student");
                    setErrorMessage(
                        response.data?.message ||
                            "Failed to delete student. Please try again later."
                    );
                }
            } catch (error) {
                console.error("Error deleting student:", error);
                setErrorMessage(
                    error.response?.data?.message ||
                        "Failed to delete student. Please try again later."
                );
            } finally {
                refreshStudents();
            }
        }
    };

    const refreshStudents = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/students"
            );
            setStudents(response.data);
        } catch (error) {
            console.error("Error refreshing students:", error.message);
        }
    };

    const handleCreateUser = async () => {
        const newValidationErrors = validateUser(newUserData);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        try {
            setCreatingUser(true);
            await createUser(newUserData);
        } catch (error) {
            // Handle error if needed
        }
    };

    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID", size: 80, enableEditing: false },
            {
                accessorKey: "firstname",
                header: "Firstname",
                enableEditing: true,
            },
            { accessorKey: "surname", header: "Surname", enableEditing: true },
            {
                accessorKey: "username",
                header: "Username",
                enableEditing: false,
            },
            {
                accessorKey: "sex",
                header: "Sex",
                enableEditing: false,
            },
            { accessorKey: "className", header: "Class", enableEditing: false },
        ],
        [validationErrors]
    );

    const table = useMaterialReactTable({
        columns,
        data: students,
        createDisplayMode: "modal",
        editDisplayMode: "modal",
        enableEditing: role === "admin",
        getRowId: (row) => row.id,
        renderRowActions: ({ row, table }) =>
            role === "admin" && (
                <Box sx={{ display: "flex", gap: "-1rem" }}>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => table.setEditingRow(row)}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded">
                                <EditIcon sx={{ color: "white" }} />
                            </button>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            color="error"
                            onClick={() => openDeleteConfirmModal(row)}
                        >
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded">
                                <DeleteIcon sx={{ color: "white" }} />
                            </button>
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        renderTopToolbarCustomActions: ({ table }) =>
            role === "admin" && (
                <Button
                    variant="contained"
                    onClick={() => {
                        setCreatingUser(true);
                    }}
                >
                    Add New Student
                </Button>
            ),
    });

    if (isLoadingInitialData) {
        return (
            <>
                <NavbarComponent activePage={"Students"} />
                <BreadcrumbComponent />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60vh",
                    }}
                >
                    <div className="text-center">
                        <Spinner aria-label="Fetching" size="xl" />
                    </div>
                </div>
            </>
        );
    }
    return (
        // TODO Here is the student page

        <div className=" w-full h-full">
            <NavbarComponent activePage={"Students"} />
            <BreadcrumbComponent />
            <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
                {successMessage && (
                    <Alert
                        severity="success"
                        onClose={() => setSuccessMessage("")}
                        sx={{ marginBottom: "1rem" }}
                    >
                        {successMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert
                        severity="error"
                        onClose={() => setErrorMessage("")}
                        sx={{ marginBottom: "1rem" }}
                    >
                        {errorMessage}
                    </Alert>
                )}

                {creatingUser && (
                    <Dialog
                        open={creatingUser}
                        onClose={() => setCreatingUser(false)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle
                            sx={{
                                backgroundColor: "#0d1926",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            Add New Student
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "24px",
                                padding: "24px",
                            }}
                        >
                            <form>
                                <TextField
                                    label="Firstname"
                                    variant="outlined"
                                    fullWidth
                                    value={newUserData.firstname}
                                    onChange={(e) =>
                                        setNewUserData({
                                            ...newUserData,
                                            firstname: e.target.value,
                                        })
                                    }
                                    error={!!validationErrors.firstname}
                                    helperText={validationErrors.firstname}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Surname"
                                    variant="outlined"
                                    fullWidth
                                    value={newUserData.surname}
                                    onChange={(e) =>
                                        setNewUserData({
                                            ...newUserData,
                                            surname: e.target.value,
                                        })
                                    }
                                    error={!!validationErrors.surname}
                                    helperText={validationErrors.surname}
                                    sx={{ marginBottom: 2 }}
                                />
                                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        value={newUserData.className}
                                        onChange={(e) =>
                                            setNewUserData({
                                                ...newUserData,
                                                className: e.target.value,
                                            })
                                        }
                                    >
                                        {classOptions.map((classOption) => (
                                            <MenuItem
                                                key={classOption.id}
                                                value={classOption.className}
                                            >
                                                {classOption.className}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl
                                    component="fieldset"
                                    sx={{ marginBottom: 1 }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        Sex
                                    </Typography>
                                    <RadioGroup
                                        row
                                        value={newUserData.sex}
                                        onChange={(e) =>
                                            setNewUserData({
                                                ...newUserData,
                                                sex: e.target.value,
                                            })
                                        }
                                    >
                                        <FormControlLabel
                                            value="male"
                                            control={<Radio />}
                                            label="Male"
                                        />
                                        <FormControlLabel
                                            value="female"
                                            control={<Radio />}
                                            label="Female"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </form>
                            <form>
                                <TextField
                                    label="Village"
                                    variant="outlined"
                                    fullWidth
                                    value={newUserData.village}
                                    onChange={(e) =>
                                        setNewUserData({
                                            ...newUserData,
                                            village: e.target.value,
                                        })
                                    }
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Traditional Authority"
                                    variant="outlined"
                                    fullWidth
                                    value={newUserData.traditional_authority}
                                    onChange={(e) =>
                                        setNewUserData({
                                            ...newUserData,
                                            traditional_authority:
                                                e.target.value,
                                        })
                                    }
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="District"
                                    variant="outlined"
                                    fullWidth
                                    value={newUserData.district}
                                    onChange={(e) =>
                                        setNewUserData({
                                            ...newUserData,
                                            district: e.target.value,
                                        })
                                    }
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Role Name"
                                    variant="outlined"
                                    fullWidth
                                    value={newUserData.role_name}
                                    onChange={(e) =>
                                        setNewUserData({
                                            ...newUserData,
                                            role_name: e.target.value,
                                        })
                                    }
                                    sx={{ marginBottom: 2 }}
                                />
                            </form>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                backgroundColor: "#0d1926",
                                padding: "16px",
                            }}
                        >
                            <Button
                                color="inherit"
                                variant="outlined"
                                startIcon={<IconSection.FiX />}
                                onClick={() => setCreatingUser(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="inherit"
                                variant="contained"
                                startIcon={<IconSection.FiCheck />}
                                onClick={handleCreateUser}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>

            <div className="pr-4 pl-4">
                <TableCaptionComponent role={"Student"} />
                <div className="px-1 pr-2">
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
                    {}
                    {/* todo include the following here onClick={() => openDeleteConfirmModal(row) */}
                    <CustomTableComponent
                        data={students}
                        columns={StudentTableColumns}
                    /> 
                </div>
            </div>
        </div>
    );
};
const validateUser = (user) => {
    return {
        firstname: !validateRequired(user.firstname)
            ? "Firstname is Required"
            : "",
        surname: !validateRequired(user.surname) ? "Surname is Required" : "",
    };
};

const validateRequired = (value) => !!value.trim();

export default Students;
