import React, { useEffect, useState } from "react";
import "./admindash.css";
import axios from "axios";
import { FiHome } from "react-icons/fi";
import studentsPng from "../../../../assets/icons8-students-94.png";
import teachersPng from "../../../../assets/icons8-teacher-64.png";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FaUser, FaInfo, FaFolderOpen } from "react-icons/fa";
import { IconContext } from "react-icons";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery, Switch, Typography } from "@mui/material";
import CustomPaper from "../../../components/Paper/CustomPaper";
import NavbarComponent from "../../../components/NavBarComponent/NavbarComponent";
import NivoChartComponent from "../../../components/NivoPieChartComponent/NivoChartComponent";
import NivoLineChartComponent from "../../../components/NivoLineChartComponent/NivoLineChartComponent";
import { BreadcrumbComponent } from "../../../components/BreadcrumbComponent/BreadcrumbComponent";
import CustomTableComponent from "../../../components/CustomTableComponents/CustomTableComponent";
import { DashbordUsersColumns } from "../../../../core/TableColumns";
import { DashboardUsersDummyData } from "../../../../core/DashbordUsersDummydata";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { defaults } from "chart.js/auto";

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

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";
defaults.plugins.title.align = "start";
defaults.plugins.title.display = true;
export default function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const loggedIn = window.atob(localStorage.getItem("loggedIn"));
    const role = window.atob(localStorage.getItem("role"));
    const accessKey = localStorage.getItem("key");
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    useEffect(() => {
        if (prefersDarkMode) setDarkMode(false);
    }, [prefersDarkMode]);

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${accessKey}`,
        };

        const getUsers = () =>
            axios.get("http://127.0.0.1:8000/api/users", { headers });
        const getStudents = () =>
            axios.get("http://127.0.0.1:8000/api/students", { headers });

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

    const cardData = [
        {
            title: "Department",
            icon: <FaUser />,
            color: "primary",
            link: "/department",
        },
        {
            title: "Assessment",
            icon: <FaInfo />,
            color: "success",
            link: "/assessment",
        },
        {
            title: "Information",
            icon: <FaFolderOpen />,
            color: "info",
            link: "/information",
        },
    ];

    const statisticalData = [
        { menu: "Students", image: studentsPng, number: students.length },
        { menu: "Teachers", image: teachersPng, number: users.length },
        { menu: "Students", image: studentsPng, number: 0 },
        { menu: "Students", image: studentsPng, number: 0 },
    ];

    const isAdminOrHeadTeacher = loggedIn && role === "admin";
    const isTeacher = loggedIn && role === "Teacher";

    const theme = lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div
                className=""
                // className={`w-full ${
                //     darkMode
                //         ? "bg-gray-800 text-white"
                //         : "bg-[#f3f3f3] text-gray-900"
                // }`}
            >
                <NavbarComponent activePage="Dashboard" />

                <div className="pl-5">
                    <BreadcrumbComponent activePage="Home" />
                </div>

                {isAdminOrHeadTeacher ? (
                    <>
                        <div>
                            <div className="lg:grid lg:grid-cols-4 lg:gap-4 p-4">
                                {statisticalData.map((stat) => (
                                    <div className="" key={stat.menu}>
                                        <CustomPaper
                                            count={stat.number}
                                            heading={stat.menu}
                                            square={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-row gap-3">
                            <div className="bg-white rounded-xl ml-[2rem] p-4 h-[30rem] w-[55%]">
                                {/* TODO: make this a component later */}
                                <Line
                                    key="line-chart"
                                    data={{
                                        labels: [
                                            "2020",
                                            "2021",
                                            "2022",
                                            "2023",
                                            "2024",
                                            "2025",
                                        ],
                                        datasets: [
                                            {
                                                label: "Boys Pass Rate",
                                                data: [30, 45, 48, 50, 43, 40],
                                                fill: true,
                                                backgroundColor:
                                                    "rgba(75,192,192,0.2)",
                                                borderColor:
                                                    "rgba(75,192,192,1)",
                                            },
                                            {
                                                label: "Girls Pass Rate",
                                                data: [35, 40, 65, 20, 55, 20],
                                                fill: true,
                                                backgroundColor:
                                                    "rgba(255,99,132,0.2)",
                                                borderColor:
                                                    "rgba(255,99,132,1)",
                                            },
                                        ],
                                    }}
                                    options={{
                                        elements: {
                                            line: {
                                                tension: 0.4,
                                            },
                                        },
                                        plugins: {
                                            title: {
                                                text: "Boys & Girls Passing Rates ",
                                            },
                                        },
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: "Year",
                                                },
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: "Pass Rate (%)",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                            <div className="flex flex-row gap-3">
                                <div className="bg-white rounded-xl h-[30rem] p-6">
                                    <Doughnut
                                        data={{
                                            labels: ["boys", "girls"],
                                            datasets: [
                                                {
                                                    label: "Boys Pass Rate",
                                                    data: [45, 55],
                                                    fill: true,
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: "Gender Statistics",
                                                },
                                            },
                                        }}
                                    />
                                </div>
                                <div className="bg-white rounded-xl h-[30rem] p-6">
                                    <Doughnut
                                        data={{
                                            labels: ["boys", "girls"],
                                            datasets: [
                                                {
                                                    label: "Boys Pass Rate",
                                                    data: [45, 55],
                                                    fill: true,
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: "Gender Statistics",
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4">
                            <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
                                <CustomTableComponent
                                    columns={DashbordUsersColumns}
                                    data={DashboardUsersDummyData}
                                />
                            </div>
                            <div className="w-1/2 bg-white shadow-md rounded-lg">
                                <Line
                                    data={{
                                        labels: ["A", "B", "C"],
                                        datasets: [
                                            {
                                                lable: "No. students",
                                                data: [0, 55, 50],
                                            },
                                        ],
                                    }}
                                />
                            </div>
                        </div>

                        <div className=" mt-[-1%] ml-5 mr-5 ">
                            <div className="w-full bg-white shadow-md rounded-lg">
                                <h2 className="text-2xl font-bold m-3 px-4">
                                    School performance
                                </h2>
                                <div className="px-4">
                                    <NivoLineChartComponent />
                                </div>
                            </div>
                        </div>
                    </>
                ) : isTeacher ? (
                    <>
                        <div className="heading">
                            <FiHome />
                            <span style={{ color: "white" }}>
                                Teacher Dashboard - Home
                            </span>
                        </div>
                        <Container>
                            <Row>
                                {cardData.map((card, index) => (
                                    <Col sm={4} key={index}>
                                        <Card
                                            bg={card.color}
                                            text="white"
                                            style={{
                                                width: "18rem",
                                                cursor: "pointer",
                                            }}
                                            className="mb-2"
                                            onClick={() =>
                                                window.location.assign(
                                                    card.link
                                                )
                                            }
                                        >
                                            <Card.Header>
                                                <IconContext.Provider
                                                    value={{
                                                        size: "2em",
                                                        className: "mr-2",
                                                    }}
                                                >
                                                    {card.icon}
                                                </IconContext.Provider>
                                                {card.title}
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    {/* Add relevant content for the Teacher dashboard */}
                                                </Card.Text>
                                                <p
                                                    style={{
                                                        textAlign: "center",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    More Info
                                                </p>
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
