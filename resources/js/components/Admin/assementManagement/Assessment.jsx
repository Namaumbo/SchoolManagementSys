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
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedUsername, setSelectedUsername] = useState("");
    const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

    const [endOfTermAssessmentFields, setEndOfTermAssessmentFields] = useState(
        []
    );
    const [displayEndOfTermAssessments, setDisplayEndOfTermAssessments] =
        useState(false);
    const [paperCount, setPaperCount] = useState(0);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/students"
                );
                console.log("Fetched Assessments:", response.data);
                setFetchedAssessments(response.data);
            } catch (error) {
                console.error("Error loading assessments:", error.message);
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/subjects"
                );
                console.log("Fetched Subjects:", response.data);
                setSubjects(response.data);
            } catch (error) {
                console.error("Error loading subjects:", error.message);
            }
        };

        fetchAssessments();
        fetchSubjects();
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
        setEndOfTermAssessmentFields(
            student.subjects.map(
                (subject) => subject.pivot.endOfTermAssessment || ""
            )
        );
        setSelectedSubject(student.subjects[0].id.toString()); // Assuming the student has at least one subject
        setSelectedUsername(student.username);
        setSaveMessage(null); // Clear any previous messages
    };

    const handleDelete = async (studentId) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/assessments/${studentId}`
            );
            const updatedAssessments = fetchedAssessments.filter(
                (assessment) => assessment.id !== studentId
            );
            setFetchedAssessments(updatedAssessments);
        } catch (error) {
            // #TODO make a better error message to the user
            console.error("Error deleting assessment:", error.message);
        }
    };

    const handleEditModalClose = () => {
        setEditingStudent(null);
        setEndOfTermAssessmentFields([]);
        setSelectedSubject("");
        setSelectedUsername("");
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
            // Assuming 'student' is fetched based on 'selectedUsername'
            const student = fetchedAssessments.find(
                (assessment) => assessment.username === selectedUsername
            );

            if (!student) {
                console.error("Student not found.");
                return;
            }

            const endOfTermAssessmentJson = JSON.stringify(
                endOfTermAssessmentFields.filter(Boolean)
            );

            const updatedAssessment = {
                username: selectedUsername,
                name: selectedSubject,
                student_id: student.id,
                schoolTerm: document.getElementById("schoolTerm")?.value || "",
                teacherEmail:
                    document.getElementById("teacherEmail")?.value || "",
                firstAssessment:
                    document.getElementById("firstAssessment")?.value || "",
                secondAssessment:
                    document.getElementById("secondAssessment")?.value || "",
                endOfTermAssessment: endOfTermAssessmentJson,
            };

            const response = await axios.put(
                "http://127.0.0.1:8000/api/update-assessment",
                updatedAssessment
            );

            // Display success message
            setSaveMessage({ type: "success", text: response.data.message });

            const updatedAssessments = fetchedAssessments.map((assessment) => {
                if (assessment.id === student.id) {
                    return { ...assessment, ...updatedAssessment };
                }
                return assessment;
            });
            setFetchedAssessments(updatedAssessments);

            setEditingStudent(null);
            setEditModalOpen(false);
            setPaperCount(0); // Reset paperCount to 0 when saving the edit
        } catch (error) {
            console.error("Error saving edits:", error.message);

            // Display error message from the backend
            setSaveMessage({
                type: "error",
                text:
                    error.response?.data?.message ||
                    "An error occurred while saving edits.",
            });
        }
    };

    const handleAddPaper = () => {
        setPaperCount((prevCount) => prevCount + 1);
        setEndOfTermAssessmentFields((prevFields) => [...prevFields, ""]);
        setDisplayEndOfTermAssessments(true);
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
                Cell: ({ row }) => (
                    <Typography>{row.original.username}</Typography>
                ),
                enableEditing: false,
            },
            {
                accessorKey: "actions",
                header: "Actions",
                Cell: ({ row }) => (
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Tooltip title="View Details">
                            <IconButton
                                onClick={() => handleViewDetails(row.original)}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton
                                onClick={() => handleEdit(row.original)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                onClick={() => handleDelete(row.original.id)}
                            >
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
                <AddIcon/>
                <span style={{ color: "white" }}>Assessments</span>
            </div>
            {/*TODO : descrease the size of table  */}

            <MaterialReactTable
                columns={columns}
                data={fetchedAssessments}
                renderTableRowSubComponent={({ row }) =>
                    renderAssessmentDetails(row.original)
                }
            />

            {/* View Details Modal */}
            <Modal
                open={viewDetailsModalOpen}
                onClose={handleViewDetailsModalClose}
                aria-labelledby="view-details-modal-title"
                aria-describedby="view-details-modal-description"
                closeAfterTransition
            >
            {/* modal for veiwing a student */}
                <Fade in={viewDetailsModalOpen}>
                    <Paper
                        sx={{
                            p: 3,
                            width: "60%",
                            maxWidth: 2500,
                            maxHeight: "80vh",
                            overflowY: "auto",
                            position: "absolute",
                            top: "40%",
                            left: "60%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                p: 2,
                            }}
                        >
                            Assessment Details
                        </Typography>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Subject Name</th>
                                    <th>Teacher Email</th>
                                    <th>First Assessment</th>
                                    <th>Second Assessment</th>
                                    <th>Average Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedStudentDetails?.subjects.map(
                                    (subject) => (
                                        <tr key={subject.pivot.id}>
                                            <td>{subject.name}</td>
                                            <td>
                                                {subject.pivot.teacherEmail}
                                            </td>

                                            <td>
                                                {subject.pivot.firstAssessment}
                                            </td>
                                            <td>
                                                {subject.pivot.secondAssessment}
                                            </td>
                                            <td>
                                                {subject.pivot.averageScore}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                        {/* Render student details here using selectedStudentDetails */}
                    </Paper>
                </Fade>
            </Modal>

            {/* Modal for editing a student */}
            <Modal
                open={editModalOpen}
                onClose={handleEditModalClose}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 0,
                }}
            >
                <Fade in={editModalOpen}>
                    <Paper
                        sx={{
                            p: 3,
                            width: "60%",
                            maxWidth: 500,
                            maxHeight: "80vh",
                            overflowY: "auto",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                p: 2,
                            }}
                        >
                            Edit Student Assessment
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ mt: 3, fontSize: "15px" }}
                        >
                            (Student name and Username cannot be edited)
                        </Typography>
                        {saveMessage && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 2,
                                    backgroundColor:
                                        saveMessage.type === "success"
                                            ? "success.main"
                                            : "error.main",
                                    padding: 1,
                                    borderRadius: 4,
                                }}
                            >
                                {saveMessage.text}
                            </Typography>
                        )}
                        <TextField
                            label="Name"
                            value={
                                editingStudent &&
                                `${editingStudent.firstname} ${editingStudent.surname}`
                            }
                            fullWidth
                            disabled
                            sx={{ fontSize: 16, mt: 1 }}
                        />
                        <TextField
                            select
                            label="Subject"
                            fullWidth
                            id="subject"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            sx={{ mt: 2 }}
                        >
                            {subjects.map((subject) => (
                                <MenuItem key={subject.id} value={subject.name}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Username"
                            fullWidth
                            id="username"
                            defaultValue={editingStudent?.username}
                            disabled // Make the TextField disabled
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="schoolTerm"
                            fullWidth
                            id="schoolTerm"
                            defaultValue={editingStudent?.firstAssessment}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="teacherEmail"
                            fullWidth
                            id="teacherEmail"
                            defaultValue={editingStudent?.firstAssessment}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            label="First Assessment"
                            fullWidth
                            id="firstAssessment"
                            defaultValue={editingStudent?.firstAssessment}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Second Assessment"
                            fullWidth
                            id="secondAssessment"
                            defaultValue={editingStudent?.secondAssessment}
                            sx={{ mt: 2 }}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 3 }}>
                            End of Term Assessments
                        </Typography>
                        {Array.from({ length: paperCount }).map((_, index) => (
                            <TextField
                                key={index}
                                label={`Paper ${index + 1}`}
                                fullWidth
                                value={endOfTermAssessmentFields[index] || ""}
                                onChange={(e) =>
                                    handlePaperChange(index, e.target.value)
                                }
                                sx={{ mt: 1 }}
                            />
                        ))}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 2,
                            }}
                        >
                            <Button
                                onClick={handleAddPaper}
                                variant="contained"
                                color="success"
                                sx={{
                                    textTransform: "none",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                Add Paper
                                <AddIcon sx={{ ml: 1 }} />
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: "none" }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </React.Fragment>
    );
};

export default Assessments;