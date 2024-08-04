import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
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
    MenuItem,
} from "@mui/material";
import "./Assessment.css";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const Assessments = () => {
    const [fetchedAssessments, setFetchedAssessments] = useState([]);
    const [expandedDetails, setExpandedDetails] = useState({});
    const [editingStudent, setEditingStudent] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedAssessmentType, setSelectedAssessmentType] = useState("");
    const [schoolTerm, setSchoolTerm] = useState("");
    const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
    const [endOfTermAssessmentFields, setEndOfTermAssessmentFields] = useState([]);
    const [paperCount, setPaperCount] = useState(0);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/students");
                console.log("Fetched Assessments:", response.data);
                setFetchedAssessments(response.data);
            } catch (error) {
                console.error("Error loading assessments:", error.message);
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/subjects");
                console.log("Fetched Subjects:", response.data);
                setSubjects(response.data);
            } catch (error) {
                console.error("Error loading subjects:", error.message);
            }
        };

        const fetchUsers = async () => {
            try {
              const response = await axios.get("http://127.0.0.1:8000/api/users");
              if (response.data && response.data.users && Array.isArray(response.data.users)) {
                setUsers(response.data.users);
              } else {
                setUsers([]);
              }
            } catch (error) {
              setUsers([]);
              setSnackbar({ open: true, message: "Error fetching users", severity: "error" });
            }
          };
        

        fetchAssessments();
        fetchSubjects();
        fetchUsers();
    }, []);

    const toggleDetails = (studentId) => {
        setExpandedDetails((prevExpanded) => ({
            ...prevExpanded,
            [studentId]: !prevExpanded[studentId],
        }));
    };

    const handleViewDetails = (student) => {
        setSelectedStudentDetails(student);
        setViewDetailsModalOpen(true);
    };

    const handleEdit = (student) => {
        setEditModalOpen(true);
        setEditingStudent(student);
        setEndOfTermAssessmentFields(student.subjects.map((subject) => subject.pivot.endOfTermAssessment || ""));
        setSelectedSubject(student.subjects[0].id.toString());
        setSaveMessage(null);
    };

    const handleDelete = async (studentId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/assessments/${studentId}`);
            const updatedAssessments = fetchedAssessments.filter((assessment) => assessment.id !== studentId);
            setFetchedAssessments(updatedAssessments);
        } catch (error) {
            console.error("Error deleting assessment:", error.message);
        }
    };

    const handleEditModalClose = () => {
        setEditingStudent(null);
        setEndOfTermAssessmentFields([]);
        setSelectedSubject("");
        setEditModalOpen(false);
        setSaveMessage(null);
        setPaperCount(0);
    };

    const handleViewDetailsModalClose = () => {
        setSelectedStudentDetails(null);
        setViewDetailsModalOpen(false);
    };

 const handleSaveEdit = async () => {
    try {
        if (!editingStudent) {
            console.error("No student selected for editing.");
            return;
        }

        // Prepare the data to be updated
        const updatedAssessment = {
            student_id: editingStudent.id,
            username: editingStudent.username,
            name: selectedSubject,
            schoolTerm,
            teacherEmail: selectedUser,
            firstAssessment: selectedAssessmentType === "firstAssessment" ? document.getElementById("firstAssessment").value : "",
            secondAssessment: selectedAssessmentType === "secondAssessment" ? document.getElementById("secondAssessment").value : "",
            endOfTermAssessment: selectedAssessmentType === "endOfTermAssessment" ? JSON.stringify(endOfTermAssessmentFields.filter(Boolean)) : "",
        };

        // Make PUT request to update assessment
        const response = await axios.put("http://127.0.0.1:8000/api/update-assessment", updatedAssessment);

        // Handle success message
        setSaveMessage({ type: "success", text: response.data.message });

        // Update state with updated assessment
        const updatedAssessments = fetchedAssessments.map((assessment) =>
            assessment.id === editingStudent.id ? { ...assessment, ...updatedAssessment } : assessment
        );
        setFetchedAssessments(updatedAssessments);

        // Reset edit state
        setEditingStudent(null);
        setEditModalOpen(false);
        setPaperCount(0);
    } catch (error) {
        console.error("Error saving edits:", error.message);
        setSaveMessage({
            type: "error",
            text: error.response?.data?.message || "Error saving edits.",
        });
    }
};

    const handleAddPaper = () => {
        setPaperCount((prevCount) => prevCount + 1);
        setEndOfTermAssessmentFields((prevFields) => [...prevFields, ""]);
    };

    const handlePaperChange = (index, value) => {
        setEndOfTermAssessmentFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index] = value;
            return updatedFields;
        });
    };

    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "Student ID", enableEditing: false },
            {
                accessorKey: "name",
                header: "Name",
                Cell: ({ row }) => (
                    <Typography>
                        {row.original.firstname} {row.original.surname}
                    </Typography>
                ),
                enableEditing: false,
            },
            {
                accessorKey: "username",
                header: "Username",
                Cell: ({ row }) => <Typography>{row.original.username}</Typography>,
                enableEditing: false,
            },
            {
                accessorKey: "actions",
                header: "Actions",
                Cell: ({ row }) => (
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Tooltip title="View Details">
                            <IconButton onClick={() => handleViewDetails(row.original)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(row.original)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(row.original.id)}>
                                <DeleteIcon sx={{ color: "red" }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <div className="heading">
                <AddIcon />
                <span style={{ color: "white" }}>Assessments</span>
            </div>

            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <TextField
                    select
                    label="School Term"
                    fullWidth
                    value={schoolTerm}
                    onChange={(e) => setSchoolTerm(e.target.value)}
                >
                    <MenuItem value="Term 1">Term 1</MenuItem>
                    <MenuItem value="Term 2">Term 2</MenuItem>
                    <MenuItem value="Term 3">Term 3</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Assessment Type"
                    fullWidth
                    value={selectedAssessmentType}
                    onChange={(e) => setSelectedAssessmentType(e.target.value)}
                >
                    <MenuItem value="firstAssessment">First Assessment</MenuItem>
                    <MenuItem value="secondAssessment">Second Assessment</MenuItem>
                    <MenuItem value="endOfTermAssessment">End of Term Assessment</MenuItem>
                </TextField>


                <TextField
                 select
                 label="Email"
                 fullWidth
                 value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                sx={{ mb: 2 }}
                        >
              {users.map((user) => (
             <MenuItem key={user.id} value={user.email}>
             {user.email}
                </MenuItem>
                     ))}
                </TextField>

                <TextField
                 select
                 label="Subject"
                 fullWidth
                 value={selectedSubject}
                 onChange={(e) => setSelectedSubject(e.target.value)}
                     sx={{ mb: 2 }}
                     >
                 {subjects.map((subject) => (
                 <MenuItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                     </MenuItem>
                    ))}
                        </TextField>
            </Box>

            <MaterialReactTable
                columns={columns}
                data={fetchedAssessments}
                initialState={{
                    columnVisibility: {
                        id: true,
                    },
                }}
                renderDetailPanel={({ row }) => (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {row.original.subjects.map((subject) => (
                            <Box key={subject.id} sx={{ display: "flex", gap: "1rem" }}>
                                <Typography variant="body2">{subject.name}</Typography>
                                <Typography variant="body2">{subject.pivot.endOfTermAssessment}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            />

            <Modal
                open={editModalOpen}
                onClose={handleEditModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={editModalOpen}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Edit Assessment
                        </Typography>
                        {selectedAssessmentType === "firstAssessment" && (
                            <TextField
                                label="First Assessment"
                                fullWidth
                                id="firstAssessment"
                                sx={{ mb: 2 }}
                            />
                        )}
                        {selectedAssessmentType === "secondAssessment" && (
                            <TextField
                                label="Second Assessment"
                                fullWidth
                                id="secondAssessment"
                                sx={{ mb: 2 }}
                            />
                        )}
                        {selectedAssessmentType === "endOfTermAssessment" && (
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddPaper}
                                    sx={{ mb: 2 }}
                                >
                                    Add Paper
                                </Button>
                                {endOfTermAssessmentFields.map((field, index) => (
                                    <TextField
                                        key={index}
                                        label={`Paper ${index + 1}`}
                                        fullWidth
                                        value={field}
                                        onChange={(e) => handlePaperChange(index, e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                ))}
                            </Box>
                        )}

                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                            Save
                        </Button>
                        {saveMessage && (
                            <Typography
                                variant="body2"
                                sx={{ mt: 2, color: saveMessage.type === "error" ? "red" : "green" }}
                            >
                                {saveMessage.text}
                            </Typography>
                        )}
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={viewDetailsModalOpen}
                onClose={handleViewDetailsModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={viewDetailsModalOpen}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        {selectedStudentDetails && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    {selectedStudentDetails.firstname} {selectedStudentDetails.surname}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Username: {selectedStudentDetails.username}
                                </Typography>
                                {selectedStudentDetails.subjects.map((subject) => (
                                    <Paper key={subject.id} sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Subject: {subject.name}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            First Assessment: {subject.pivot.firstAssessment}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            Second Assessment: {subject.pivot.secondAssessment}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            End of Term Assessment: {subject.pivot.endOfTermAssessment}
                                        </Typography>
                                    </Paper>
                                ))}
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </React.Fragment>
    );
};

export default Assessments;
