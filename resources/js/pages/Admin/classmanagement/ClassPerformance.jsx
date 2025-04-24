import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table } from "semantic-ui-react";

const ClassPerformance = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/class/${classId}/performance`);
        setStudents(response.data.students);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const renderAssessments = (assessments) => {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Subject</Table.HeaderCell>
            <Table.HeaderCell>First Assessment</Table.HeaderCell>
            <Table.HeaderCell>Second Assessment</Table.HeaderCell>
            <Table.HeaderCell>End of Term Assessment</Table.HeaderCell>
            <Table.HeaderCell>Average Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {assessments.map((assessment) => (
            <Table.Row key={assessment.id}>
              <Table.Cell>{assessment.subject.name}</Table.Cell>
              <Table.Cell>{assessment.firstAssessment}</Table.Cell>
              <Table.Cell>{assessment.secondAssessment}</Table.Cell>
              <Table.Cell>{assessment.endOfTermAssessment}</Table.Cell>
              <Table.Cell>{assessment.averageScore}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };

  const renderStudents = () => {
    return students.map((student) => (
      <div key={student.id}>
        <h3>{`${student.firstname} ${student.surname}`}</h3>
        <p>Username: {student.username}</p>
        <p>Sex: {student.sex}</p>
        <p>Village: {student.village}</p>
        <p>Traditional Authority: {student.traditional_authority}</p>
        <p>District: {student.district}</p>
        <p>Class Name: {student.className}</p>
        <p>Role Name: {student.role_name}</p>
        <p>Created At: {student.created_at}</p>
        <p>Updated At: {student.updated_at}</p>
        <h4>Assessments:</h4>
        {renderAssessments(student.assessments)}
        <Button onClick={() => window.print()} primary>
          Print
        </Button>
      </div>
    ));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Class Performance</h2>
      {renderStudents()}
    </div>
  );
};

export default ClassPerformance;

