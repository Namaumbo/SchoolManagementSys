import React, { useEffect, useState } from "react";
import "./admindash.css";
import { userState } from "../../User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import { useRecoilState } from "recoil";
import teachers from "../../../../assets/teacher.png";
import users from "../../../../assets/users.png";
import students from "../../../../assets/students.png";
import { Chart } from "react-google-charts";
import { FiHome } from "react-icons/all";
import axios from "axios";
import { Button, Card } from "@mui/material";

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

    async function getStudent() {

    }
    

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
            <div className="outerWrapper">
                <div className="outVitals">
                    <div className="heading-title">
                        <FiHome />
                        <span style={{color:'white'}}>Dashboard - Home</span>
                    </div>
                    <div className="conWrapper">
                        <div className="containerTabs">
                            <div className="card">
                                <div>
                                    <span className="heading">
                                        Members Available
                                    </span>
                                </div>
                                <span className="stats">
                                    <span>
                                        <img
                                            src={teachers}
                                            alt="users"
                                            className="usersCard"
                                        />
                                    </span>
                                    <span>
                                        <h4 className="numbers">
                                            {rows.length}{" "}
                                        </h4>
                                    </span>
                                </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">
                                        Students Available
                                    </span>
                                </div>
                                <span className="stats">
                                    <span>
                                        <img
                                            src={students}
                                            alt="users"
                                            className="usersCard"
                                        />
                                    </span>
                                    <span>
                                        <h4 className="numbers">356</h4>
                                    </span>
                                </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">
                                        staff available
                                    </span>
                                </div>
                                <span className="stats">
                                    <span>
                                        <img
                                            src={users}
                                            alt="users"
                                            className="usersCard"
                                        />
                                    </span>
                                    <span>
                                        <h4 className="numbers">8/10</h4>
                                    </span>
                                </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">
                                        fees Balances
                                    </span>
                                </div>
                                <span className="stats">
                                    <span>
                                        <img
                                            src={users}
                                            alt="users"
                                            className="usersCard"
                                        />
                                    </span>
                                    <span>
                                        <h4 className="numbers">8/10</h4>
                                    </span>
                                </span>
                            </div>
                        </div>
                        {/*revenue*/}
                        <div className="revenue">
                            <div>
                                <h4 className="sub-Heading">
                                    REVENUE THIS MONTH
                                </h4>
                                <span className="money">-10% </span>
                            </div>
                            <div>
                                <h4 className="sub-Heading">REVENUE TO DAY</h4>
                                <span className="money">+22%</span>
                            </div>
                            <div>
                                <h4 className="sub-Heading">EXPENDITURE</h4>
                                <span className="money">15%</span>
                            </div>
                        </div>
                    </div>
                    <br />

                    <div className="content">
                        <div className="right">
                            <div className="card-wrapper">
                                <div className="table">
                                    <h2 className="title-card">Team</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>First name</th>
                                                <th>last name</th>
                                                <th>sex</th>
                                                <th>Role</th>
                                                <th>Phone number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((user) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td>
                                                                {user.firstname}{" "}
                                                            </td>
                                                            <td>
                                                                {" "}
                                                                {user.surname}
                                                            </td>
                                                            <td>{user.sex}</td>
                                                            <td>
                                                                {user.title}
                                                            </td>
                                                            <td>
                                                                {user.district}
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
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
            </div>
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
