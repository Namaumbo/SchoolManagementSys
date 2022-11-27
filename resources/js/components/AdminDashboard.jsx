import React from "react";
import "../../css/admindash.css"
import UserInfo from "@/components/UserInfo";
import users from "../../Assets/users.png"
import absentUser from "../../Assets/absentUser.png"
import students from "../../Assets/students.png"
import teachers from "../../Assets/staffTeachs.png"
import { DataGrid } from '@mui/x-data-grid';

import {Button} from "react-bootstrap";
import DatePicker from "@/components/DatePicker";

export default function AdminDashboard() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        {
            field: 'Sex',
            headerName: 'Sex',
            type: 'String',
            width: 10,
        },
        {
            field: 'email',
            headerName: 'Email',
            type: 'String',
            width: 130
        }
        ,{
        field: 'role',
         headerName: 'Role',
         width: 100
        }
    ];
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35,Sex:'M' },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42,Sex:'M' },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45, Sex:'F' },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16, Sex:'F' },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 31,Sex:'M' },
        { id: 6, lastName: 'Melisandre', firstName: null, age:33,Sex:'M' },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44,Sex:'F' },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36,Sex:'F' },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65,Sex:'M',role:<b>dsf</b>},
    ];
    return <>
        <div  style={{maxWidth:"70%"}}>
            <div className="user">
                <UserInfo/>
            </div>
            <div className="container text-center">
                <div className="row">
                    <div className="col">
                            <div style={{display:"flex"}}>
                                <div className="col-4">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">
                                            <span className="heading">Members Available</span>
                                        </div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h4>28/29</h4></span>
                                       <span><img src={teachers} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">
                                            <span className="heading">Students Available</span></div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h4>356</h4></span>
                                       <span><img src={students} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">
                                            <span className="heading">Members Absent</span></div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h4>3/29</h4></span>
                                       <span><img src={absentUser} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">
                                            <span className="heading">staff available</span>
                                        </div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h4>8/10</h4></span>
                                       <span><img src={users} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

            <div className="container text-center" style={{marginTop:"5px"}}>
                <div  style={{display:"flex",justifyContent:"space-between"}}>
                    <span className="headings">
                    <b>Team</b>
                </span>
                </div>
            </div>
            <div className="container text-center">
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div className="col-11">
                        <div style={{ height: 300, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                            />
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="card">
                            <DatePicker/>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </>
}
