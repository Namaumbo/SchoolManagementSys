import React from "react";
import "./admindash.css"
import {userState} from "../User/userState"
import {userDetails} from "@/components/recoil_states/userdetails";
import {useRecoilState} from "recoil";
import teachers from '../../../assets/teacher.png'
import UserInfo from "@/components/UserInfo";
import users from '../../../assets/users.png'
import students from '../../../assets/students.png'
import absentUser from '../../../assets/absentUser.png'
import {DataGrid} from "@mui/x-data-grid";
import {Button, ButtonGroup} from "@mui/material";
import {Chart} from "chart.js";


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


    if (loggedIn && role === 'admin') {

        return (
            <>
                <div>

                    <div className='conWrapper'>
                        <div className="containerTabs">
                            <div className="card">
                                <div>
                                    <span className="heading">Members Available</span>
                                </div>
                                <span>
                            <span><h4 className='numbers'>3/{rows.length} </h4></span>
                            <span>
                                <img src={teachers} alt="users" className="usersCard"/>
                            </span>
                        </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">Students Available</span></div>
                                <span>
                        <span><h4 className='numbers'>356</h4></span>
                        <span>
                            <img src={students} alt="users" className="usersCard"/>
                        </span>
                    </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">Members Absent</span></div>
                                <span>
                        <span><h4 className='numbers'>3/29</h4></span>
                        <span>
                            <img src={absentUser} alt="users" className="usersCard"/>
                        </span>
                    </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">staff available</span>
                                </div>
                                <span>
                        <span><h4 className='numbers'>8/10</h4></span>
                        <span><img src={users} alt="users" className="usersCard"/></span>
                    </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">fees Balances</span>
                                </div>
                                <span>
                        <span><h4 className='numbers'>8/10</h4></span>
                        <span><img src={users} alt="users" className="usersCard"/></span>
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
                        <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                            <Button>SCHOOL</Button>
                            <Button>STUDENTS</Button>
                            <Button>STAFF</Button>
                        </ButtonGroup>
                    </div>
                    <section>

                         <span className="headings">
                             <b>TEAM</b>
                         </span>
                        <div className='schoolGraphs'>
                            <div className='tableUser'>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[6]}
                                    checkboxSelection
                                />
                            </div>
                            <div className='chart'>
                                <h3>Chart</h3>
                                {/*<div><Chart student="Male" percentages="56"/></div>*/}
                            </div>
                        </div>
                    </section>





                    {/*//         <div className="col-5" style={{marginLeft: "10px"}}>*/}
                    {/*//             <div className="card">*/}
                    {/*//                 <DatePicker/>*/}
                    {/*//             </div>*/}
                    {/*//             <br/>*/}
                    {/*//             <span className="headings">*/}
                    {/*//                  <b>EMPLOYEES</b>*/}
                    {/*//              </span>*/}
                    {/*//             <br/>*/}
                    {/*//             <div className="card">*/}
                    {/*//                 <div className="people">*/}
                    {/*//                     <ul>*/}
                    {/*//*/}
                    {/*//                         <li className="friends">*/}
                    {/*//                             <div className='profile-holder'>*/}
                    {/*//                                 A*/}
                    {/*//                             </div>*/}
                    {/*//                             <span className="avatarText">Sam Tinted</span>*/}
                    {/*//                         </li>*/}
                    {/*//                         <li className="friends">*/}
                    {/*//                             <div className='profile-holder'>*/}
                    {/*//                                 A*/}
                    {/*//                             </div>*/}
                    {/*//                             <span className="avatarText">Alex Yohah</span>*/}
                    {/*//                         </li>*/}
                    {/*//                         <li className="friends">*/}
                    {/*//                             <div className='profile-holder'>*/}
                    {/*//                                 A*/}
                    {/*//                             </div>*/}
                    {/*//                             <span className="avatarText">Enock Chokha</span>*/}
                    {/*//                         </li>*/}
                    {/*//                         <li className="friends">*/}
                    {/*//                             <div className='profile-holder'>*/}
                    {/*//                                 A*/}
                    {/*//                             </div>*/}
                    {/*//                             <span className="avatarText">Rabbina Chokha</span>*/}
                    {/*//                         </li>*/}
                    {/*//                         <li className="friends">*/}
                    {/*//                             <div className='profile-holder'>*/}
                    {/*//                                 A*/}
                    {/*/!*                            </div>*!/*/}
                    {/*/!*                            <span className="avatarText">Daelo Chokha</span>*!/*/}
                    {/*/!*                        </li>*!/*/}
                    {/*/!*                    </ul>*!/*/}
                    {/*/!*                    <Button variant='outlined'>Show more</Button>*!/*/}
                    {/*/!*                </div>*!/*/}
                    {/*/!*            </div>*!/*/}
                    {/*/!*        </div>*!/*/}
                    {/*/!*    </div>*!/*/}
                    {/*/!*</div>*!/*/}
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
    }
}
