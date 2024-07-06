import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Container,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Tab } from 'semantic-ui-react';
import axios from 'axios';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const ClassDetails = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // State for managing tab selection
  const [selectedTeacher, setSelectedTeacher] = useState(null); // State to track selected teacher for modal
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, [id]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/class/${id}/students`);
      setStudents(response.data.students || []);
    } catch (error) {
      setError(error.message || 'Error fetching students');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/class/${id}/usersAllocations`);
      console.log(response.data); // Log data received from the API

      const { message, details } = response.data;
      console.log(message); // Log success message

      // Assuming details is an array containing information about the class and users
      if (details.length > 0) {
        const users = details[0].users || []; // Assuming users array is within the first detail object
        const teachersWithAllocations = users.map(user => ({
          id: user.id,
          firstname: user.firstname,
          surname: user.surname,
          email: user.email,
          sex: user.sex,
          subjects: details[0].levels.map(level => ({
            id: level.id,
            name: level.className,
          }))
        }));

        console.log(teachersWithAllocations); // Log the transformed data

        setTeachers(teachersWithAllocations);
      } else {
        // Handle case where no details are found
        setTeachers([]);
      }
    } catch (error) {
      setError(error.message || 'Error fetching teachers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (e, { activeIndex }) => {
    setTabValue(activeIndex);
  };

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTeacher(null);
  };

  const handleViewUser = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenModal(true);
  };

  // Memoized columns definition for students
  const studentColumns = useMemo(() => [
    { accessorKey: 'firstname', header: 'First Name' },
    { accessorKey: 'surname', header: 'Surname' },
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'sex', header: 'Sex' },
  ], []);

  // Memoized columns definition for teachers
  const teacherColumns = useMemo(() => [
    { accessorKey: 'firstname', header: 'First Name' },
    { accessorKey: 'surname', header: 'Surname' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'sex', header: 'Sex' },
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
  ], []);

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

  const panes = [
    {
      menuItem: { key: 'students', icon: 'users', content: 'Students' },
      render: () => (
        <Tab.Pane>
          <Typography variant="h6">Students</Typography>
          {students.length > 0 ? (
            <MaterialReactTable data={students} columns={studentColumns} />
          ) : (
            <Typography variant="body2" color="textSecondary">No students enrolled</Typography>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'performance', icon: 'chart bar', content: 'Performance' },
      render: () => (
        <Tab.Pane>
          <Typography variant="h6">Performance</Typography>
          <Typography variant="body2" color="textSecondary">Performance details go here.</Typography>
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'marksheet', icon: 'file alternate', content: 'Marksheet' },
      render: () => (
        <Tab.Pane>
          <Typography variant="h6">Marksheet</Typography>
          <Typography variant="body2" color="textSecondary">Marksheet details go here.</Typography>
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'teachers', icon: 'user', content: 'Teachers' }, // Updated icon
      render: () => (
        <Tab.Pane>
          <Typography variant="h6">Teachers</Typography>
          {teachers.length > 0 ? (
            <MaterialReactTable data={teachers} columns={teacherColumns} />
          ) : (
            <Typography variant="body2" color="textSecondary">No teachers assigned</Typography>
          )}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5">Class Details</Typography>
        <Tab panes={panes} activeIndex={tabValue} onTabChange={handleTabChange} menu={{ secondary: true, pointing: true }} />
      </Paper>

      {/* Modal for displaying teacher allocations */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="teacher-allocations-title" aria-describedby="teacher-allocations-description">
        <Box sx={{ ...modalStyle, width: 400 }}>
          {selectedTeacher && (
            <>
              <Typography id="teacher-allocations-title" variant="h6" component="h2">
                Allocations for {selectedTeacher.firstname} {selectedTeacher.surname}
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject Name</TableCell>
                      <TableCell>Class Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTeacher.subjects && selectedTeacher.subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.levels.map(level => level.className).join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default ClassDetails;
