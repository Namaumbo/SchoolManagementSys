// import React, { useEffect, useState } from "react";
import { FiHome, FiGitMerge } from "react-icons/fi";
// import { useRecoilState } from "recoil";
// import { userState } from "@/components/User/userState";
// import { userDetails } from "../../recoil_states/userdetails";
import * as IconSection from "react-icons/all";
import "./Assessment.css";
// import StudentService from "../../../../services/StudentService";

// export default function Assessment() {
//     const [{ loggedIn, role, usersList }, setUsersList] =
//         useRecoilState(userState);
//     const [loading, setLoading] = useState(true);

//     let [studentData, setStudentData] = useState([]);
//     const [highlighted, setHighlighted] = useState(false);
//     const [editable, setEditable] = useState(false);

//     setTimeout(() => {
//         setLoading(false);
//     }, 1000);

//     const toggleHighlight = (id) => {
//         setHighlighted(!highlighted);
//         setEditable(!editable);
//     };

//     useEffect(() => {
//         let data = StudentService.getAllStudent();
//         data.then((res) => {
//             if (res) setStudentData(res);
//         }).catch((err) => {
//             console.log(err);
//         });
//     }, []);

import React, { useState, useEffect } from "react";

const Assessment = () => {
    const [editableRows, setEditableRows] = useState([]);
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        // Simulate API fetch
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/students"
                );
                const data = await response.json();
                const formattedData = data.map((rowData) => ({
                    data: rowData,
                    highlighted: false,
                    editable: false,
                }));
                setEditableRows(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const toggleHighlight = (index) => {
        setEditable(index, true);

        setEditableRows((prevRows) => {
            const updatedRows = prevRows.map((row, i) => {
                if (i === index) {
                    return {
                        ...row,
                        highlighted: !row.highlighted,
                        editable: !row.editable,
                    };
                }
                return row;
            });
            return updatedRows;
        });
       
    };


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
                                <td> </td>

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
                            {editableRows.map((row, index) => (
                                <tr
                                    key={index}
                                    className={
                                        row.highlighted ? "highlighted-row" : ""
                                    }
                                >
                                    <td contentEditable={row.editable}>
                                        {row.data.id}
                                    </td>

                                    <td contentEditable={row.editable}>
                                        {row.data.firstname}
                                    </td>
                                    <td contentEditable={row.editable}>
                                        {row.data.surname}
                                    </td>

                                    <td contentEditable={row.editable}>
                                        {row.data.sex}
                                    </td>

                                    <td contentEditable={row.editable}>
                                        {row.data.class}
                                    </td>
                                    <td contentEditable={row.editable}>
                                        {row.data.firstAssessment}
                                    </td>
                                    <td contentEditable={row.editable}>
                                        {row.data.secondAssessment}
                                    </td>
                                    <td contentEditable={row.editable}>
                                        {row.data.finalGrade}
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                toggleHighlight(index)
                                            }
                                            className={row.highlighted ? "btn btn-success":'btn btn-info'}
                                        >
                                            <IconSection.AiFillDatabase size="10px" />
                                            {row.highlighted ? 'Save' : 'Edit'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
};

export default Assessment;
