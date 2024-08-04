import React, { useMemo, useState, useEffect } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as IconSection from 'react-icons/fi';

const showErrorAlert = (title, text) => {
  console.error(`${title}: ${text}`);
};

const showSuccessAlert = (title, text) => {
  console.log(`${title}: ${text}`);
};

const showLoadingAlert = () => {
  console.log('Loading...');
};

const hideLoadingAlert = () => {
  console.log('Loading completed.');
};

const Panel = ({ severity, onClose, children }) => {
  const backgroundColor = severity === 'success' ? '#4CAF50' : severity === 'error' ? '#FF5733' : '#f5f5f5';
  const borderColor = severity === 'error' ? 'red' : 'green';

  return (
    <div style={{ border: `1px solid ${borderColor}`, padding: '1rem', margin: '1rem 0', borderRadius: '4px', backgroundColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>{children}</div>
        <button onClick={onClose} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}>Close</button>
      </div>
    </div>
  );
};

const Students = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstname: '',
    surname: '',
    className: '',
    sex: 'male',
    village: '',
    traditional_authority: '',
    district: '',
    role_name: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const role = window.atob(localStorage.getItem('role'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoadingAlert();
        await new Promise((resolve) => setTimeout(resolve, 15));
        
        const usersResponse = await axios.get('http://127.0.0.1:8000/api/students');
        const classesResponse = await axios.get('http://127.0.0.1:8000/api/classes');

        setFetchedUsers(usersResponse.data);
        setClassOptions(classesResponse.data);
      } catch (error) {
        showErrorAlert('Error', 'Failed to fetch students. Please try again later.');
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

      await axios.post('http://127.0.0.1:8000/api/create-student', createData);
      setSuccessMessage('Student created successfully');
      setCreatingUser(false);
      refreshStudents();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create student. Please try again later.');
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const openDeleteConfirmModal = async (row) => {
    const { id } = row;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this student!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/student/${id}`);
        if (response.status === 200) {
          console.log('Student deleted successfully');
          setFetchedUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          setSuccessMessage(response.data.message || 'Student deleted successfully');
        } else {
          console.error('Failed to delete student');
          setErrorMessage(response.data?.message || 'Failed to delete student. Please try again later.');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to delete student. Please try again later.');
      } finally {
        refreshStudents();
      }
    }
  };

  const refreshStudents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/students');
      setFetchedUsers(response.data);
    } catch (error) {
      console.error('Error refreshing students:', error.message);
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
      { accessorKey: 'id', header: 'ID', size: 80, enableEditing: false },
      { accessorKey: 'firstname', header: 'Firstname', enableEditing: true },
      { accessorKey: 'surname', header: 'Surname', enableEditing: true },
      { accessorKey: 'username', header: 'Username', enableEditing: false },
      { accessorKey: 'className', header: 'Class', enableEditing: false },
    ],
    [validationErrors]
  );

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: role === 'admin',
    getRowId: (row) => row.id,
    renderRowActions: ({ row, table }) => (
      role === 'admin' && (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      role === 'admin' && (
        <Button
          variant="contained"
          onClick={() => {
            setCreatingUser(true);
          }}
        >
          Create New User
        </Button>
      )
    ),
  });

  if (isLoadingInitialData) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <span style={{ color: 'black', fontSize: 30 }}>Fetching Students....please wait</span>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      {successMessage && (
        <Panel severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Panel>
      )}

      {errorMessage && (
        <Panel severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Panel>
      )}

      {creatingUser && (
        <Dialog open={creatingUser} onClose={() => setCreatingUser(false)}>
          <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            Create New Student
          </DialogTitle>
          <DialogContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <form>
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  label="Firstname"
                  variant="outlined"
                  fullWidth
                  value={newUserData.firstname}
                  onChange={(e) => setNewUserData({ ...newUserData, firstname: e.target.value })}
                  error={!!validationErrors.firstname}
                  helperText={validationErrors.firstname}
                />
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  label="Surname"
                  variant="outlined"
                  fullWidth
                  value={newUserData.surname}
                  onChange={(e) => setNewUserData({ ...newUserData, surname: e.target.value })}
                  error={!!validationErrors.surname}
                  helperText={validationErrors.surname}
                />
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={newUserData.className}
                    onChange={(e) => setNewUserData({ ...newUserData, className: e.target.value })}
                  >
                    {classOptions.map((classOption) => (
                      <MenuItem key={classOption.id} value={classOption.className}>
                        {classOption.className}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <FormControl component="fieldset">
                  <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>Sex</Typography>
                  <RadioGroup
                    row
                    value={newUserData.sex}
                    onChange={(e) => setNewUserData({ ...newUserData, sex: e.target.value })}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </form>
            <form>
              <Box sx={{ marginBottom: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Village</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newUserData.village}
                    onChange={(e) => setNewUserData({ ...newUserData, village: e.target.value })}
                  />
                </FormControl>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Traditional Authority</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newUserData.traditional_authority}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, traditional_authority: e.target.value })
                    }
                  />
                </FormControl>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>District</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newUserData.district}
                    onChange={(e) => setNewUserData({ ...newUserData, district: e.target.value })}
                  />
                </FormControl>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Role Name</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newUserData.role_name}
                    onChange={(e) => setNewUserData({ ...newUserData, role_name: e.target.value })}
                  />
                </FormControl>
              </Box>
            </form>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: 'success.main', padding: 2 }}>
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

      <div className="heading">
        <IconSection.FiUsers />
        <span style={{ color: 'white' }}>Students-available</span>
      </div>
      <MaterialReactTable table={table} />
    </>
  );
};

const validateUser = (user) => {
  return {
    firstname: !validateRequired(user.firstname) ? 'Firstname is Required' : '',
    surname: !validateRequired(user.surname) ? 'Surname is Required' : '',
  };
};

const validateRequired = (value) => !!value.trim();

export default Students;
