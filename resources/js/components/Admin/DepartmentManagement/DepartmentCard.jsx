import React from 'react';
import { Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import { FaUser, FaInfo, FaFolderOpen } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

const DepartmentCard = ({ department, onCardClick }) => {
  const getIcon = () => {
    switch (department.departmentName) {
      case 'Sciences':
        return <FaUser size={40} />;
      case 'Languages':
        return <FaInfo size={40} />;
      case 'Humanities':
        return <FaFolderOpen size={40} />;
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    console.log('Clicked card:', department.departmentName); // Debugging
    onCardClick(department.id);
  };

  const getBackgroundColor = () => {
    switch (department.departmentName) {
      case 'Sciences':
        return '#1976d2'; // Blue
      case 'Languages':
        return '#4caf50'; // Green
      case 'Humanities':
        return '#8d6e63'; // Brown
      default:
        return '#9e9e9e'; // Grey (default color)
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: '300px',
        height: '180px',
        margin: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: getBackgroundColor(),
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
        '&:hover': {
          backgroundColor: department.hoverColor || getBackgroundColor(),
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            {getIcon()}
            <Typography variant="h5" sx={{ ml: 2, color: '#ffffff' }}>{department.departmentName}</Typography>
          </Box>
          <IconButton color="inherit" onClick={handleCardClick}>
            <MdKeyboardArrowRight size={24} style={{ color: '#ffffff' }} />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
          <Typography variant="body2" sx={{ color: '#ffffff', textDecoration: 'underline', cursor: 'pointer' }}>
            More
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
