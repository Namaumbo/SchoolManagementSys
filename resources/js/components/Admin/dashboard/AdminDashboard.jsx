import React, { useEffect, useState } from "react";
import "./admindash.css";
import axios from "axios";
import { FiHome } from "react-icons/fi";
import studentsPng from "../../../../assets/icons8-students-94.png";
import teachersPng from "../../../../assets/icons8-teacher-64.png";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FaUser, FaInfo, FaFolderOpen } from "react-icons/fa";
import { IconContext } from "react-icons";
import Test from "../../../Test";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery, Switch } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const loggedIn = window.atob(localStorage.getItem("loggedIn"));
  const role = window.atob(localStorage.getItem("role"));
  const accessKey = localStorage.getItem("key");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (prefersDarkMode) setDarkMode(true);
  }, [prefersDarkMode]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${accessKey}`,
    };

    const getUsers = () => axios.get("http://127.0.0.1:8000/api/users", { headers });
    const getStudents = () => axios.get("http://127.0.0.1:8000/api/students", { headers });

    Promise.allSettled([getUsers(), getStudents()])
      .then((responses) => {
        const [userResponses, studentResponses] = responses;
        if (userResponses.status === "fulfilled") {
          setUsers(userResponses.value.data.users);
        }
        if (studentResponses.status === "fulfilled") {
          setStudents(studentResponses.value.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [accessKey]);

  const columns = [
    { accessorKey: "id", header: "ID", size: 50 },
    { accessorKey: "firstname", header: "First name", size: 130 },
    { accessorKey: "surname", header: "Last name", size: 130 },
    { accessorKey: "sex", header: "Sex", size: 50 },
    { accessorKey: "email", header: "Email", size: 180 },
    { accessorKey: "role_name", header: "Role", size: 100 },
  ];

  const cardData = [
    { title: "Department", icon: <FaUser />, color: "primary", link: "/department" },
    { title: "Assessment", icon: <FaInfo />, color: "success", link: "/assessment" },
    { title: "Information", icon: <FaFolderOpen />, color: "info", link: "/information" },
  ];

  const statisticalData = [
    { menu: "Students", image: studentsPng, number: students.length },
    { menu: "Teachers", image: teachersPng, number: users.length },
    { menu: "Students", image: studentsPng, number: 0 },
    { menu: "Students", image: studentsPng, number: 0 },
  ];

  const isAdminOrHeadTeacher = loggedIn && role === "admin";
  const isTeacher = loggedIn && role === "Teacher";

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`w-full ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <div className="flex justify-between items-center p-3 w-[98%] m-auto rounded-md shadow-md mb-3">
          <div className="flex items-center">
            <FiHome size="23px" />
            <span className="text-xl pl-2">Dashboard - Home</span>
          </div>
          <div>
            <span>Dark Mode</span>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>

        {isAdminOrHeadTeacher ? (
          <>
            <div className="container">
              <div className="lg:grid lg:grid-cols-4 lg:gap-4 p-4">
                {statisticalData.map((stat) => (
                  <div key={stat.menu}>
                    <div className="card-list border p-3 rounded-md flex flex-row items-center shadow-sm">
                      <div>
                        <img className="w-12 h-12 m-2" src={stat.image} alt={stat.menu} />
                        <span className="font-bold">{stat.menu}</span>
                      </div>
                      <div className="figure">
                        <h4 className="text-5xl border-l-4 pl-2">{stat.number}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="container grid grid-cols-2 gap-4 p-4">
              <div className="h-[95%] border shadow-md rounded-md">
                <p>Revenue Summary</p>
                <Test />
              </div>
              <div className="h-[95%] border shadow-md rounded-md">
                <p>Performance Summary</p>
                <Test />
              </div>
            </div>

            <div className="border shadow-md p-4 overflow-x-auto">
              <MaterialReactTable
                columns={columns}
                data={users}
                enableRowSelection
                enableStickyHeader
                enableStickyFooter
                muiTableContainerProps={{
                  className: "max-h-96"
                }}
              />
            </div>
          </>
        ) : isTeacher ? (
          <>
            <div className="heading">
              <FiHome />
              <span style={{ color: "white" }}>Teacher Dashboard - Home</span>
            </div>
            <Container>
              <Row>
                {cardData.map((card, index) => (
                  <Col sm={4} key={index}>
                    <Card
                      bg={card.color}
                      text="white"
                      style={{ width: "18rem", cursor: "pointer" }}
                      className="mb-2"
                      onClick={() => window.location.assign(card.link)}
                    >
                      <Card.Header>
                        <IconContext.Provider value={{ size: "2em", className: "mr-2" }}>
                          {card.icon}
                        </IconContext.Provider>
                        {card.title}
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          {/* Add relevant content for the Teacher dashboard */}
                        </Card.Text>
                        <p style={{ textAlign: "center", marginTop: "20px" }}>More Info</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </>
        ) : (
          <p>You do not have permission to access this dashboard.</p>
        )}
      </div>
    </ThemeProvider>
  );
}
