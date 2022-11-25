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
        <div className="container" style={{maxWidth:"70%"}}>
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
                                        <div className="card-header bg-transparent border-success">
                                            <span className="heading">Members Available</span>
                                        </div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h4>28/29</h4></span>
                                       <span><img src={teachers} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">
                                            <span className="heading">Members Available</span></div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h4>356</h4></span>
                                       <span><img src={students} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <div className="card-header bg-transparent border-success">
                                            <span className="heading">Members Absent</span></div>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            <span><h4>3/29</h4></span>
                                       <span><img src={absentUser} alt="users" className="usersCard"/></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="col">

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



            </div>
            <div className="container text-center">
                <div className="row">
                    <div className="col-9">
                        <div >
                            <table className="table table-bordered">
                                <thead className="table-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Role</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td className="heading">Mark</td>
                                    <td className="heading">Otto</td>
                                    <td><h7><span className="badge text-bg-info">Teacher</span></h7></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td className="heading">Jacob</td>
                                    <td className="heading">Thornton</td>
                                    <td><h7><span className="badge text-bg-info">Admin</span></h7></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td className="heading" >Rabbina</td>
                                    <td  className="heading">banda</td>
                                    <td ><h7><span className="badge text-bg-info" >Head teacher</span></h7></td>
                                </tr>
                                <tr>
                                    <th scope="row">4</th>
                                    <td className="heading" >Chimutu</td>
                                    <td  className="heading">Harry</td>
                                    <td ><h7><span className="badge text-bg-info" >Teacher</span></h7></td>
                                </tr>
                                <tr>
                                    <th scope="row">5</th>
                                    <td className="heading" >Gift</td>
                                    <td  className="heading">Henry</td>
                                    <td ><h7><span className="badge text-bg-info" >Teacher</span></h7></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-3">
dfgdf
                    </div>
                </div>
            </div>
        </div>

    </>
}
