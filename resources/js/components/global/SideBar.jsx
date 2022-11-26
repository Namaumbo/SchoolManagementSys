
import "./sidebar.css";
import React from "react"
import Dashboard from '@mui/icons-material/Dashboard'
import User from '@mui/icons-material/people'
import Team from '@mui/icons-material/groups'
import Apartment from '@mui/icons-material/apartment'
import {Note, TrendingUp, Timeline, QuestionAnswer} from "@mui/icons-material";
import {UilUser} from "@iconscout/react-unicons";
import {Link} from "react-router-dom";

const SideBar  =  () =>{
    return<>
    <div className="sidebar">
        <div className="top">
            <span className="logo">Admin</span>
        </div>
        <hr/>
        <div className="center">
            <ul>
                <p className="title">MAIN</p>
               <Link to="dashboard"> <li><Dashboard className="icon"/>
                    <span>Dashboard</span></li>
               </Link>
                <p className="title">USER</p>

                <Link to="team">
                    <li><Team className="icon"/><span>Team</span></li>
                </Link>

                <Link to="users">
                    <li><User className="icon"/><span> Users</span></li>
                </Link>
                <Link to="messages">
                    <li><QuestionAnswer className="icon"/><span>Messages</span></li>
                </Link>
                <Link to="logs">
                    <li><Note className="icon"/><span>Logs</span></li>
                </Link>
             <p className="title">SCHOOL FAIR</p>
               <Link to="classes">
                   <li><Apartment className="icon"/><span>Classes</span></li>

               </Link>
                <Link to="performance">
                    <li><Timeline className="icon"/><span>School Performance</span></li>

                </Link>

                <Link to="class-performance">
                    <li><TrendingUp className="icon"/><span>Class Performance</span></li>

                </Link><p className="title">END</p>
                <li><span>Log out </span></li>

            </ul>
        </div>
        <div className="bottom">color ops</div>

    </div>

    </>
}
export default SideBar;
