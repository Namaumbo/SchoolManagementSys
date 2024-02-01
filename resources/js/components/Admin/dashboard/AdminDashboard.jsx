import React, { useEffect, useState } from "react";
import "./admindash.css";
import { useRecoilState } from "recoil";
import { userState } from "@/components/User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import { FiHome } from "react-icons/fi";
import axios from "axios";
import studentsPng from "../../../../assets/icons8-students-94.png";
import teachersPng from "../../../../assets/icons8-teacher-64.png";
import moneyPng from "../../../../assets/icons8-money-48.png";
import Test from "../../../Test";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FaUser, FaInfo, FaFolderOpen } from "react-icons/fa";
import { IconContext } from "react-icons";
import Grid from "@mui/material/Grid";

export default function AdminDashboard() {
    const [userInfo, setUserInfo] = useRecoilState(userDetails);
    const [data, setData] = useState([]);
    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("role");
    const accessKey = localStorage.getItem("key");

    useEffect(() => {
        async function getUsers() {
            const headers = {
                Authorization: `Bearer ${accessKey}`,
            };
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/users", {
                    headers,
                });
                setUserInfo(res.data);
                setData(res.data.users); // Assuming the user data is in a 'users' property
            } catch (err) {
                // #TODO: Error handling propally give the error in a proper way
                alert(err.message);
                console.error(err);
            }
        }

        getUsers().then(null);
    }, [accessKey, setUserInfo]);

    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "firstname", headerName: "First name", width: 130 },
        { field: "surname", headerName: "Last name", width: 130 },
        { field: "sex", headerName: "Sex", type: "String", width: 10 },
        { field: "email", headerName: "Email", type: "String", width: 180 },
        { field: "role_name", headerName: "Role", width: 100 },
    ];

    const rows = data;

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
        {
            menu: "students",
            image: studentsPng,
            number: rows.length ? rows.length : 0,
        },
        {
            menu: "teachers",
            image: teachersPng,
            number: rows.length ? rows.length : 0,
        },
        {
            menu: "students",
            image: studentsPng,
            number: rows.length ? rows.length : 0,
        },
        {
            menu: "students",
            image: studentsPng,
            number: rows.length ? rows.length : 0,
        },
    ];
    const isAdminOrHeadTeacher =
        window.atob(loggedIn) && window.atob(role) === "Admin";
    const isTeacher = loggedIn && role === "Teacher";

    if (isAdminOrHeadTeacher) {
        return (
            <div className="main">
                <div className="heading">
                    <FiHome />
                    <span style={{ color: "white" }}>Dashboard - Home</span>
                </div>

                <div className="container text-center">
                    <div className="row">
                        {statisticalData.map((stat) => {
                            return (
                                <div className="col" key={stat.menu}>
                                    <div className="cardMn">
                                        <div>
                                            <img
                                                className="arts"
                                                src={stat.image}
                                                alt="students"
                                            />
                                            <span className="name-title">
                                                {stat.title}
                                            </span>
                                        </div>
                                        <div className="figure">
                                            <h4 className="numbers">
                                                {stat.number}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-7">
                            <p>Users Available</p>

                            <table>
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column.field}>
                                                {column.headerName}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((user, index) => (
                                        <tr key={user.firstname}>
                                            {columns.map((column) => (
                                                <td key={column.field}>
                                                    {user[column.field]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div class="col-4">
                            <p>Revenue Summary</p>
                            <Test />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (isTeacher) {
        return (
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
                                        window.location.assign(card.link)
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
                                            More Info{" "}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </>
        );
    } else {
        return <p>You do not have permission to access this dashboard.</p>;
    }
}
