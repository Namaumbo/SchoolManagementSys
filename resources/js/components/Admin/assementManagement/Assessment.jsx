import React, { useEffect, useState } from "react";
import { FiHome, FiGitMerge } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { userState } from "@/components/User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import * as IconSection from "react-icons/all";
import "./Assessment.css";
import StudentService from "../../../../services/StudentService";

export default function Assessment() {
    const [{ loggedIn, role, usersList }, setUsersList] =
        useRecoilState(userState);
    const [loading, setLoading] = useState(true);
    let [userInfo, setUserInfo] = useRecoilState(userDetails);

    let [studentData, setStudentData] = useState([]);
    setTimeout(() => {
        setLoading(false);
    }, 1000);

    function handleEdit(studentId) {}

    useEffect(() => {
        let data = StudentService.getAllStudent();
        data
        .then((res) => {
            if(res) setStudentData(res)
        })
        .catch((err) => {console.log(err)});
    }, []);
    return (
        <>
            <div className="heading">
                <FiGitMerge />
                <span style={{ color: "white" }}>Assessment - Panel</span>
            </div>
            <div className="assessment-main">
                <div className="user-tb">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Class</th>
                                <th>First Assessment</th>
                                <th>Second Assessment</th>
                                <th>Final Grade</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {studentData.map((student) => {
                                return (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.firstname}</td>
                                        <td>{student.surname}</td>
                                        <td>{student.sex}</td>
                                        <td>{student.class}</td>
                                        <td>{student.firstAssessment}</td>
                                        <td>{student.secondAssessment}</td>
                                        <td>{student.finalGrade}</td>
                                        <td>
                                            <button
                                                className="btn  btn-secondary btn-sm"
                                                onClick={() =>
                                                    handleEdit(student.id)
                                                }
                                            >
                                                <IconSection.AiFillDatabase size="10px" />
                                                UPDATE
                                            </button>{" "}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="main-btns">
                        <button className="btn btn-success ">
                            Save History
                        </button>
                        <span> </span>
                        <button className="btn btn-warning ">
                            Produce Report
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
