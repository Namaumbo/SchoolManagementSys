// import React, { useState } from "react";
import "./sidebar.css";
// import Logo from "../../../Assets/staffTeachs.png";
// import { UilSignOutAlt } from "@iconscout/react-unicons";
// import { SidebarData } from "../../../data/navdata";
// import { UilBars } from "@iconscout/react-unicons";
// import { motion } from "framer-motion";
//
// export default function  SideBar() {
//     const [selected, setSelected] = useState(0);
//     const [expanded, setExpanded] = useState(true)
//     const sidebarVariants = {
//         true: {
//             left : '0'
//         },
//         false:{
//             left : '-60%'
//         }
//     }
//     return (
//         <>
//             <div>
//
//             </div>
//             <div className="bars" style={expanded?{left: '60%'}:{left: '5%'}} onClick={()=>setExpanded(!expanded)}>
//                 <UilBars />
//             </div>
//             <motion.div className='sidebar'
//                         variants={sidebarVariants}
//                         animate={window.innerWidth<=768?`${expanded}`:''}
//             >
//                 {/* logo */}
//                 <div className="logo">
//                     <img src={Logo} alt="logo" />
//                     <span>
//           Sh<span>o</span>ps
//         </span>
//                 </div>
//
//                 <div className="menu">
//                     {SidebarData.map((item, index) => {
//                         return (
//                             <div
//                                 className={selected === index ? "menuItem active" : "menuItem"}
//                                 key={index}
//                                 onClick={() => setSelected(index)}
//                             >
//                                 <item.icon />
//                                 <span>{item.heading}</span>
//                             </div>
//                         );
//                     })}
//                     <div className="menuItem">
//                         <UilSignOutAlt />
//                     </div>
//                 </div>
//             </motion.div>
//         </>
//     );
// };
//

import React from "react"
import Dashboard from '@mui/icons-material/Dashboard'
import User from '@mui/icons-material/people'
import Team from '@mui/icons-material/groups'
import Apartment from '@mui/icons-material/apartment'
import {Note, TrendingUp, Timeline, QuestionAnswer} from "@mui/icons-material";
import {UilUser} from "@iconscout/react-unicons";
import Navbar from "@/components/global/Navbar";

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
                <li><Dashboard className="icon"/>
                    <span>Dashboard</span></li>
                <p className="title">USER</p>
                <li><Team className="icon"/><span>Team</span></li>
                <li><User className="icon"/><span> Users</span></li>
                <li><QuestionAnswer className="icon"/><span>Messages</span></li>
                <li><UilUser className="icon"/><span>Profile</span></li>

                <li><Note className="icon"/><span>Logs</span></li>
                <p className="title">SCHOOL</p>
                <li><Apartment className="icon"/><span>Classes</span></li>
                <li><Timeline className="icon"/><span>School Performance</span></li>
                <li><TrendingUp className="icon"/><span>Class Performance</span></li>
                <p className="title">END</p>
                <li><span>Log out </span></li>

            </ul>
        </div>
        <div className="bottom">color ops</div>
    </div>
    </>
}
export default SideBar;
