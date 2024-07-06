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
import { MaterialReactTable } from "material-react-table";

export default function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [data, setData] = useState([]);
    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("role");
    const accessKey = localStorage.getItem("key");

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${accessKey}`,
        };

        function getUsers() {
            return axios({
                method: "GET",
                url: "http://127.0.0.1:8000/api/users",
                headers: headers,
            });
        }

        function getStudents() {
            return axios({
                method: "GET",
                url: "http://127.0.0.1:8000/api/students",
                headers: headers,
            });
        }

        Promise.allSettled([getUsers(), getStudents()])
            .then((responses) => {
                const userResponses = responses[0];
                const studentsResponses = responses[1];
                if (userResponses.status === "fulfilled") {
                    setData(userResponses.value.data.users);
                }
                if (studentsResponses.status === "fulfilled") {
                    setStudents(studentsResponses.value.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [accessKey, setData, setStudents]);

    const columns = [
        { accessorKey: "id", header: "ID", size: 50 },
        { accessorKey: "firstname", header: "First name", size: 130 },
        { accessorKey: "surname", header: "Last name", size: 130 },
        { accessorKey: "sex", header: "Sex", size: 50 },
        { accessorKey: "email", header: "Email", size: 180 },
        { accessorKey: "role_name", header: "Role", size: 100 },
    ];

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
            number: students.length ? students.length : 0,
        },
        {
            menu: "teachers",
            image: teachersPng,
            number: data.length ? data.length : 0,
        },
        {
            menu: "students",
            image: studentsPng,
            number: 0,
        },
        {
            menu: "students",
            image: studentsPng,
            number: 0,
        },
    ];

    const isAdminOrHeadTeacher =
        window.atob(loggedIn) && window.atob(role) === "admin";
    const isTeacher = loggedIn && role === "Teacher";

    return (
        <div className="main">
            {isAdminOrHeadTeacher && (
                <div className="heading">
                    <FiHome />
                    <span style={{ color: "white", marginLeft: "10px" }}>
                        Admin Dashboard - Home
                    </span>
                </div>
            )}

            {isTeacher && (
                <div className="heading">
                    <FiHome />
                    <span style={{ color: "white", marginLeft: "10px" }}>
                        Teacher Dashboard - Home
                    </span>
                </div>
            )}

            <div className="container text-center">
                <div className="row">
                    {statisticalData.map((stat) => (
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
                                    <h4 className="numbers">{stat.number}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <p>Revenue Summary</p>
                        <Test />
                    </div>
                    <div className="col-4">
                        <p>Performance Summary</p>
                        <Test />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p>Users Available</p>
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            enableColumnOrdering
                            enableRowSelection
                            enableStickyHeader
                            initialState={{
                                showGlobalFilter: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}