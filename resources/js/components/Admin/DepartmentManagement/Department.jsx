import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Department = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [classNames, setClassNames] = useState([]);
  const [emails, setEmails] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://127.0.0.1:8000/api/users");
        console.log("Users Response:", usersResponse.data);

        const emailsResponse = await axios.get("http://127.0.0.1:8000/api/emails");
        console.log("Emails Response:", emailsResponse.data);

        const classesResponse = await axios.get("http://127.0.0.1:8000/api/classes");
        console.log("Classes Response:", classesResponse.data);

        const subjectsResponse = await axios.get("http://127.0.0.1:8000/api/subjects");
        console.log("Subjects Response:", subjectsResponse.data);

        setUsers(usersResponse.data);
        setEmails(emailsResponse.data.emails); // Update this line
        setClassNames(classesResponse.data);
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { accessorKey: "id", header: "ID", enableSorting: true },
    { accessorKey: "title", header: "Title", enableSorting: true },
    { accessorKey: "firstname", header: "First Name", enableSorting: true },
    { accessorKey: "surname", header: "Surname", enableSorting: true },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <>
          <IconButton onClick={() => handleView(row.original)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteDialogOpen(row.original.id)}>
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        </>
      ),
    },
  ];

  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
    // Implement edit functionality here
  };

  const handleDeleteDialogOpen = (userId) => {
    setSelectedUser(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setSelectedUser(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${selectedUser}`);
      const updatedUsers = users.filter((user) => user.id !== selectedUser);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setSelectedUser(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  const handleAllocateModalOpen = () => {
    setAllocateModalOpen(true);
  };

  const handleAllocateModalClose = () => {
    setAllocateModalOpen(false);
  };

  const handleAllocateSubjectsLevels = () => {
    if (selectedUser) {
      const selectedClassName = document.getElementById("className").value;
      const selectedEmail = document.getElementById("email").value;

      axios
        .post("http://127.0.0.1:8000/api/allocations", {
          email: selectedEmail,
          name: document.getElementById("subjectName").value,
          className: selectedClassName,
        })
        .then((response) => {
          console.log("Allocation success:", response.data);
          // Handle success, update UI, show success message, etc.
        })
        .catch((error) => {
          console.error(
            "Allocation error:",
            error.response ? error.response.data : error.message
          );
          // Handle error, show error message, etc.
        })
        .finally(() => {
          setAllocateModalOpen(false);
        });
    } else {
      console.error("No user selected for allocation.");
    }
  };

  return (
    <React.Fragment>
      <div className="heading">
        <AddIcon />
        <span style={{ color: "white" }}>Head Of Department-Dashboard</span>
      </div>
      <Button
        variant="contained"
        color="success"
        onClick={handleAllocateModalOpen}
        style={{ marginLeft: '10px' }}
      >
        Allocate
      </Button>

      <div style={{ width: "1100px" }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={users}
            searchTerm={searchTerm}
            paginate
            sortable
            itemsPerPage={5}
          />
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        open={viewModalOpen}
        onClose={handleViewModalClose}
        aria-labelledby="view-modal-title"
        aria-describedby="view-modal-description"
        closeAfterTransition
      >
        <Fade in={viewModalOpen}>
          <Paper
            sx={{
              p: 3,
              width: "60%",
              maxWidth: 800,
              maxHeight: "80vh",
              overflowY: "auto",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Alert severity="success" sx={{ mb: 3, backgroundColor: "success.main" }}>
              <Typography variant="h4" fontWeight="bold" color="success.contrastText">
                Personal Details
              </Typography>
            </Alert>
            {selectedUser && (
              <Box>
                <Typography variant="h6">
                  {selectedUser.title} {selectedUser.firstname} {selectedUser.surname}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Email: {selectedUser.email}
                </Typography>
              </Box>
            )}
          </Paper>
        </Fade>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Allocate Subjects/Levels Modal */}
      <Dialog
        open={allocateModalOpen}
        onClose={handleAllocateModalClose}
        aria-labelledby="allocate-modal-title"
        aria-describedby="allocate-modal-description"
      >
        <DialogTitle id="allocate-modal-title">Allocate Subjects/Levels</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="classNameLabel">Class Name</InputLabel>
            <Select labelId="classNameLabel" id="className" label="Class Name" defaultValue="">
              {classNames.map((className) => (
                <MenuItem key={className.id} value={className.className}>
                  {className.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="emailLabel">Email</InputLabel>
            <Select labelId="emailLabel" id="email" label="Email" defaultValue="">
              {emails.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="subjectNameLabel">Subject Name</InputLabel>
            <Select labelId="subjectNameLabel" id="subjectName" label="Subject Name" defaultValue="">
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.name}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAllocateModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAllocateSubjectsLevels} color="success" autoFocus>
            Allocate
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Department;
