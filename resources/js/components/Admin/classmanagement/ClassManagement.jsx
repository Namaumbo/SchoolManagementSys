import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Snackbar, Alert, Modal, Paper, Fade, TextField, Grid, Container, CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import ClassCard from './ClassCard';
import { useNavigate } from 'react-router-dom';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ className: '', headTeacher: '', classMonitor: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/classes');
      if (response.data && Array.isArray(response.data)) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching classes', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users');
      if (response.data && Array.isArray(response.data.users)) {
        setTeachers(response.data.users);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching teachers', severity: 'error' });
    }
  };

  const handleSaveClass = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/create-class', formValues);
      fetchClasses();
      handleCloseModal();
      setSnackbar({ open: true, message: 'Class saved successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error saving class', severity: 'error' });
    }
  };

  const handleOpenModal = () => {
    setFormValues({ className: '', headTeacher: '', classMonitor: '' });
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

  const handleViewStudents = (classId) => {
    navigate(`/class/${classId}/students`);
  };

  return (
    <Container sx={{ backgroundColor: '#f5f5f5', p: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Class Management</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          <AddIcon /> Add Class
        </Button>
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onCardClick={() => handleViewStudents(classItem.id)}
            />
          ))}
        </Box>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Fade in={isModalOpen}>
          <Paper
            sx={{
              p: 3,
              width: '600px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h5">Add Class</Typography>
            <Box component="form" mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="className"
                    label="Class Name"
                    value={formValues.className}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Head Teacher</InputLabel>
                    <Select
                      name="headTeacher"
                      value={formValues.headTeacher}
                      onChange={handleChange}
                    >
                      {teachers.map(teacher => (
                        <MenuItem key={teacher.id} value={teacher.email}>
                          {teacher.firstname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="classMonitor"
                    label="Class Monitor"
                    value={formValues.classMonitor}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleSaveClass}>
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClassManagement;
