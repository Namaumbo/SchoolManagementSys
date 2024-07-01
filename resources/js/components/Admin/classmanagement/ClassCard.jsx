import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ classItem, onCardClick }) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => onCardClick(classItem.id)} sx={{ mb: 2, cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h6">{classItem.className}</Typography>
        <Typography variant="body2" color="textSecondary">{classItem.description}</Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => navigate(`/class/${classItem.id}/students`)}>
            View Students
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
