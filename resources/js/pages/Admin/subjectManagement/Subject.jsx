import React, { useState, useEffect } from "react";
import * as IconSection from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import {
    Fab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    TextField,
    Button,
    Typography,
    Box,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import SubjectService from "../../../../services/SubjectService";
import NavbarComponent from "../../../components/NavBarComponent/NavbarComponent";
import { BreadcrumbComponent } from "../../../components/BreadcrumbComponent/BreadcrumbComponent";

const Subject = () => {
    const [subjectName, setSubjectName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [periodsPerWeek, setPeriodsPerWeek] = useState("");
    const [subjects, setSubjects] = useState([]);
    const allowedSubjects = [
        "Mathematics",
        "English",
        "History",
        "Bible Knowledge",
        "Chemistry",
        "Physics",
        "Chichewa",
        "Geography",
        "French",
        "Life Skills",
        "Social and Developmental Studies",
        "Additional Mathematics",
        "Biology",
        "Agriculture",
    ];

    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleSubmit = () => {
        if (!allowedSubjects.includes(subjectName)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Subject Name",
                text: "Please enter a valid subject name!",
            });
            return;
        }

        const newSubject = {
            name: subjectName,
            code: subjectCode,
            periodsPerWeek: periodsPerWeek,
        };

        SubjectService.addSubject(newSubject)
            .then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Subject Added Successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setModalOpen(false); // Close the modal
                setSubjectName(""); // Clear input fields
                setSubjectCode("");
                setPeriodsPerWeek("");
                fetchSubjects(); // Fetch updated list of subjects
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to add subject. Please try again later.",
                });
            });
    };

    const fetchSubjects = () => {
        // Fetch list of subjects from backend
        axios
            .get("api/subjects")
            .then((res) => {
                setSubjects(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchSubjects();
    }, []); // Fetch subjects on component mount

    const renderCharts = (chartType) => {
        // Implement rendering of charts based on the selected chartType
        switch (chartType) {
            case "bar":
                // Render bar chart
                break;
            case "pie":
                // Render pie chart
                break;
            case "line":
                // Render line chart
                break;
            default:
                return null;
        }
    };

    return (
        <>
            <NavbarComponent activePage="Subject Management" />

            <div className="pl-5">
                <BreadcrumbComponent/>
            </div>

            <Fab
                size="medium"
                color="primary"
                aria-label="add"
                id="fab"
                onClick={handleModalOpen}
            >
                <GoPlus size={25} />
            </Fab>

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box
                        sx={{
                            mb: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            p: 2,
                        }}
                    >
                        <Typography variant="h6" component="div" align="center">
                            Add Subject
                        </Typography>
                    </Box>
                    <TextField
                        margin="normal"
                        label="Subject Name"
                        variant="outlined"
                        fullWidth
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        label="Subject Code"
                        variant="outlined"
                        fullWidth
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        label="Periods Per Week"
                        variant="outlined"
                        fullWidth
                        value={periodsPerWeek}
                        onChange={(e) => setPeriodsPerWeek(e.target.value)}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 2,
                        }}
                    >
                        <Button variant="contained" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Select chart type */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" align="center">
                    Select Chart Type
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => renderCharts("bar")}
                    >
                        Bar Chart
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => renderCharts("pie")}
                        sx={{ mx: 1 }}
                    >
                        Pie Chart
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => renderCharts("line")}
                    >
                        Line Chart
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Subject Name</TableCell>
                            <TableCell>Subject Code</TableCell>
                            <TableCell>Periods Per Week</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((subject, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{subject.name}</TableCell>
                                <TableCell>{subject.code}</TableCell>
                                <TableCell>{subject.periodsPerWeek}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary">
                                        View
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Subject;
