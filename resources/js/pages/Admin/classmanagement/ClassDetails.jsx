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
  Tabs,
  Tab,
} from '@mui/material';
import axios from 'axios';
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const ClassDetails = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // State for managing tab selection
  const [selectedTeacher, setSelectedTeacher] = useState(null); // State to track selected teacher for modal
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchPerformance();
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
      const { users } = response.data; // Assuming the response has 'users' array

      if (users && users.length > 0) {
        const updatedTeachers = users.map(user => ({
          id: user.id,
          name: `${user.firstname} ${user.surname}`,
          allocatedSubjects: user.allocatedSubjects || [], // Assuming allocatedSubjects array exists
          email: user.email,
          title: user.title,
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

  const fetchPerformance = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/class/${id}/performance`);
      setPerformance(response.data.class.students || []);
    } catch (error) {
      setError(error.message || 'Error fetching performance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewUser = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTeacher(null);
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

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5">Class Details</Typography>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Students" />
          <Tab label="Performance" />
          <Tab label="Marksheet" />
          <Tab label="Teachers" />
        </Tabs>
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6">Students</Typography>
            {students.length > 0 ? (
              <TableContainer component={Paper}>
                <Table aria-label="students-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Surname</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Sex</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
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
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6">Performance</Typography>
            {performance.length > 0 ? (
              <TableContainer component={Paper}>
                <Table aria-label="performance-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      {performance[0].subjects.map((subject) => (
                        <TableCell key={subject.id}>{subject.name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performance.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{`${student.firstname} ${student.surname}`}</TableCell>
                        {student.subjects.map((subject) => (
                          <TableCell key={subject.id}>{subject.averageScore !== null ? subject.averageScore : 'N/A'}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">No performance data available</Typography>
            )}
          </Box>
        )}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6">Marksheet</Typography>
            <Typography variant="body2" color="textSecondary">Marksheet details go here.</Typography>
          </Box>
        )}
        {tabValue === 3 && (
          <Box>
            <Typography variant="h6">Teachers</Typography>
            {teachers.length > 0 ? (
              <TableContainer component={Paper}>
                <Table aria-label="teachers-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Teacher Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{teacher.title}</TableCell>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>
                          <Tooltip title="View Allocations">
                            <IconButton onClick={() => handleViewUser(teacher)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">No teachers assigned</Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Modal for displaying teacher allocations */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="teacher-allocations-title" aria-describedby="teacher-allocations-description">
        <Box sx={{ ...modalStyle, width: 600 }}>
          {selectedTeacher && (
            <>
              <Typography id="teacher-allocations-title" variant="h6" component="h2">
                Allocations for {selectedTeacher.name}
              </Typography>
              {selectedTeacher.allocatedSubjects.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table aria-label="teacher-allocations-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Periods Per Week</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTeacher.allocatedSubjects.map((subject, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{subject.code}</TableCell>
                          <TableCell>{subject.subjectName}</TableCell>
                          <TableCell>{subject.periodsPerWeek}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary">No allocated subjects</Typography>
              )}
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ClassDetails;

// Styles for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  boxShadow: 24,
  p: 4,
};
