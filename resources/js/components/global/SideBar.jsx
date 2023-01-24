import "./sidebar.css";
import React from "react"
import {
    Apartment,
    Dashboard,
    Group,
    Logout,
    Money,
    Note,
    Person,
    QuestionAnswer,
    School,
    Timeline
} from "@mui/icons-material";
import {Link} from 'react-router-dom'

const SideBar = () => {
    // let [{loggedIn, role},setUser] = useRecoilState(userState)
    // const navigate = useNavigate()

    // function logOut() {
    //     setUser(loggedIn="",role="")
    //     window.location.reload(true)
    //     navigate('/login')
    // }

    // if (role === 'admin') {
    return (
        <div className="sideBarItems">
            <ul className="sideBarList">
                <Link to="/dashboard" className='link'>
                    <li className="itemList"><Dashboard/><span className='sideBarItemText'>Home</span>
                    </li>
                </Link>

                <Link to="team" className='link'>
                    <li className="itemList"><Group/><span className="sideBarItemText">Team</span>
                    </li>
                </Link>

                <Link to="users" className='link'>
                    <li className="itemList"><Person/><span className="sideBarItemText">User</span>
                    </li>
                </Link>

                <Link to="logs" className='link'>
                <li className="itemList"><Note/><span className="sideBarItemText">Logs</span>
                </li>
                </Link>


                <Link to="messages" className='link'>
                <li className="itemList"><QuestionAnswer/><span className="sideBarItemText">Messages</span>
                </li>
                </Link>

                <Link to="classes" className='link'>
                <li className="itemList"><Apartment/><span className="sideBarItemText">Classes</span>
                </li>
                </Link>

                <Link to="performance" className='link'>
                <li className="itemList"><Timeline/><span className="sideBarItemText">Performance</span>
                </li>
                </Link>

                <Link to="Fees-balance" className='link'>
                <li className="itemList"><Money/><span className="sideBarItemText">Fees balances </span>
                </li>
                </Link>

                <Link to="Subjects" className='link'>
                <li className="itemList"><School/><span className="sideBarItemText">Subjects </span>
                </li>
                </Link>


                <div className='sidebardown'>
                    <hr/>
                    <li className="profile-holder">
                        <h5 style={{marginRight:'10px'}}>D</h5><span>Daelo</span>
                    </li>
                    <Link to="logout" className='link'>
                    <li className="logOut"><Logout/><span className="sideBarItemText">Log Out </span>
                    </li>
                    </Link>
                </div>
            </ul>
        </div>

        //
        //                 <li><QuestionAnswer className="icon" fontSize="small"/><span>Messages</span></li>
        //             </Link>
        //             <Link to="logs" className='link'>
        //                 <li className='link'><Note className="icon" fontSize="small"/><span>Logs</span></li>
        //             </Link>
        //             <p className="title">SCHOOL FAIR</p>
        //             <hr/>
        //             <Link to="classes" className='link'>
        //                 <li><Apartment className="icon" fontSize="small"/><span>Classes</span></li>
        //             </Link>
        //             <Link to="performance" className='link'>
        //                 <li><Timeline className="icon" fontSize="small"/><span>School Performance</span></li>
        //             </Link>
        //
        //             <Link to="class-performance" className='link'>
        //                 <li><TrendingUp className="icon" fontSize="small"/><span>Class Performance</span></li>
        //             </Link>
        //             <p className="title" >END</p>
        //              <div>
        //                  {/*<li><Logout className="icon" fontSize="small" onClick={logOut}/><span>Log out </span></li>*/}
        //
        //              </div>
        //         </ul>
        //     </div>
        //     <div className="bottom">color ops</div>
        // {/*</div>*/}
    )
    // }
    // if (role === 'h-teacher') {
    //     return (
    //         <div className="sidebar">
    //             <div className="top">
    //                 <span className="logo">Head-Teacher</span>
    //             </div>
    //             <hr/>
    //             <div className="center">
    //                 <ul>
    //                     <p className="title">MAIN</p>
    //                     <hr/>
    //                     <Link to="/dashboard" className='link'>
    //                         <li><HeadTeacherDashboard className="icon" fontSize="small"/>
    //                             <span>HeadTeacherDashboard</span></li>
    //                     </Link>
    //                     <p className="title">CLASSES</p>
    //                     <hr/>
    //                     <Link to="students" className='link'>
    //                         <li><Team className="icon" fontSize="small"/><span>Students</span></li>
    //                     </Link>
    //                     <Link to="students-info" className='link'>
    //                         <li><User className="icon" fontSize="small"/><span>Students' Info </span></li>
    //                     </Link>
    //                     <Link to="logs">
    //                         <li><Note className="icon" fontSize="small"/><span>Logs</span></li>
    //                     </Link>
    //                     <p className="title">CLASS FAIR</p>
    //                     <hr/>
    //                     <Link to="classes" className='link'>
    //                         <li><Apartment className="icon" fontSize="small"/><span>Classes</span></li>
    //                     </Link>
    //                     <Link to="department-performance" className='link'>
    //                         <li><Timeline className="icon" fontSize="small"/><span>Department Performance</span></li>
    //                     </Link>
    //                     <Link to="student-performance" className='link'>
    //                         <li><TrendingUp className="icon" fontSize="small"/><span>Student Performance</span></li>
    //                     </Link><p className="title">END</p>
    //                     <Link to='login'>
    //                         <li><Logout className="icon" fontSize="small"/><span>Log out </span></li>
    //                     </Link>                    </ul>
    //             </div>
    //             <div className="bottom">color ops</div>
    //         </div>
    //     )
    // }
    // if (role === 'teacher') {
    //     return (
    //         <div className="sidebar">
    //             <div className="top">
    //                 <span className="logo">Teacher</span>
    //             </div>
    //             <hr/>
    //             <div className="center">
    //                 <ul>
    //                     <p className="title">MAIN</p>
    //                     <hr/>
    //                     <Link to="/dashboard">
    //                         <li><HeadTeacherDashboard className="icon" fontSize="small"/>
    //                             <span>HeadTeacherDashboard</span></li>
    //                     </Link>
    //                     <p className="title">CLASSES</p>
    //                     <hr/>
    //                     <Link to="/students">
    //                         <li><Team className="icon" fontSize="small"/><span>Students</span></li>
    //                     </Link>
    //                     <Link to="/students-info">
    //                         <li><User className="icon" fontSize="small"/><span>Students' Info </span></li>
    //                     </Link>
    //                     <Link to="logs">
    //                         <li><Note className="icon" fontSize="small"/><span>Logs</span></li>
    //                     </Link>
    //                     <p className="title">SCHOOL FAIR</p>
    //                     <hr/>
    //                     <Link to="classes">
    //                         <li><Apartment className="icon" fontSize="small"/><span>Classes</span></li>
    //                     </Link>
    //                     <Link to="performance">
    //                         <li><Timeline className="icon" fontSize="small"/><span>Classes Performance</span></li>
    //                     </Link>
    //                     <Link to="class-performance">
    //                         <li><TrendingUp className="icon" fontSize="small"/><span>Class Performance</span></li>
    //                     </Link><p className="title">END</p>
    //                     <Link to='login'>
    //                         <li><Logout className="icon" fontSize="small"/><span>Log out </span></li>
    //                     </Link>
    //                 </ul>
    //             </div>
    //             <div className="bottom">color ops</div>
    //         </div>
    //     )
    // }
}
export default SideBar;
