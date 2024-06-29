import React, { useState, useEffect } from "react";
import { Card, Button, Grid, Icon } from "semantic-ui-react";
import { MaterialReactTable } from "material-react-table"; // Assuming this is the correct named export
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, TextField, Typography, Box, Fab } from '@mui/material';
import { GoPlus } from "react-icons/go";
import * as IconSection from "react-icons/bi";

const Classes = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [className, setClassName] = useState("");
    const [classMonitor, setClassMonitor] = useState("");
    const [classTeacher, setClassTeacher] = useState("");
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/classes");
            setClasses(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchStudents = async (classId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/classes/${classId}/students`);
            setStudents(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setClassName("");
        setClassMonitor("");
        setClassTeacher("");
    };

    const handleSubmit = async () => {
        const newClass = {
            name: className,
            monitor: classMonitor,
            teacher: classTeacher
        };

        try {
            await axios.post("http://127.0.0.1:8000/api/classes", newClass);
            Swal.fire({
                icon: 'success',
                title: 'Class Added Successfully',
                showConfirmButton: false,
                timer: 1500
            });
            setModalOpen(false);
            fetchClasses();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add class. Please try again later.',
            });
        }
    };

    const handleCardClick = (cls) => {
        setSelectedClass(cls);
        fetchStudents(cls.id);
    };

    const renderClassDashboard = () => {
        if (!selectedClass) return null;
        return (
            <div>
                <h2>{selectedClass.name} Dashboard</h2>
                <p>Class Monitor: {selectedClass.monitor}</p>
                <p>Class Teacher: {selectedClass.teacher}</p>
                <MaterialReactTable 
                    columns={[
                        { header: 'Student ID', accessorKey: 'id' },
                        { header: 'Name', accessorKey: 'name' },
                        { header: 'Age', accessorKey: 'age' },
                        { header: 'Grade', accessorKey: 'grade' },
                    ]} 
                    data={students} 
                />
            </div>
        );
    };

    const cardColors = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFF9C4", "#D1C4E9", "#FFCCBC"];
    
    const getCardColor = (index) => {
        return cardColors[index % cardColors.length];
    };

    return (
        <>
            <div className="heading">
                <IconSection.BiBookOpen />
                <span style={{ color: "white" }}>Class Management</span>
            </div>

            <Fab size="medium" color="primary" aria-label="add" id="fab" onClick={handleModalOpen}>
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
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: 400, 
                        bgcolor: 'background.paper', 
                        boxShadow: 24, 
                        p: 4, 
                        borderRadius: 2 
                    }}
                >
                    <Box sx={{ mb: 2, bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
                        <Typography variant="h6" component="div" align="center">
                            Add Class
                        </Typography>
                    </Box>
                    <TextField
                        margin="normal"
                        label="Class Name"
                        variant="outlined"
                        fullWidth
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        label="Class Monitor"
                        variant="outlined"
                        fullWidth
                        value={classMonitor}
                        onChange={(e) => setClassMonitor(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        label="Class Teacher"
                        variant="outlined"
                        fullWidth
                        value={classTeacher}
                        onChange={(e) => setClassTeacher(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button variant="contained" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
                    </Box>
                </Box>
            </Modal>

            <Grid>
                {classes.map((cls, index) => (
                    <Grid.Column key={index} width={4}>
                        <Card 
                            style={{ backgroundColor: getCardColor(index) }} 
                            onClick={() => handleCardClick(cls)}
                        >
                            <Card.Content>
                                <Card.Header>{cls.name}</Card.Header>
                                <Card.Meta>Monitor: {cls.monitor}</Card.Meta>
                                <Card.Description>
                                    Teacher: {cls.teacher}
                                    <Button 
                                        icon 
                                        labelPosition="right" 
                                        style={{ float: 'right', marginTop: '-10px' }}
                                    >
                                        More
                                        <Icon name='arrow right' />
                                    </Button>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                ))}
            </Grid>

            {selectedClass && (
                <div style={{ marginTop: "20px" }}>
                    {renderClassDashboard()}
                </div>
            )}
        </>
    );
};

export default Classes;
