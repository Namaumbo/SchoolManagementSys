import React from "react";
import "../../css/admindash.css"
import UserInfo from "@/components/UserInfo";
import users from "../../Assets/users.png"
import absentUser from "../../Assets/absentUser.png"
import students from "../../Assets/students.png"
import teachers from "../../Assets/staffTeachs.png"
import teacher from "../../Assets/teacher.png"
import {Button} from "react-bootstrap";

export default function AdminDashboard() {
    return <>
        <div>
            <div className="user">
                <UserInfo/>
            </div>
            <div className="container text-center">
                <div className="row">
                    <div className="col-12">
                        <div className="wrapper">
                            <div className="row">
                                <div className="col">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">Members Available
                                        </div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h1>28/29</h1></span>
                                       <span><img src={teachers} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">Total Students</div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h1>356</h1></span>
                                       <span><img src={students} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">Members Absent</div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h1>3/29</h1></span>
                                       <span><img src={absentUser} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col">

                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">Staff available</div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h1>8/10</h1></span>
                                       <span><img src={users} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container text-center" style={{marginTop:"2em"}}>
                <div  style={{display:"flex",justifyContent:"space-between"}}>
                    <span className="headings">
                    <b>Incoming Lessons</b>
                </span>
                <div style={{marginBottom:".4em"}}>
                    <Button>show All</Button>
                </div>
                </div>
                <div className="row">
                    <div className="col-3">
                            <div className="card" style={{padding:"8px"}} >
                                <div style={{display:"flex",justifyContent:"space-around"}}>
                                    <div>
                                        <img src={teacher} width="30px" height="30px" alt="teacher"/>
                                    </div>
                                    <div >
                                        <p className="card-text"><>Mr Campbell</></p>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="col-9">
                        <div className="card" style={{backgroundColor:"#e8ecfe"}}>
                            <div className="container text-center" style={{padding:"10px"}}>
                                <div className="row">
                                    <div className="col">
                                        <b>7:10am - 8:20am</b>
                                    </div>
                                    <div className="col">
                                        <>Mathematics</>
                                    </div>
                                    <div className="col">
                                        <b style={{color:"#918ced"}}>Form 3A</b>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-3">
                        <div className="card" style={{padding:"8px"}} >
                            <div style={{display:"flex",justifyContent:"space-around"}}>
                                <div>
                                    <img src={teacher} width="30px" height="30px" alt="teacher"/>
                                </div>
                                <div >
                                    <p className="card-text"><>Mr Effort</></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="card" style={{backgroundColor:"#e8ecfe"}}>
                            <div className="container text-center" style={{padding:"10px"}}>
                                <div className="row">
                                    <div className="col">
                                        <b>7:10am - 8:20am</b>
                                    </div>
                                    <div className="col">
                                        <>Chichewa</>
                                    </div>
                                    <div className="col">
                                        <b style={{color:"#918ced"}}>Form 3A</b>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <div className="card" style={{padding:"8px"}} >
                            <div style={{display:"flex",justifyContent:"space-around"}}>
                                <div>
                                    <img src={teacher} width="30px" height="30px" alt="teacher"/>
                                </div>
                                <div >
                                    <p className="card-text"><>Mr Champ</></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="card" style={{backgroundColor:"#e8ecfe"}}>
                            <div className="container text-center" style={{padding:"10px"}}>
                                <div className="row">
                                    <div className="col">
                                        <b>7:10am - 8:20am</b>
                                    </div>
                                    <div className="col">
                                        <>Agriculture</>
                                    </div>
                                    <div className="col">
                                        <b style={{color:"#918ced"}}>Form 3A</b>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <div className="card" style={{padding:"8px"}} >
                            <div style={{display:"flex",justifyContent:"space-around"}}>
                                <div>
                                    <img src={teacher} width="30px" height="30px" alt="teacher"/>
                                </div>
                                <div >
                                    <p className="card-text"><>Mr Bell</></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="card" style={{backgroundColor:"#e8ecfe"}}>
                            <div className="container text-center" style={{padding:"10px"}}>
                                <div className="row">
                                    <div className="col">
                                        <b>7:10am - 8:20am</b>
                                    </div>
                                    <div className="col">
                                        <>French</>
                                    </div>
                                    <div className="col">
                                        <b style={{color:"#918ced"}}>Form 3A</b>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
}
