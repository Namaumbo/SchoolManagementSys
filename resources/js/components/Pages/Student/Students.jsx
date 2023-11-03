import React, { useEffect, useState } from "react";
import * as icons from "react-icons/bi";
import StudentService from "../../../../services/StudentService";
import './students.css'

export default function Students() {
    const [students, setStudents] = useState([]);

    const fetchData = () => {
        try {
            const data = StudentService.getAllStudent();
            data.then((result) => {
                setStudents(result);
            }).catch((err) => {
                alert(err.message);
            });
        } catch (err) {
            alert(err.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <div className="heading">
                <icons.BiChild />
                <span style={{ color: "white" }}>Students - Panel</span>
            </div>
            {students ? (
                <div className="user-tb">
                <div className="student-toppings">
                <div>
                    <input type="text" className="search-input" placeholder="search for students"/>
                </div>
                <div >
                        <button className="btn btn-success ">
                            Add Student
                        </button>
                        <span> </span>
                        <button className="btn btn-warning ">
                            Export to pdf
                        </button>
                </div>
                </div> 
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Village</th>
                                <th>District</th>
                                <th>Class</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((x) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{x.firstname}</td>
                                            <td>{x.surname}</td>
                                            <td>{x.sex}</td>
                                            <td>{x.village}</td>
                                            <td>{x.district}</td>
                                            <td>{x.class}</td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>No students available Student count</div>
            )}
        </>
    );
}
