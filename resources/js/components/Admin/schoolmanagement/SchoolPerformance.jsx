import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import JSZip from "jszip";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";

import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import Docxtemplater from "docxtemplater";
import SchoolReport from "./SchoolReport";
import "./SchoolPerformance.css";

const SchoolPerformance = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState("All Classes");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/schoolReport"
                );
                console.log(response);
                const { data } = response;
                if (validateApiResponse(data)) {
                    setReportData(data.data.junior_section);
                } else {
                    console.error("Invalid API response");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const validateApiResponse = (data) => {
        if (!data || typeof data !== "object" || !data.data) {
            return false;
        }
        const { junior_section } = data.data;
        if (!Array.isArray(junior_section)) {
            return false;
        }
        for (const student of junior_section) {
            if (
                typeof student !== "object" ||
                typeof student.student_id === "undefined" ||
                typeof student.student_name !== "string" ||
                typeof student.class !== "string"
            ) {
                return false;
            }
        }
        return true;
    };

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (selectedClass) => {
    setAnchorEl(null);
    setSelectedClass(selectedClass);

    if (selectedClass === "All Classes") {
      setFilteredData(reportData);
    } else {
      const filtered = reportData.filter(student => student.class === selectedClass);
      setFilteredData(filtered);
    }
  };

  const printClassReports = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>School Reports</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(`
    body { font-family: Arial, sans-serif; margin: 20px; }
    .report-container { page-break-after: always; margin-bottom: 20px; }
    .header { text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    th, td { border: 1px solid black; padding: 4px; text-align: left; }
    th { background-color: #f2f2f2; }
    .h2,h3,h4,h1{
      text-align:center;
    }
  `);
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");

    filteredData.forEach((student) => {
        printWindow.document.write(`
            <div class="report-container">
             
                <div class="student-info">

                <h1 >PUTEYA DAY SECONDARY SCHOOL</h1>
                <h3>POST OFFICE BOX 177</h3>
                 <h3>Chilema</h3>
              
                 <h3>PROGRESS REPORT</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td class="headerCell" colspan="2">NAME OF STUDENT: ${student.student_name}</td>
                                <td class="headerCell" colspan="2">POSITION IN CLASS: ${student.position}</td>
                            </tr>
                            <tr>
                                <td class="headerCell" colspan="2">TERM: ${student.schoolTerm}</td>
                                <td class="headerCell" colspan="2">CLASS: ${student.class}</td>
                            </tr>
                            <tr>
                                <td class="headerCell" colspan="2">ENROLMENT: ${student.enrolment}</td>
                                <td class="headerCell" colspan="2">CLASS TEACHER: ${student.classTeacher}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        `);

        // Print assessment table
        printWindow.document.write(`
            <table class="assessmentTable">
                <thead>
                    <tr>
                        <th class="headerCell">ASSESSMENT NAME</th>
                        <th class="headerCell">SCORE</th>
                        <th class="headerCell">GRADE</th>
                        <th class="headerCell">REMARK</th>
                        <th class="headerCell">TEACHER</th>
                    </tr>
                </thead>
                <tbody>
        `);

        student.assessments.forEach((assessment) => {
            printWindow.document.write(`
                <tr>
                    <td>${assessment.assessment_name}</td>
                    <td>${assessment.score}</td>
                    <td>${assessment.grade}</td>
                    <td>${assessment.remark}</td>
                    <td>${assessment.teacherEmail}</td>
                </tr>
            `);
        });

        printWindow.document.write(`
        <table class="assessmentTable">
            <thead>
                <tr>
                    <th class="headerCell"><strong>Overall Marks:</strong> ${student.total_marks}</th>
                    <th class="headerCell"><strong>Overall Grade:</strong>${student.overall_grade}</th>
                    <th class="headerCell"><strong>Remark:</strong> ${student.failed ? "Fail" : "Pass"}</th>
                </tr>
            </thead>
            <tbody>
    `);

        printWindow.document.write(`
                </tbody>
            </table>
        `);

        // Print additional student data and range of grades
        printWindow.document.write(`
            <div class="additional-info">
              
                <p><strong>Class Teacher's Comment:</strong> ${student.class_teacher_comment}</p>
                <p><strong>Head Teacher's Comment:</strong> ${student.head_teacher_comment}</p>
                <h3 class="grading">Range of Grades</h3>
                <table class="grading">
                    <thead>
                        <tr>
                            <th class="headerCell">A</th>
                            <th class="headerCell">B</th>
                            <th class="headerCell">C</th>
                            <th class="headerCell">D</th>
                            <th class="headerCell">F</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>80-100</td>
                            <td>70-79</td>
                            <td>60-69</td>
                            <td>50-59</td>
                            <td>0-49</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        `);
    });

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
};


  return (
    <div>
      <Typography variant="h4" gutterBottom>
        School Report
      </Typography>
      <Button
        variant="contained"
        onClick={handleMenuClick}
        style={{ marginBottom: '20px' }}
      >
        {selectedClass}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose(selectedClass)}
      >
        <MenuItem onClick={() => handleMenuClose("All Classes")}>All Classes</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Form 1")}>Form 1</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Form 2")}>Form 2</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Form 3")}>Form 3</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Form 4")}>Form 4</MenuItem>
      </Menu>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((student) => (
              <TableRow key={student.student_id} className="tableRow">
                <TableCell>{student.student_id}</TableCell>
                <TableCell>{student.student_name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(student)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        startIcon={<PrintIcon />}
        onClick={printClassReports}
        style={{ marginTop: '20px' }}
      >
        Print {selectedClass} Reports
      </Button>
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
                        NAME OF STUDENT: {selectedStudent.student_name}
                      </TableCell>
                      <TableCell className="headerCell">
                        POSITION IN CLASS: {selectedStudent.position}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="headerCell">
                        TERM: {selectedStudent.schoolTerm}
                      </TableCell>
                      <TableCell className="headerCell">
                        CLASS: {selectedStudent.class}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="headerCell">
                        ENROLMENT: {selectedStudent.enrolment}
                      </TableCell>
                      <TableCell className="headerCell">
                        CLASS TEACHER: {selectedStudent.classTeacher}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer>
                <Table className="assessmentTable">
                  <TableHead>
                    <TableRow>
                      <TableCell className="headerCell">ASSESSMENT NAME</TableCell>
                      <TableCell className="headerCell">SCORE</TableCell>
                      <TableCell className="headerCell">GRADE</TableCell>
                      <TableCell className="headerCell">REMARK</TableCell>
                      <TableCell className="headerCell">TEACHER</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedStudent.assessments.map((assessment) => (
                      <TableRow key={assessment.assessment_name}>
                        <TableCell>{assessment.assessment_name}</TableCell>
                        <TableCell>{assessment.score}</TableCell>
                        <TableCell>{assessment.grade}</TableCell>
                        <TableCell>{assessment.remark}</TableCell>
                        <TableCell>{assessment.teacherEmail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableRow>
                  <TableCell className="headerCell">OVERALL</TableCell>
                  <TableCell className="headerCell">{selectedStudent.total_marks}</TableCell>
                  <TableCell className="headerCell">{selectedStudent.overall_grade}</TableCell>
                  <TableCell className="headerCell">{selectedStudent.failed ? "Fail" : "Pass"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="headerCell">
                    <strong>Class Teacher's Comment:</strong> {selectedStudent.class_teacher_comment}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="headerCell">
                    <strong>Head Teacher's Comment:</strong> {selectedStudent.head_teacher_comment}
                  </TableCell>
                </TableRow>
                <Typography variant="h6" gutterBottom className="grading">
                  RANGE OF GRADES
                </Typography>
                <Table className="assessmentTable">
                  <TableHead>
                    <TableRow>
                      <TableCell className="headerCell">A</TableCell>
                      <TableCell className="headerCell">B</TableCell>
                      <TableCell className="headerCell">C</TableCell>
                      <TableCell className="headerCell">D</TableCell>
                      <TableCell className="headerCell">F</TableCell>
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
              </TableContainer>
            </div>
          )}
        </Paper>
      </Modal>
    </div>
  );
};

export default SchoolPerformance;
