import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Snackbar, Alert, Paper, Container, Grid, Card, CardContent
} from '@mui/material';
import axios from 'axios';

const ClassDetails = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState({ students: [], subjects: [], teacher: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  const fetchClassDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/class/${classId}/details`);
      setClassDetails(response.data || { students: [], subjects: [], teacher: null });
    } catch (error) {
      setError(error.message || 'Error fetching class details');
    } finally {
      setIsLoading(false);
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

  const { students, subjects, teacher } = classDetails;

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5">Class Details</Typography>
        <Box mt={2}>
          <Typography variant="h6">Teacher</Typography>
          {teacher ? (
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Typography variant="body1">{teacher.name}</Typography>
                <Typography variant="body2" color="textSecondary">{teacher.email}</Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" color="textSecondary">No teacher assigned</Typography>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Students</Typography>
          {students.length > 0 ? (
            students.map((student, index) => (
              <Card key={index} sx={{ mt: 1 }}>
                <CardContent>
                  <Typography variant="body1">{student.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{student.email}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No students enrolled</Typography>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Subjects</Typography>
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <Card key={index} sx={{ mt: 1 }}>
                <CardContent>
                  <Typography variant="body1">{subject.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{subject.description}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No subjects assigned</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ClassDetails;
