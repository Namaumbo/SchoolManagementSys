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
import './users.css'; // Import the CSS file

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());

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
      if (response.data && response.data.users && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
      setSnackbar({ open: true, message: "Error fetching users", severity: "error" });
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/departments");
      if (response.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      setDepartments([]);
      setSnackbar({ open: true, message: "Error fetching departments", severity: "error" });
    }
  };

  const handleSaveUser = async () => {
    try {
      let response;
      if (selectedUser) {
        response = await axios.put(`http://127.0.0.1:8000/api/user/${selectedUser.id}`, formValues);
      } else {
        response = await axios.post("http://127.0.0.1:8000/api/register-user", formValues);
      }
      fetchUsers();
      handleCloseModal();
      setSnackbar({ open: true, message: "User saved successfully", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error saving user", severity: "error" });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/user/${userId}`);
      fetchUsers();
      setSnackbar({ open: true, message: "User deleted successfully", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting user", severity: "error" });
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
        departments: user.departments.map((department) => department.id), // Populate department IDs
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
    { accessorKey: "id", header: "ID" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "surname", header: "Surname" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box>
          <Tooltip title="View">
            <IconButton onClick={() => handleViewUser(row.original)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenModal(row.original)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteUser(row.original.id)}>
              <DeleteIcon sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Container className="user-tb" sx={{ backgroundColor: "#f5f5f5", p: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <PeopleIcon sx={{ mr: 1 }} />
          <Typography variant="h5" component="div">User Management</Typography>
        </Box>
        <Typography variant="body1" component="div" sx={{ ml: 'auto', fontSize: '1.2rem' }}>
          {currentDateTime}
        </Typography>
      </Box>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
          <AddIcon /> Add User
        </Button>
      </Box>

      <Box style={{ height: 600, width: "100%" }}>
        <MaterialReactTable columns={columns} data={users} />
      </Box>

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
            <Typography variant="h6" component="div">
              {selectedUser ? "Edit User" : "Add User"}
            </Typography>
            <Box component="form" mt={2}>
              <Grid container spacing={2}>
                {["title", "firstname", "surname", "email", "password", "sex", "village", "traditional_authority", "district", "role_name"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      name={field}
                      label={field.replace('_', ' ')}
                      value={formValues[field]}
                      onChange={handleChange}
                      fullWidth
                      required={field !== "sex" && field !== "village" && field !== "traditional_authority" && field !== "district" && field !== "role_name"}
                      type={field === "password" ? "password" : "text"}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Departments</InputLabel>
                    <Select
                      name="departments"
                      value={formValues.departments}
                      onChange={(e) => setFormValues({ ...formValues, departments: e.target.value })}
                      fullWidth
                      multiple
                      required
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.id} value={department.id}>
                          {department.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleSaveUser}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ ml: 2 }}>
                  Cancel
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
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;
