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
import Swal from 'sweetalert2';
import axios from 'axios';
import * as IconSection from 'react-icons/all';

const showErrorAlert = (title, text) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
  });
};

const showSuccessAlert = (title, text) => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
  });
};

const showLoadingAlert = () => {
  Swal.fire({
    title: 'Fetching Students',
    html: 'Please wait...',
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

const hideLoadingAlert = () => {
  Swal.close();
};

const Students = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingUsersError, setIsLoadingUsersError] = useState(false);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        showLoadingAlert();

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response = await axios.get('http://127.0.0.1:8000/api/students');
        console.log('Fetched Users:', response.data);
        setFetchedUsers(response.data);

        hideLoadingAlert();
      } catch (error) {
        console.error('Error loading users:', error.message);
        console.error('Response Status Code:', error.response?.status);
        setIsLoadingUsersError(true);
        hideLoadingAlert();
        showErrorAlert('Error', 'Failed to fetch students. Please try again later.');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchClassOptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/classes');
        setClassOptions(response.data);
      } catch (error) {
        console.error('Error loading class options:', error.message);
      }
    };

    fetchUsers();
    fetchClassOptions();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 80, enableEditing: false },
      { accessorKey: 'firstname', header: 'Firstname', enableEditing: true },
      { accessorKey: 'surname', header: 'Surname', enableEditing: true },
      { accessorKey: 'username', header: 'Username', enableEditing: false },
    ],
    [validationErrors]
  );

  const createUser = async (values) => {
    try {
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
      showSuccessAlert('Success', 'Student created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      showErrorAlert('Error Creating User', error.message);
      throw error;
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
      await createUser(newUserData);
      setCreatingUser(false);
      setNewUserData({
        firstname: '',
        surname: '',
        className: '',
        sex: 'male',
        village: '',
        traditional_authority: '',
        district: '',
        role_name: '',
      });
    } catch (error) {
      // Handle error if needed
    }
  };

  const openDeleteConfirmModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Implement delete user functionality here
        console.log('Deleting user with ID:', row.original.id);
      } catch (error) {
        // Handle error if needed
      }
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    renderRowActions: ({ row, table }) => (
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
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          setCreatingUser(true);
        }}
      >
        Create New User
      </Button>
    ),
  });

  if (isLoadingUsers) {
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
        <p>Fetching Students, please wait...</p>
        <div className="loader"></div>
      </div>
    );
  }

  if (isLoadingUsersError) {
    return <p>Error loading students. Please try again later.</p>;
  }

  return (
    <>
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
                      <MenuItem key={classOption.id} value={classOption.name}>
                        {classOption.name}
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
