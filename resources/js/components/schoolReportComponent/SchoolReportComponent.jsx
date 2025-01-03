import React from "react";
import { Modal, Paper, Typography, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const SchoolReportComponent = ({ filteredData }) => {
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
              <th class="headerCell"><strong>Overall Marks:</strong> ${
                  student.total_marks
              }</th>
              <th class="headerCell"><strong>Overall Grade:</strong>${
                  student.overall_grade
              }</th>
              <th class="headerCell"><strong>Remark:</strong> ${
                  student.failed ? "Fail" : "Pass"
              }</th>
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

    return (
        <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={printClassReports}
        >
            Print Class Reports
        </Button>
    );
};

export default SchoolReportComponent;
