import React from "react";
import "./admindash.css"
import {userState} from "../User/userState"
import {userDetails} from "@/components/recoil_states/userdetails";
import {useRecoilState} from "recoil";
import teachers from '../../../assets/teacher.png'
import users from '../../../assets/users.png'
import students from '../../../assets/students.png'
import absentUser from '../../../assets/absentUser.png'
import {DataGrid} from "@mui/x-data-grid";
import {Card} from "@mui/material";
import Chart from './Chart.jsx'


export default function AdminDashboard() {
    let [{loggedIn, role}] = useRecoilState(userState)
    const [userInfo, setUserInfo] = useRecoilState(userDetails)
    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field: 'firstname', headerName: 'First name', width: 130},
        {field: 'surname', headerName: 'Last name', width: 130},
        {field: 'Sex', headerName: 'Sex', type: 'String', width: 10},
        {field: 'email', headerName: 'Email', type: 'String', width: 180},
        {field: 'role_name', headerName: 'Role', width: 100}
    ];
    const rows = userInfo;


    // if (loggedIn && role === 'admin') {

    return (
        <>
            <div className='outerWrapper'>

                <div className='vitals'>
                    <div className='conWrapper'>
                        <div className="containerTabs">
                            <div className="card">
                                <div>
                                    <span className="heading">Members Available</span>
                                </div>
                                <span className='stats'>
                                     <span>
                                <img src={teachers} alt="users" className="usersCard"/>
                            </span>
                            <span>
                                <h4 className='numbers'>3/{rows.length} </h4></span>
                        </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">Students Available</span></div>
                                <span className='stats'>
                                     <span>
                            <img src={students} alt="users" className="usersCard"/>
                        </span>
                        <span><h4 className='numbers'>356</h4></span>

                    </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">Members Absent</span></div>
                                <span className='stats'>
                                     <span>
                            <img src={absentUser} alt="users" className="usersCard"/>
                        </span>
                        <span><h4 className='numbers'>3/29</h4></span>

                    </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">staff available</span>
                                </div>
                                <span className='stats'>
                                    <span><img src={users} alt="users" className="usersCard"/></span>
                        <span><h4 className='numbers'>8/10</h4></span>
                    </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">fees Balances</span>
                                </div>
                                <span className='stats'>
                                    <span><img src={users} alt="users" className="usersCard"/></span>
                        <span><h4 className='numbers'>8/10</h4></span>
                    </span>
                            </div>
                        </div>
                        {/*revenue*/}
                        <div className='revenue'>
                            <div>
                                <h4 className='sub-Heading'>REVENUE THIS MONTH</h4>
                                <span className='money'>-10% </span>
                            </div>
                            <div>
                                <h4 className='sub-Heading'>REVENUE TO DAY</h4>
                                <span className='money'>+22%</span>
                            </div>
                            <div>
                                <h4 className='sub-Heading'>EXPENDITURE</h4>
                                <span className='money'>15%</span>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div>
                        <div className='schoolGraphs'>
                            <div className='tableUser'>
                                <div className='table' >
                                    <h3 style={{fontSize: "15px", margin: '10px 0 10px 10px'}}>TEAM</h3>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[6]}
                                        checkboxSelection
                                    />
                                </div>

                            </div>
                            <div className='chart'>
                                <h3>Chart</h3>
                                <div className='gender'>
                                    <Chart/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td colSpan="2">Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='scores'>
                    <div className='scoresNumber'>
                        <h4 className='heading' style={{color: 'black', textAlign: 'center'}}>Average scores in %</h4>
                        <h4 className='subHeading'>English</h4>
                        <div className='chartItem'><Chart/></div>
                        <span></span>
                        <h4 className='subHeading'>Mathematics</h4>
                        <div className='chartItem'><Chart/></div>
                        <span></span>
                        <h4 className='subHeading'>Biology</h4>
                        <div className='chartItem'><Chart/></div>
                    </div>
                </div>


            </div>
        </>


    );

    // else if (loggedIn && role === 'h-teacher') {
    // }
    // else if (loggedIn && role === 'teacher') {
    ;
    // } else {
    //     // return <Navigate replace to="/login"/>;
    // }
    // }
}
