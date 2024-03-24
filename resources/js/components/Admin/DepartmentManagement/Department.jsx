import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import {
    Box,
    IconButton,
    Tooltip,
    Collapse,
    TableCell,
    TableRow,
    Modal,
    Backdrop,
    Fade,
    Button,
    TextField,
    Typography,
    Paper,
    MenuItem,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const Department = () => {
    // State variables for department management
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [allocationMessage, setAllocationMessage] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const usersResponse = await axios.get("http://127.0.0.1:8000/api/users");
          const classesResponse = await axios.get("http://127.0.0.1:8000/api/classes");
          const subjectsResponse = await axios.get("http://127.0.0.1:8000/api/subjects");
    
          setUsers(usersResponse.data);
      
          setSubjects(subjectsResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchData();
    }, []);
    // Event handler to allocate user to subject and class
    const handleAllocation = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/allocations", {
                email: selectedUser,
                subject: selectedSubject,
                className: selectedClass,
            });
            setAllocationMessage({ type: "success", text: response.data.message });
        } catch (error) {
            setAllocationMessage({ type: "error", text: error.response?.data?.message || "An error occurred while allocating user." });
        }
    };

    return (
        <React.Fragment>
            <div className="heading">
                <span style={{ color: "white" }}>Department</span>
            </div>

            {/* User Selection */}
            <TextField
                select
                label="User"
                fullWidth
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                sx={{ mt: 2 }}
            >
                {users.map((user) => (
                    <MenuItem key={user.id} value={user.email}>
                        {user.firstname} {user.surname} ({user.email})
                    </MenuItem>
                ))}
            </TextField>

            {/* Subject Selection */}
            <TextField
                select
                label="Subject"
                fullWidth
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                sx={{ mt: 2 }}
            >
                {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.name}>
                        {subject.name}
                    </MenuItem>
                ))}
            </TextField>

            {/* Class Selection */}
            <TextField
                select
                label="Class"
                fullWidth
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                sx={{ mt: 2 }}
            >
                {classes.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.className}>
                        {classItem.className}
                    </MenuItem>
                ))}
            </TextField>

            {/* Allocation Button */}
            <Button
                onClick={handleAllocation}
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", mt: 2 }}
            >
                Allocate
            </Button>

            {/* Allocation Message */}
            {allocationMessage && (
                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        backgroundColor: allocationMessage.type === "success" ? "success.main" : "error.main",
                        color: "white",
                        padding: 1,
                        borderRadius: 4,
                    }}
                >
                    {allocationMessage.text}
                </Typography>
            )}
        </React.Fragment>
    );
};

export default Department;
