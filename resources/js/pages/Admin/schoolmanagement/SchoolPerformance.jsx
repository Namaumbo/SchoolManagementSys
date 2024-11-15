import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Modal,
    Paper,
    Typography,
    Button,
    Tabs,
    Tab,
    Box,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./SchoolPerformance.css";
import SchoolReportComponent from "../../../components/schoolReportComponent/SchoolReportComponent";

const SchoolPerformance = () => {
    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedClass, setSelectedClass] = useState("All Classes");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/schoolReport"
                );
                if (
                    response.data &&
                    response.data.data &&
                    response.data.data.junior_section
                ) {
                    setReportData(response.data.data.junior_section);
                    setFilteredData(response.data.data.junior_section);
                } else {
                    console.error("Invalid API response");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleClassChange = (event, newValue) => {
        setSelectedClass(newValue);

        if (newValue === "All Classes") {
            setFilteredData(reportData);
        } else {
            const filtered = reportData.filter(
                (student) => student.class === newValue
            );
            setFilteredData(filtered);
        }
    };
    const columns = [
        {
            accessorKey: "student_id",
            header: "Student ID",
        },
        {
            accessorKey: "student_name",
            header: "Student Name",
        },
        {
            accessorKey: "class",
            header: "Class",
        },
        {
            accessorKey: "actions",
            header: "View",
            Cell: ({ row }) => (
                <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(row.original)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="school-performance-wrapper">
            <Typography variant="h4" gutterBottom>
                School Report
            </Typography>
            <Tabs
                value={selectedClass}
                onChange={handleClassChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="class tabs"
                style={{ marginBottom: "20px" }}
            >
                <Tab label="All Classes" value="All Classes" />
                <Tab label="Form 1" value="Form 1" />
                <Tab label="Form 2" value="Form 2" />
                <Tab label="Form 3" value="Form 3" />
                <Tab label="Form 4" value="Form 4" />
            </Tabs>
            <MaterialReactTable columns={columns} data={filteredData} />
            <Box
                display="flex"
                justifyContent="flex-end"
                style={{ marginTop: "20px" }}
            >

                {/* <Button
                    variant="contained"
                    startIcon={<PrintIcon color="success" />}
                    onClick={printClassReports}
                >
                    Print {selectedClass} Reports
                </Button> */}

                <SchoolReportComponent />
            </Box>

            {/*------------------------- MODAL--------------------------- */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Paper className="modalPaper">
                    {selectedStudent && (
                        <div>
                            <Typography variant="h4" gutterBottom>
                                PROGRESS REPORT
                            </Typography>
                            <TableContainer>
                                <Table className="studentTable">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="headerCell">
                                                NAME OF STUDENT:{" "}
                                                {selectedStudent.student_name}
                                            </TableCell>
                                            <TableCell className="headerCell">
                                                POSITION IN CLASS:{" "}
                                                {selectedStudent.position}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="headerCell">
                                                TERM:{" "}
                                                {selectedStudent.schoolTerm}
                                            </TableCell>
                                            <TableCell className="headerCell">
                                                CLASS: {selectedStudent.class}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="headerCell">
                                                ENROLMENT:{" "}
                                                {selectedStudent.enrolment}
                                            </TableCell>
                                            <TableCell className="headerCell">
                                                CLASS TEACHER:{" "}
                                                {selectedStudent.classTeacher}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TableContainer>
                                <Table className="assessmentTable">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="headerCell">
                                                ASSESSMENT NAME
                                            </TableCell>
                                            <TableCell className="headerCell">
                                                SCORE
                                            </TableCell>
                                            <TableCell className="headerCell">
                                                GRADE
                                            </TableCell>
                                            <TableCell className="headerCell">
                                                REMARK
                                            </TableCell>
                                            <TableCell className="headerCell">
                                                TEACHER
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedStudent.assessments.map(
                                            (assessment) => (
                                                <TableRow
                                                    key={
                                                        assessment.assessment_name
                                                    }
                                                >
                                                    <TableCell>
                                                        {
                                                            assessment.assessment_name
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {assessment.score}
                                                    </TableCell>
                                                    <TableCell>
                                                        {assessment.grade}
                                                    </TableCell>
                                                    <TableCell>
                                                        {assessment.remark}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            assessment.teacherEmail
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TableRow>
                                <TableCell className="headerCell">
                                    OVERALL
                                </TableCell>
                                <TableCell className="headerCell">
                                    {selectedStudent.total_marks}
                                </TableCell>
                                <TableCell className="headerCell">
                                    {selectedStudent.overall_grade}
                                </TableCell>
                                <TableCell className="headerCell">
                                    {selectedStudent.failed ? "Fail" : "Pass"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="headerCell">
                                    <strong>Class Teacher's Comment:</strong>{" "}
                                    {selectedStudent.class_teacher_comment}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="headerCell">
                                    <strong>Head Teacher's Comment:</strong>{" "}
                                    {selectedStudent.head_teacher_comment}
                                </TableCell>
                            </TableRow>
                            <Typography
                                variant="h6"
                                gutterBottom
                                className="grading"
                            >
                                RANGE OF GRADES
                            </Typography>
                            <Table className="assessmentTable">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="headerCell">
                                            A
                                        </TableCell>
                                        <TableCell className="headerCell">
                                            B
                                        </TableCell>
                                        <TableCell className="headerCell">
                                            C
                                        </TableCell>
                                        <TableCell className="headerCell">
                                            D
                                        </TableCell>
                                        <TableCell className="headerCell">
                                            F
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>80-100</TableCell>
                                        <TableCell>70-79</TableCell>
                                        <TableCell>60-69</TableCell>
                                        <TableCell>50-59</TableCell>
                                        <TableCell>0-49</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Paper>
            </Modal>
        </div>
    );
};
export default SchoolPerformance;
