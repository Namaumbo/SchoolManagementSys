import React from "react";
import "./admindash.css"
import {userState} from "../../User/userState"
import {userDetails} from "@/components/recoil_states/userdetails";
import {useRecoilState} from "recoil";
import teachers from '../../../../assets/teacher.png'
import users from '../../../../assets/users.png'
import students from '../../../../assets/students.png'
import absentUser from '../../../../assets/absentUser.png'
import {DataGrid} from "@mui/x-data-grid";
import Chart from '../utils/Chart.jsx'
import {Female, Male, SecurityRounded} from "@mui/icons-material";
import {FiHome} from "react-icons/all";


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
                <div className='outVitals'>
                <div className='vitals'>
                    <div className="heading-title">
                        <FiHome/><h4>Dashboard-Home</h4>
                    </div>
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
                                    <h3 style={{fontSize: "15px", margin: '10px 10px 10px 10px'}}>TEAM</h3>
                                   {/*<LineGraphs/>*/}
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
                </div>
                    <div className='teamTable'>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Sex</th>
                                <th scope="col">Role</th>
                                <th scope="col">Expertise</th>
                                <th scope="col">District</th>
                                <th scope="col">District</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Horoka main</td>
                                <td><Male fontSize='mini'/>Male</td>
                                <td>Head Teacher</td>
                                <td>Sciences</td>
                                <td>Chilomoni</td>
                            </tr>
                            <tr>
                                <th scope="row">1</th>
                                <td>Emelius Mwape</td>
                                <td><Male fontSize='mini'/>Male</td>
                                <td>Head Teacher</td>
                                <td>Sciences</td>
                                <td>Chilomoni</td>
                            </tr>
                            <tr>
                                <th scope="row">1</th>
                                <td>Innocent main</td>
                                <td><Female fontSize='mini'/>Female</td>
                                <td>Head Teacher</td>
                                <td>Sciences</td>
                                <td>Chilomoni</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob Thornton</td>
                                <td><Female fontSize='mini'/>Female</td>
                                <td><SecurityRounded fontSize='mini'/>Administrator</td>
                                <td>History</td>
                                <td>Blantyre</td>

                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Enock Dzunga</td>
                                <td><Male fontSize='mini'/>Male</td>
                                <td>Teacher</td>
                                <td>Sciences</td>
                                <td>Chilomoni</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/*<div className='scores'>*/}
                {/*    <div className='scoresNumber'>*/}
                {/*        <h4 className='heading' style={{color: 'black', textAlign: 'center'}}>Average scores in %</h4>*/}
                {/*        <h4 className='subHeading'>English</h4>*/}
                {/*        <div className='chartItem'><Chart/></div>*/}
                {/*        <span></span>*/}
                {/*        <h4 className='subHeading'>Mathematics</h4>*/}
                {/*        <div className='chartItem'><Chart/></div>*/}
                {/*        <span></span>*/}
                {/*        <h4 className='subHeading'>Biology</h4>*/}
                {/*        <div className='chartItem'><Chart/></div>*/}
                {/*    </div>*/}
                {/*</div>*/}

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
