import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const Department = () => {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [allocationMessage, setAllocationMessage] = useState(null);
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://127.0.0.1:8000/api/users");
        const classesResponse = await axios.get("http://127.0.0.1:8000/api/classes");
        const subjectsResponse = await axios.get("http://127.0.0.1:8000/api/subjects");

        setUsers(usersResponse.data);
        setSubjects(subjectsResponse.data);
        setClasses(classesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAllocation = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/allocations", {
        email: selectedUser,
        subject: selectedSubject,
        className: selectedClass,
      });
      setAllocationMessage({ type: "success", text: response.data.message });
      // Update allocations after successful allocation
      fetchAllocations();
    } catch (error) {
      console.error("Error allocating user:", error);
      setAllocationMessage({ type: "error", text: "Failed to allocate user" });
    }
  };

  const fetchAllocations = async () => {
    try {
      const allocationsResponse = await axios.get("http://127.0.0.1:8000/api/allocations");
      setAllocations(allocationsResponse.data);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  return (
    <React.Fragment>
      <div className="heading">
        <span style={{ color: "white" }}>Department</span>
      </div>

      {/* Data Entry Form */}
      <div style={{ marginBottom: "20px" }}>
        <TextField
          select
          label="User"
          fullWidth
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          sx={{ marginRight: "10px" }}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.email}>
              {user.firstname} {user.surname} ({user.email})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Subject"
          fullWidth
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          sx={{ marginRight: "10px" }}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.name}>
              {subject.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Class"
          fullWidth
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          sx={{ marginRight: "10px" }}
        >
          {classes.map((classItem) => (
            <MenuItem key={classItem.id} value={classItem.className}>
              {classItem.className}
            </MenuItem>
          ))}
        </TextField>

        <Button
          onClick={handleAllocation}
          variant="contained"
          color="primary"
        >
          Allocate
        </Button>
      </div>

      {/* Allocation Message */}
      {allocationMessage && (
        <Typography
          variant="body2"
          sx={{
            marginTop: "10px",
            backgroundColor: allocationMessage.type === "success" ? "success.main" : "error.main",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {allocationMessage.text}
        </Typography>
      )}

      {/* Allocations Table */}
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Class</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocations.map((allocation, index) => (
              <TableRow key={index}>
                <TableCell>{allocation.email}</TableCell>
                <TableCell>{allocation.name}</TableCell>
                <TableCell>{allocation.className}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default Department;
