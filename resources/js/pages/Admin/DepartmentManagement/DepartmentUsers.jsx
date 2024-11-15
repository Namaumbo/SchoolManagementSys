import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Modal,
  Paper,
  Fade,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';
import axios from 'axios';

const DepartmentUsers = () => {
  const { departmentId } = useParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAllocations, setUserAllocations] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [departmentId]);

  useEffect(() => {
    if (isAllocateModalOpen) {
      fetchClasses();
      fetchSubjects();
    }
  }, [isAllocateModalOpen]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/department/${departmentId}/users`);
      setUsers(response.data.department.users || []);
    } catch (error) {
      setError(error.message || 'Error fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/allocations`);
      setUserAllocations(response.data.allocations || []);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching user allocations:', error);
      setSnackbar({ open: true, message: 'Error fetching user allocations', severity: 'error' });
    }
  };

  const handleCloseViewModal = () => {
    setSelectedUser(null);
    setUserAllocations([]);
    setIsViewModalOpen(false);
  };

  const handleAllocateModal = (user) => {
    setSelectedUser(user);
    setIsAllocateModalOpen(true);
  };

  const handleCloseAllocateModal = () => {
    setSelectedUser(null);
    setIsAllocateModalOpen(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/user/${userId}`);
      fetchUsers();
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting user', severity: 'error' });
    }
  };

  const handleAllocationSubmit = async () => {
    try {
      const allocationData = {
        name: selectedSubject.name,
        className: selectedClass.className,
      };

      const response = await axios.post(`http://127.0.0.1:8000/api/allocations/${selectedUser.id}`, allocationData);

      if (response.status === 201 && response.data.status === 'success') {
        handleCloseAllocateModal();
        fetchUsers(); 
        setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      } else {
        throw new Error(response.data.message || 'Allocation failed.');
      }

    } catch (error) {
      console.error('Error allocating subjects and classes:', error);

      if (error.response && error.response.data && error.response.data.message) {
        setSnackbar({ open: true, message: error.response.data.message, severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Error allocating subjects and classes', severity: 'error' });
      }
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/classes');
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setSnackbar({ open: true, message: 'Error fetching classes', severity: 'error' });
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/subjects');
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSnackbar({ open: true, message: 'Error fetching subjects', severity: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Snackbar open={true} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    );
  }

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'firstname', header: 'First Name' },
    { accessorKey: 'surname', header: 'Surname' },
    { accessorKey: 'email', header: 'Email' },

    {
      header: 'Actions',
      Cell: ({ row }) => (
        <Box>
          <Tooltip title="View">
            <IconButton onClick={() => handleViewUser(row.original.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleAllocateModal(row.original)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteUser(row.original.id)}>
              <DeleteIcon sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={12}>
          <Typography variant="h5" mb={3}>
            Users in Department {departmentId}
          </Typography>
          <MaterialReactTable columns={columns} data={users} />
        </Grid>
      </Grid>

      {/* View User Modal */}
      <Modal open={isViewModalOpen} onClose={handleCloseViewModal}>
        <Fade in={isViewModalOpen}>
          <Paper
            sx={{
              p: 3,
              width: '80%',
              maxWidth: '600px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h6" component="div">
              View User Allocations
            </Typography>
            {userAllocations.length > 0 ? (
              <Box mt={2}>
                <Typography variant="subtitle1">Allocations:</Typography>
                <Box mt={1} maxHeight="300px" overflow="auto">
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userAllocations.map((allocation, index) => (
                        <tr key={index}>
                          <td>{allocation.name}</td>
                          <td>{allocation.className}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            ) : (
              <Typography>No allocations found for this user.</Typography>
            )}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="outlined" color="secondary" onClick={handleCloseViewModal}>
                Close
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* Allocate Modal */}
      <Modal open={isAllocateModalOpen} onClose={handleCloseAllocateModal}>
        <Fade in={isAllocateModalOpen}>
          <Paper
            sx={{
              p: 3,
              width: '100%',
              maxWidth: '600px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h6" component="div">
              Allocate Subject and Class
            </Typography>
            <Box mt={2}>
              <InputLabel id="select-subject">Subject</InputLabel>
              <Select
                labelId="select-subject"
                id="select-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box mt={2}>
              <InputLabel id="select-class">Class</InputLabel>
              <Select
                labelId="select-class"
                id="select-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {classes.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem}>
                    {classItem.className}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="outlined" color="primary" onClick={handleCloseAllocateModal} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleAllocationSubmit}>
                Allocate
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentUsers;
