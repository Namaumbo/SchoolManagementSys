import "./sidebar.css";
import React from "react"
import Dashboard from '@mui/icons-material/Dashboard'
import User from '@mui/icons-material/people'
import Team from '@mui/icons-material/groups'
import Apartment from '@mui/icons-material/apartment'
import {Logout, Note, QuestionAnswer, Timeline, TrendingUp} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userState} from "@/components/User/userState";

const SideBar = () => {
    let [{loggedIn, role},setUser] = useRecoilState(userState)
    const navigate = useNavigate()

    function logOut() {
        setUser(loggedIn="",role="")
        window.location.reload(true)
        navigate('/login')
    }

    if (role === 'admin') {
        return (
            <div className="sidebar">
                <div className="top">
                    <span className="logo">Admin</span>
                </div>
                <hr/>
                <div className="center">
                    <ul>
                        <p className="title">MAIN</p>
                        <hr/>
                        <Link to="/dashboard" className='link'>
                            <li><Dashboard className="icon" fontSize="small"/>
                                <span>Dashboard</span></li>
                        </Link>
                        <p className="title">USER</p>
                        <hr/>
                        <Link to="team" className='link'>
                            <li><Team className="icon" fontSize="small"/><span>Team</span></li>
                        </Link>
                        <Link to="users" className='link'>
                            <li><User className="icon" fontSize="small"/><span> Users</span></li>
                        </Link>
                        <Link to="messages" className='link'>
                            <li><QuestionAnswer className="icon" fontSize="small"/><span>Messages</span></li>
                        </Link>
                        <Link to="logs" className='link'>
                            <li className='link'><Note className="icon" fontSize="small"/><span>Logs</span></li>
                        </Link>
                        <p className="title">SCHOOL FAIR</p>
                        <hr/>
                        <Link to="classes" className='link'>
                            <li><Apartment className="icon" fontSize="small"/><span>Classes</span></li>
                        </Link>
                        <Link to="performance" className='link'>
                            <li><Timeline className="icon" fontSize="small"/><span>School Performance</span></li>
                        </Link>

                        <Link to="class-performance" className='link'>
                            <li><TrendingUp className="icon" fontSize="small"/><span>Class Performance</span></li>
                        </Link>
                        <p className="title" >END</p>
                         <div>
                             <li><Logout className="icon" fontSize="small" onClick={logOut}/><span>Log out </span></li>

                         </div>
                    </ul>
                </div>
                <div className="bottom">color ops</div>

            </div>
        )
    }
    if (role === 'h-teacher') {
        return (
            <div className="sidebar">
                <div className="top">
                    <span className="logo">Head-Teacher</span>
                </div>
                <hr/>
                <div className="center">
                    <ul>
                        <p className="title">MAIN</p>
                        <hr/>
                        <Link to="/dashboard" className='link'>
                            <li><Dashboard className="icon" fontSize="small"/>
                                <span>Dashboard</span></li>
                        </Link>
                        <p className="title">CLASSES</p>
                        <hr/>
                        <Link to="students" className='link'>
                            <li><Team className="icon" fontSize="small"/><span>Students</span></li>
                        </Link>
                        <Link to="students-info" className='link'>
                            <li><User className="icon" fontSize="small"/><span>Students' Info </span></li>
                        </Link>
                        <Link to="logs">
                            <li><Note className="icon" fontSize="small"/><span>Logs</span></li>
                        </Link>
                        <p className="title">CLASS FAIR</p>
                        <hr/>
                        <Link to="classes" className='link'>
                            <li><Apartment className="icon" fontSize="small"/><span>Classes</span></li>
                        </Link>
                        <Link to="department-performance" className='link'>
                            <li><Timeline className="icon" fontSize="small"/><span>Department Performance</span></li>
                        </Link>
                        <Link to="student-performance" className='link'>
                            <li><TrendingUp className="icon" fontSize="small"/><span>Student Performance</span></li>
                        </Link><p className="title">END</p>
                        <Link to='login'>
                            <li><Logout className="icon" fontSize="small"/><span>Log out </span></li>
                        </Link>                    </ul>
                </div>
                <div className="bottom">color ops</div>
            </div>
        )
    }
    if (role === 'teacher') {
        return (
            <div className="sidebar">
                <div className="top">
                    <span className="logo">Teacher</span>
                </div>
                <hr/>
                <div className="center">
                    <ul>
                        <p className="title">MAIN</p>
                        <hr/>
                        <Link to="/dashboard">
                            <li><Dashboard className="icon" fontSize="small"/>
                                <span>Dashboard</span></li>
                        </Link>
                        <p className="title">CLASSES</p>
                        <hr/>
                        <Link to="/students">
                            <li><Team className="icon" fontSize="small"/><span>Students</span></li>
                        </Link>
                        <Link to="/students-info">
                            <li><User className="icon" fontSize="small"/><span>Students' Info </span></li>
                        </Link>
                        <Link to="logs">
                            <li><Note className="icon" fontSize="small"/><span>Logs</span></li>
                        </Link>
                        <p className="title">SCHOOL FAIR</p>
                        <hr/>
                        <Link to="classes">
                            <li><Apartment className="icon" fontSize="small"/><span>Classes</span></li>
                        </Link>
                        <Link to="performance">
                            <li><Timeline className="icon" fontSize="small"/><span>Classes Performance</span></li>
                        </Link>
                        <Link to="class-performance">
                            <li><TrendingUp className="icon" fontSize="small"/><span>Class Performance</span></li>
                        </Link><p className="title">END</p>
                        <Link to='login'>
                            <li><Logout className="icon" fontSize="small"/><span>Log out </span></li>
                        </Link>
                    </ul>
                </div>
                <div className="bottom">color ops</div>
            </div>
        )
    }
}
export default SideBar;
