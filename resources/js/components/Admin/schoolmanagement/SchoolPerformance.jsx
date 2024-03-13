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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import JSZip from "jszip";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import Docxtemplater from "docxtemplater";
import "./SchoolPerformance.css";

const SchoolPerformance = () => {
  const [reportData, setReportData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [exportType, setExportType] = useState("pdf"); // Default export type is PDF

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/schoolReport");
        setReportData(response.data.data.junior_section);
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

  const handleExportTypeChange = (type) => {
    setExportType(type);
  };

  const handleDownloadReport = () => {
    if (selectedStudent) {
      if (exportType === "pdf") {
        generatePDFReport(selectedStudent);
      } else if (exportType === "word") {
        generateWordReport(selectedStudent);
      }
    }
  };

  const generatePDFReport = (student) => {
    const doc = new jsPDF();
    doc.text(20, 20, `Student Name: ${student.student_name}`);
    // Add more content as needed
    doc.save(`${student.student_name}_report.pdf`);
  };

  const generateWordReport = (student) => {
    axios
      .get("path/to/word/template", { responseType: "arraybuffer" })
      .then((response) => {
        const content = response.data;
        const zip = new JSZip(content);
        const doc = new Docxtemplater().loadZip(zip);
        doc.setData({
          student_name: student.student_name,
          // Add more data as needed
        });
        doc.render();
        const output = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        saveAs(output, `${student.student_name}_report.docx`);
      })
      .catch((error) => {
        console.error("Error fetching word template:", error);
      });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        School Report
      </Typography>
      <div className="button-container">
        <Button variant="contained" onClick={() => handleExportTypeChange("pdf")}>
          Export to PDF
        </Button>
        <Button variant="contained" onClick={() => handleExportTypeChange("word")}>
          Export to Word
        </Button>
        <Button variant="contained" onClick={handleDownloadReport}>
          Download Report
        </Button>
      </div>
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
            {reportData.map((student) => (
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper className="modalPaper">
          {selectedStudent && (
            <div>
              <TableContainer>
                <Table className="studentTable">
                  <TableBody>
                    <Typography>PROGRESS REPORT</Typography>
                    <TableRow>
                      <TableCell className="headerCell">NAME OF STUDENT :{selectedStudent.student_name}</TableCell>
                      <TableCell className="headerCell">POSITION IN CLASS :{selectedStudent.position}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="headerCell">TERM:{selectedStudent.schoolTerm}</TableCell>
                      <TableCell className="headerCell"> CLASS :{selectedStudent.class}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="headerCell">ENROLMENT:{selectedStudent.schoolTerm}</TableCell>
                      <TableCell className="headerCell">CLASS TEACHER :{selectedStudent.class}</TableCell>
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
                  <TableCell className="headerCell">OVERALL</TableCell>
                  <TableCell className="headerCell">{selectedStudent.total_marks}</TableCell>
                  <TableCell className="headerCell">{selectedStudent.overall_grade}</TableCell>
                  <TableCell className="headerCell">{selectedStudent.failed}</TableCell>
                  <TableCell className="headerCell">{}</TableCell>
                </Table>
                <TableRow>
                  <TableCell className="headerCell"><strong>Class Teachers Comment</strong> :{selectedStudent.class_teacher_comment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="headerCell"><strong>Head Teachers Comment</strong> :{selectedStudent.head_teacher_comment}</TableCell>
                </TableRow>
                <h3 className="grading">RANGE OF GRADES</h3>
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
                      <TableCell>70-79</TableCell>
                      <TableCell>70-79</TableCell>
                      <TableCell>70-79</TableCell>
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

export default SchoolPerformance