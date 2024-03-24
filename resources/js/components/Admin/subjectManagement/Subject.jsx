import React, { useState, useEffect } from "react";
import * as IconSection from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { Fab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, TextField, Button, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import { Fab, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import SubjectService from "../../../../services/SubjectService";

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
        "Additional Mathematics"
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
                icon: 'error',
                title: 'Invalid Subject Name',
                text: 'Please enter a valid subject name!',
            });
            return;
        }

        const newSubject = {
            name: subjectName,
            code: subjectCode,
            periodsPerWeek: periodsPerWeek
        };

        SubjectService.addSubject(newSubject)
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Subject Added Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
                setModalOpen(false); // Close the modal
                setSubjectName(""); // Clear input fields
                setSubjectCode("");
                setPeriodsPerWeek("");
                fetchSubjects(); // Fetch updated list of subjects
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add subject. Please try again later.',
                });
            });
    };

    const fetchSubjects = () => {
        // Fetch list of subjects from backend
        axios.get("api/subjects")
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

    return (
        <>
            <div className="heading">
                <IconSection.BiBookOpen />
                <span style={{ color: "white" }}>Subject Management</span>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                message="Subject Saved Successifuly 🙂"
            />
            <div className="row align-items-start">
                {subjects.map((subject) => {
                    return (
                        <div className="row" key={subject.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {subject.name}
                                    </h5>
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        20Students
                                    </h6>
                                    <p className="card-text">
                                        Some information and description added
                                        to the Subject.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div
                className="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1
                                className="modal-title fs-5"
                                id="staticBackdropLabel"
                            >
                                Add Subject Details
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="gadgets">
                                {/* Subject name */}
                                <input
                                    type="text"
                                    aria-label="First name"
                                    className="form-control"
                                    placeholder="e.g. English"
                                    id="subjectName"
                                    onChange={(e) =>
                                        setSubjectName(e.target.value)
                                    }
                                    value={subjectName}
                                    name="subjectName"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Fab
                size="medium"
                color="primary"
                aria-label="add"
                id="fab"
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
            >
                <GoPlus size={25} />
            </Fab>

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Box sx={{ mb: 2, bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button variant="contained" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
                    </Box>
                </Box>
            </Modal>

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
                                    <Button variant="contained" color="primary">View</Button>
                                    <Button variant="contained" color="secondary">Edit</Button>
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