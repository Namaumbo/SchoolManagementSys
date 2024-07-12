import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FaUser, FaInfo, FaFolderOpen, FaUserGraduate } from 'react-icons/fa';
import axios from 'axios';

const getIconByType = (type) => {
  switch (type) {
    case 'Department':
      return <FaUser />;
    case 'Assessment':
      return <FaInfo />;
    case 'Information':
      return <FaFolderOpen />;
    default:
      return <FaInfo />;
  }
};

const ClassCard = ({ classItem, onCardClick, type }) => {
  const navigate = useNavigate();
  const [numberOfStudents, setNumberOfStudents] = useState(0); // State to hold number of students

  useEffect(() => {
    fetchStudentCount(classItem.id); // Fetch number of students when component mounts
  }, [classItem.id]);

  const fetchStudentCount = async (classId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/class/${classId}/students`);
      const { student_count } = response.data; // Extract student count from API response
      setNumberOfStudents(student_count); // Update state with student count
    } catch (error) {
      console.error('Error fetching student count:', error);
      // Handle error fetching student count
    }
  };

  const icon = getIconByType(type);

  return (
    <Card
      onClick={() => onCardClick(classItem.id)}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        transition: '0.3s',
        '&:hover': { boxShadow: 10 },
        width: '200px',
        margin: '10px',
        backgroundColor: 'white',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'black',
          height: '200px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}
      >
        <Box sx={{ mb: 2, fontSize: 40 }}>{icon}</Box>
        <Typography variant="h6">{classItem.className}</Typography>
        <Typography variant="body2">{classItem.description}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <FaUserGraduate />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {numberOfStudents} Students
          </Typography>
        </Box>
        <Box
          mt={2}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Typography variant="body2">More</Typography>
          <IconButton
            color="inherit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/class/${classItem.id}/students`);
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClassCard;

