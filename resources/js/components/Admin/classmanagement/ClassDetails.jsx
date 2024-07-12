import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Tab } from 'semantic-ui-react';

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
      const { message, details } = response.data;

      if (details && details.length > 0) {
        const updatedTeachers = details.map(subject => ({
          name: subject.teachers.join(', '), // Assuming teachers is an array of names
          className: subject.className,
          subjects: subject.name, // Assuming subjects is an array of subject names
        }));

        setTeachers(updatedTeachers);
      } else {
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

  const handleViewUser = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTeacher(null);
  };

  // Memoized columns definition for teachers
  const teacherColumns = [
    { accessorKey: 'name', header: 'Teacher Name' },
    { accessorKey: 'className', header: 'Class Name' },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box>
          <Tooltip title="View">
            <IconButton onClick={() => handleViewUser(row.original)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {/* Add edit and delete icons here */}
        </Box>
      ),
    },
  ];

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
            <TableContainer component={Paper}>
              <Table aria-label="students-table">
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Surname</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Sex</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.firstname}</TableCell>
                      <TableCell>{student.surname}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{student.sex}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
      menuItem: { key: 'teachers', icon: 'user', content: 'Teachers' },
      render: () => (
        <Tab.Pane>
          <Typography variant="h6">Teachers</Typography>
          {teachers.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="teachers-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Teacher Name</TableCell>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Subjects</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher, index) => (
                    <TableRow key={index}>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.className}</TableCell>
                      <TableCell>{teacher.subjects}</TableCell>
                      <TableCell>
                        <Tooltip title="View">
                          <IconButton onClick={() => handleViewUser(teacher)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {/* Add edit and delete icons here */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                Allocations for {selectedTeacher.name}
              </Typography>
              {selectedTeacher.subjects ? (
                <TableContainer component={Paper}>
                  <Table aria-label="teacher-allocations-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject Name</TableCell>
                        <TableCell>Class Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedTeacher.subjects}</TableCell>
                        <TableCell>{selectedTeacher.className}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary">No subjects allocated</Typography>
              )}
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
