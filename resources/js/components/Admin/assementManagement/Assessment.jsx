import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import { FiHome, FiGitMerge } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { userState } from "@/components/User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import * as IconSection from "react-icons/all";
import './Assessment.css'

export default function Assessment() {
    const [{ loggedIn, role, usersList }, setUsersList] =
        useRecoilState(userState);
    const [loading, setLoading] = useState(true);

    let [userInfo, setUserInfo] = useRecoilState(userDetails);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    function handleEdit(studentId) {
    alert(studentId,'=> about to edit')
       
    }

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
                            {userInfo.map((user) => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.title}</td>
                                        <td>{user.firstname}</td>
                                        <td>{user.surname}</td>
                                        <td>{user.sex}</td>
                                        <td>{user.traditional_authority}</td>
                                        <td>{user.email}</td>
                                        <td>{user.district}</td>
                                        <td>
                                            <button className="btn  btn-secondary btn-sm" onClick={()=>handleEdit(user.id)}>
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
                    <button className="btn btn-success ">Save History</button><span>{" "}</span>
                    <button className="btn btn-warning ">Produce Report</button>
                </div>
                </div>
               
            </div>
        </>
    );
}
