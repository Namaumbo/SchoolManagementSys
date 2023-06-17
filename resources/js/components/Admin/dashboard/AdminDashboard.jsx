import React, { useEffect, useState } from "react";
import "./admindash.css";
import { userState } from "../../User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import { useRecoilState } from "recoil";

import { Chart } from "react-google-charts";
import { FiHome } from "react-icons/all";
import axios from "axios";
import { Button, Card } from "@mui/material";
import studentsPng from "../../../../assets/icons8-students-94.png";
import teachersPng from "../../../../assets/icons8-teacher-64.png";
import moneyPng from "../../../../assets/icons8-money-48.png";
import Test from '../../../Test'
export default function AdminDashboard() {
    let [userInfo, setUserInfo] = useRecoilState(userDetails);
    const [data, setData] = useState([]);
    const [Student, setStudent] = useState([]);

    let [{ loggedIn, role }] = useRecoilState(userState);
    const accessKey = localStorage.getItem("key");

    useEffect(() => {
        async function getUsers() {
            const headers = {
                Authorization: `Bearer ${accessKey}`,
            };
            await axios
                .get("http://127.0.0.1:8000/api/users", { headers })
                .then((res) => {
                    setUserInfo(res.data);
                    setData(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        getUsers().then(null);
    }, ["http://127.0.0.1:8000/api/users"]);

    async function getStudent() {}

    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "firstname", headerName: "First name", width: 130 },
        { field: "surname", headerName: "Last name", width: 130 },
        { field: "Sex", headerName: "Sex", type: "String", width: 10 },
        { field: "email", headerName: "Email", type: "String", width: 180 },
        { field: "role_name", headerName: "Role", width: 100 },
    ];
    const rows = data;

    // if (loggedIn && role === 'admin') {

    const datum = [
        ["gender", "number of students"],
        ["female", 32],
        ["male", 34],
    ];

    const options = {
        title: "My Daily Activities",
    };

    return (
        <>
            <div className="main">
                <div className="heading">
                    <FiHome />
                    <span style={{ color: "white" }}>Dashboard - Home</span>
                </div>
                <div className="statistics">
                    <div className="cardMn">
                        <div>
                            <span className="name-title">Students</span>
                        </div>
                        <div className="figure">
                            <h4 className="numbers">{rows.length} </h4>
                        </div>
                    </div>
                    <div className="cardMn">
                        <div>
                            <img src={teachersPng} alt="students" />

                            <span className="name-title">Teachers</span>
                        </div>
                        <div className="figure">
                            <h4 className="numbers">{rows.length} </h4>
                        </div>
                    </div>
                    <div className="cardMn">
                        <div>
                            <img
                                src={studentsPng}
                                alt="students"
                                className="stdPng"
                            />
                            <span className="name-title">Students</span>
                        </div>
                        <div className="figure">
                            <h4 className="numbers">400 </h4>
                        </div>
                    </div>
                    <div className="cardMn">
                        <div>
                            <img src={moneyPng} alt="money" />

                            <span className="name-title">Total Earnings</span>
                        </div>
                        <div className="figure">
                            <h4 className="numbers">mk 3,000 </h4>
                        </div>
                    </div>
                </div>

                <div className="body">
                    <div className="expense-card">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First name</th>
                                    <th>last name</th>
                                    <th>sex</th>
                                    <th>Role</th>
                                    <th>Phone number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((user, index) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{user.firstname} </td>
                                                <td> {user.surname}</td>
                                                <td>{user.sex}</td>
                                                <td>{user.title}</td>
                                                <td>{user.district}</td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="left-card">
                      <Test/>
                    </div>
                </div>
            </div>

            {/* <div className="outerWrapper">
                <div className="outVitals">
                  
                        <div className="left">
                            <div className="card-wrapper">
                                <Chart
                                className="cssa"
                                    chartType="PieChart"
                                    data={datum}
                                    options={options}
                                    width={"100%"}
                                    height={"360px"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );

    // else if (loggedIn && role === 'h-teacher') {
    // }
    // else if (loggedIn && role === 'teacher') {
    // } else {
    //     // return <Navigate replace to="/login"/>;
    // }
    // }
}
