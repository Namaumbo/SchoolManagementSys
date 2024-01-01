import React, { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  IconButton,
  Tooltip,
  Collapse,
  TableCell,
  TableRow,
  Modal,
  Backdrop,
  Fade,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const Assessments = () => {
  const [fetchedAssessments, setFetchedAssessments] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [endOfTermAssessmentFields, setEndOfTermAssessmentFields] = useState([]);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/assessments');
        console.log('Fetched Assessments:', response.data);
        setFetchedAssessments(response.data);
      } catch (error) {
        console.error('Error loading assessments:', error.message);
      }
    };

    fetchAssessments();
  }, []);

  const toggleDetails = (studentId) => {
    setExpandedDetails((prevExpanded) => ({
      ...prevExpanded,
      [studentId]: !prevExpanded[studentId],
    }));
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEndOfTermAssessmentFields([]); // Reset the end-of-term assessment fields
    setEditModalOpen(true);
    setSaveMessage(null); // Clear any previous messages
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/assessments/${studentId}`);
      const updatedAssessments = fetchedAssessments.filter((assessment) => assessment.student_id !== studentId);
      setFetchedAssessments(updatedAssessments);
    } catch (error) {
      console.error('Error deleting assessment:', error.message);
    }
  };

  const handleEditModalClose = () => {
    setEditingStudent(null);
    setEndOfTermAssessmentFields([]);
    setEditModalOpen(false);
    setSaveMessage(null); 
  };

  const handleSaveEdit = async () => {
    try {
      const updatedAssessment = {
        firstAssessment: document.getElementById('firstAssessment').value,
        secondAssessment: document.getElementById('secondAssessment').value,
        endOfTermPapers: endOfTermAssessmentFields,
      };

      const response = await axios.put(`http://127.0.0.1:8000/api/update-assessment`, updatedAssessment);

      // Display success message
      setSaveMessage({ type: 'success', text: response.data.message });

      const updatedAssessments = fetchedAssessments.map((assessment) => {
        if (assessment.student_id === editingStudent.student_id) {
          return { ...assessment, ...updatedAssessment };
        }
        return assessment;
      });
      setFetchedAssessments(updatedAssessments);

      setEditingStudent(null);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving edits:', error.message);

      // Display error message from the backend
      setSaveMessage({ type: 'error', text: error.response.data.message });
    }
  };

  const handleAddPaper = () => {
    setEndOfTermAssessmentFields((prevFields) => [...prevFields, '']);
  };

  const handlePaperChange = (index, value) => {
    setEndOfTermAssessmentFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index] = value;
      return newFields;
    });
  };

  const renderAssessmentDetails = (assessment) => (
    <Collapse in={expandedDetails[assessment.student_id]}>
      <TableRow>
        <TableCell colSpan={columns.length}>
          <Box sx={{ marginLeft: '2rem' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontSize: 16 }}>
              Student Information
            </Typography>
            <TextField
              label="Name"
              value={`${assessment.firstname} ${assessment.surname}`}
              fullWidth
              disabled
              sx={{ fontSize: 14, mt: 1 }}
            />
            <Typography sx={{ fontSize: 14, mt: 1 }}>
              <strong>Username:</strong> {assessment.username}
            </Typography>
            <MaterialReactTable
              columns={[
                { accessorKey: 'firstAssessment', header: 'First Assessment' },
                { accessorKey: 'secondAssessment', header: 'Second Assessment' },
                { accessorKey: 'averageScore', header: 'Average Score' },
                
              ]}
              data={[assessment]} // Use an array to render a single row
              enableEditing={false}
            />
          </Box>
        </TableCell>
      </TableRow>
    </Collapse>
  );

  const columns = useMemo(
    () => [
      { accessorKey: 'student_id', header: 'Student ID', enableEditing: false },
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ row }) => (
          <Typography>
            {row.original.firstname} {row.original.surname}
          </Typography>
        ),
        enableEditing: false,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        Cell: ({ row }) => (
          <Typography>{row.original.username}</Typography>
        ),
        enableEditing: false,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip title="Toggle Details">
              <IconButton onClick={() => toggleDetails(row.original.student_id)}>
                {expandedDetails[row.original.student_id] ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEdit(row.original)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete(row.original.student_id)}>
                <DeleteIcon sx={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={fetchedAssessments}
        renderTableRowSubComponent={({ row }) => renderAssessmentDetails(row.original)}
      />

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editModalOpen}>
          <Paper sx={{ p: 3, borderRadius: 4, width: '60%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Typography variant="h6" component="div" sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
              Edit Student Assessment
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 3, fontSize: '15px' }}>
              (Student name and Username cannot be edited)
            </Typography>
            {saveMessage && (
              <Typography variant="body2" sx={{ mt: 2, backgroundColor: saveMessage.type === 'success' ? 'success.main' : 'error.main', padding: 1, borderRadius: 4 }}>
                {saveMessage.text}
              </Typography>
            )}
            <TextField
              label="Name"
              value={editingStudent && `${editingStudent.firstname} ${editingStudent.surname}`}
              fullWidth
              disabled
              sx={{ fontSize: 16, mt: 1 }}
            />
            <TextField label="Username" fullWidth value={editingStudent?.username} sx={{ mt: 2 }} />
            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              Assessments
            </Typography>
             <TextField label="Subject" fullWidth id="name" sx={{ mt: 2 }} />

            <TextField label="First Assessment" fullWidth id="firstAssessment" sx={{ mt: 2 }} />
            <TextField label="Second Assessment" fullWidth id="secondAssessment" sx={{ mt: 2 }} />
            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              End of Term Assessments
            </Typography>
            {endOfTermAssessmentFields.map((value, index) => (
              <TextField
                key={index}
                label={`Paper ${index + 1}`}
                fullWidth
                value={value}
                onChange={(e) => handlePaperChange(index, e.target.value)}
                sx={{ mt: 1 }}
              />
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Button onClick={handleAddPaper} variant="contained" color="success" sx={{ textTransform: 'none', display: 'flex', alignItems: 'center' }}>
                Add Paper
                <AddIcon sx={{ ml: 1 }} />
              </Button>
              <Button onClick={handleSaveEdit} variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default Assessments;
