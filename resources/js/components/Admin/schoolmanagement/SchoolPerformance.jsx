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
import PrintIcon from "@mui/icons-material/Print";
import { MaterialReactTable } from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./SchoolPerformance.css";

const SchoolPerformance = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState("All Classes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/schoolReport");
        if (response.data && response.data.data && response.data.data.junior_section) {
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
      const filtered = reportData.filter((student) => student.class === newValue);
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
      .h2,h3,h4{
        text-align:center;
      }
    `);
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");

    filteredData.forEach((student) => {
      printWindow.document.write(`
        <div class="report-container">
          <div class="student-info">
            <h1>PUTEYA DAY SECONDARY SCHOOL</h1>
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
    <Box display="flex" justifyContent="flex-end" style={{ marginTop: "20px" }}>
      <Button variant="contained" startIcon={<PrintIcon />} onClick={printClassReports}>
        Print {selectedClass} Reports
      </Button>
    </Box>
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
            </TableContainer>
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
          </div>
        )}
      </Paper>
    </Modal>
  </div>
);

};
export default SchoolPerformance;
