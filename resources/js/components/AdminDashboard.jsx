import React, {useEffect} from "react";
import "../../css/admindash.css"
import {userState} from "./User/userState"
import {userDetails} from "@/components/recoil_states/userdetails";
import {useRecoilState} from "recoil";
import TotalAvatars from "@/components/People";
import teachers from '../../assets/teacher.png'
import UserInfo from "@/components/UserInfo";
import users from '../../assets/users.png'
import students from '../../assets/students.png'
import absentUser from '../../assets/absentUser.png'
import DatePicker from "@/components/DatePicker";
import {DataGrid} from "@mui/x-data-grid";
import {Navigate} from "react-router-dom";


export default function AdminDashboard() {
    let [{loggedIn, role}] = useRecoilState(userState)
    const [userInfo , setUserInfo] = useRecoilState(userDetails)
    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field: 'firstname', headerName: 'First name', width: 130},
        {field: 'surname', headerName: 'Last name', width: 130},
        {field: 'Sex', headerName: 'Sex', type: 'String', width: 10},
        {field: 'email',headerName: 'Email',type: 'String',width: 180},
        {field: 'role_name', headerName: 'Role', width: 100}
    ];
    const rows = userInfo;


    if (loggedIn && role === 'admin') {

        return (
            <div>
                <div style={{maxWidth: "70%"}}>
                    <div className="user">
                        <UserInfo/>
                    </div>
                    <div className="container text-center">
                        <div className="row">
                            <div className="col">
                                <div style={{display: "flex"}}>
                                    <div className="col-4">
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">
                                                <span className="heading">Members Available</span>
                                                <hr/>
                                            </div>
                                            <span style={{display: "flex", justifyContent: "space-around"}}>
                                                         <span><h4>3/{rows.length} </h4></span>

                                                    <span><img src={teachers} alt="users" className="usersCard"/></span>
                                                     </span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">

                                                <span className="heading">Students Available</span></div>
                                            <hr/>
                                            <span style={{display: "flex", justifyContent: "space-around"}}>
                                                         <span><h4>356</h4></span>
                                                    <span><img src={students} alt="users" className="usersCard"/></span>
                                                     </span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">
                                                <span className="heading">Members Absent</span></div>
                                            <hr/>
                                            <span style={{display: "flex", justifyContent: "space-around"}}>
                                                         <span><h4>3/29</h4></span>
                                                    <span><img src={absentUser} alt="users"
                                                               className="usersCard"/></span>
                                                     </span>
                                        </div>
                                    </div>
                                    <div className="col-4" style={{marginRight: "0.5em"}}>
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">
                                                <span className="heading">staff available</span>
                                                <hr/>
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
                    <br />
                    <div className="container text-center" style={{marginTop: "5px"}}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                 <span className="headings">
                                 <b>TEAM</b>
                             </span>
                        </div>
                    </div>
                    <div className="container text-center">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div className="col-11">
                                <div style={{height: 300, width: '100%'}}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[6]}
                                        checkboxSelection
                                    />
                                </div>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                 <span className="headings">
                                     <br />
                                 <b>STATISTICS</b>
                             </span>
                                </div>
                                <hr/>
                                <div className="col-11">
                                    <div className="container text-center">
                                        <div className="row">
                                            <div className="col-sm-5 col-md-6">
                                                <div className="graph">
                                                    {/*<Chart student="Male" percentages="56"/>*/}
                                                </div>
                                            </div>
                                            <div className="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                                                <div className="graph">
                                                    {/*<Chart*/}
                                                    {/*    student="Females" percentages="44"/>*/}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-5" style={{marginLeft:"10px"}}>
                                <div className="card">
                                    <DatePicker/>
                                </div>
                                <br />
                                <span className="headings">
                                 <b>EMPLOYEES</b>
                             </span>
                                <br/>

                                <div className="card">
                                    <div className="people">
                                        <TotalAvatars/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else if (loggedIn && role === 'h-teacher') {
    return (
        <div>
            <div>
                <div style={{maxWidth: "70%"}}>

                    <div className="container text-center">
                        <div className="row">
                            <div className="col">
                                <div style={{display: "flex",marginLeft:"45%"}}>
                                    <div className="col-6">
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">
                                                <span className="heading">Members Available</span>
                                                <hr/>
                                            </div>
                                            <span style={{display: "flex", justifyContent: "space-around"}}>
                                                          <span><h4>3/{rows.length} </h4></span>
                                                    <span><img src={teachers} alt="users" className="usersCard"/></span>
                                                      </span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">

                                                <span className="heading">Students Available</span></div>
                                            <hr/>
                                            <span style={{display: "flex", justifyContent: "space-around"}}>
                                                          <span><h4>356</h4></span>
                                                     <span>
                                                         <img src={students} alt="users"
                                                                className="usersCard"/></span>
                                                     </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="container text-center" style={{marginTop: "5px"}}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                 <span className="headings">
                                                 <b>STUDENTS</b>
                                             </span>
                        </div>
                    </div>
                    <div className="container text-center">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div className="col-11">
                                <div style={{height: 300, width: '100%'}}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[6]}
                                        checkboxSelection
                                    />
                                </div>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                 <span className="headings">
                                                     <br/>
                                                 <b>STATISTICS</b>
                                             </span>
                                </div>
                                <hr/>
                                <div className="col-11">
                                    <div className="container text-center">
                                        <div className="row">
                                            <div className="col-sm-5 col-md-6">
                                                <div className="graph">
                                                    {/*<Chart student="Male" percentages="56"/>*/}
                                                </div>
                                            </div>
                                            <div className="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                                                <div className="graph">
                                                    {/*<Chart*/}
                                                    {/*    student="Females" percentages="44"/>*/}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-5" style={{marginLeft: "10px"}}>
                                <div className="card">
                                    <DatePicker/>
                                </div>
                                <br/>
                                <span className="headings">
                                                 <b>UPCOMING CLASSES</b>
                                             </span>
                                <br/>
                                <div className="card">
                                    <div className="people">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
    else if (loggedIn && role === 'teacher') {
        return (

            <div>
                <div style={{maxWidth: "70%"}}>

                    <div className="container text-center">
                        <div className="row">
                            <div className="col">
                                <div style={{display: "flex",marginLeft:"45%"}}>
                                    <div className="col-6">
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">
                                                <span className="heading">Members Available</span>
                                                <hr/>
                                            </div>
                                            <span style={{display: "flex", justifyContent: "space-around"}}>
                                                          <span><h4>3/{rows.length} </h4></span>
                                                    <span><img src={teachers} alt="users" className="usersCard"/></span>
                                                      </span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="cards">
                                            <div className="card-header bg-transparent border-success">

                                                <span className="heading">Students Available</span></div>
                                            <hr/>
                                            <span style={{display: "flex", justifyContent: "space-around"}}>
                                                          <span><h4>356</h4></span>
                                                     <span>
                                                         <img src={students} alt="users"
                                                              className="usersCard"/></span>
                                                     </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="container text-center" style={{marginTop: "5px"}}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                 <span className="headings">
                                                 <b>STUDENTS</b>
                                             </span>
                        </div>
                    </div>
                    <div className="container text-center">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div className="col-11">
                                <div style={{height: 300, width: '100%'}}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[6]}
                                        checkboxSelection
                                    />
                                </div>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                 <span className="headings">
                                                     <br/>
                                                 <b>STATISTICS</b>
                                             </span>
                                </div>
                                <hr/>
                                <div className="col-11">
                                    <div className="container text-center">
                                        <div className="row">
                                            <div className="col-sm-5 col-md-6">
                                                <div className="graph">
                                                    {/*<Chart student="Male" percentages="56"/>*/}
                                                </div>
                                            </div>
                                            <div className="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                                                <div className="graph">
                                                    {/*<Chart*/}
                                                    {/*    student="Females" percentages="44"/>*/}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-5" style={{marginLeft: "10px"}}>
                                <div className="card">
                                    <DatePicker/>
                                </div>
                                <br/>
                                <span className="headings">
                                                 <b>UPCOMING CLASSES</b>
                                             </span>
                                <br/>
                                <div className="card">
                                    <div className="people">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <Navigate replace to="/login"/>;
    }
}
