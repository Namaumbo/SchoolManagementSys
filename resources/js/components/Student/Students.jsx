import React, { useMemo, useState, useEffect } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const showErrorAlert = (title, text) => {
  MySwal.fire({
    icon: 'error',
    title: title,
    text: text,
  });
};

const Students = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingUsersError, setIsLoadingUsersError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/students');
        console.log('Fetched Users:', response.data);
        setFetchedUsers(response.data);
      } catch (error) {
        console.error('Error loading users:', error.message);
        console.error('Response Status Code:', error.response?.status);
        setIsLoadingUsersError(true);
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
        role_name: values.role_name,
      };

      await axios.post('http://127.0.0.1:8000/api/create-student', createData);
    } catch (error) {
      console.error('Error creating user:', error);
      showErrorAlert('Error Creating User', error.message);
      throw error;
    }
  };

  const updateUser = async (values) => {
    try {
      const updateData = {
        className: values.className,
      };

      await axios.put(`http://127.0.0.1:8000/api/student/${values.id}`, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      showErrorAlert('Error Updating User', error.message);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/student/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      showErrorAlert('Error Deleting User', error.message);
      throw error;
    }
  };

  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    try {
      await createUser(values);
      table.setCreatingRow(null);
    } catch (error) {

    }
  };

  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    try {
      await updateUser(values);
      table.setEditingRow(null);
    } catch (error) {

    }
  };

  const openDeleteConfirmModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(row.original.id);
      } catch (error) {

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
          table.setCreatingRow(true);
        }}
      >
        Create New User
      </Button>
    ),
  });

  return (
    <>
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
