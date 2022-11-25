import React, { useState } from "react";
import "./sidebar.css";
import Logo from "../../../Assets/staffTeachs.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../../../data/navdata";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";

export default function  SideBar() {
    const [selected, setSelected] = useState(0);
    const [expanded, setExpanded] = useState(true)
    const sidebarVariants = {
        true: {
            left : '0'
        },
        false:{
            left : '-60%'
        }
    }
    return (
        <>
            <div>

            </div>
            <div className="bars" style={expanded?{left: '60%'}:{left: '5%'}} onClick={()=>setExpanded(!expanded)}>
                <UilBars />
            </div>
            <motion.div className='sidebar'
                        variants={sidebarVariants}
                        animate={window.innerWidth<=768?`${expanded}`:''}
            >
                {/* logo */}
                <div className="logo">
                    <img src={Logo} alt="logo" />
                    <span>
          Sh<span>o</span>ps
        </span>
                </div>

                <div className="menu">
                    {SidebarData.map((item, index) => {
                        return (
                            <div
                                className={selected === index ? "menuItem active" : "menuItem"}
                                key={index}
                                onClick={() => setSelected(index)}
                            >
                                <item.icon />
                                <span>{item.heading}</span>
                            </div>
                        );
                    })}
                    <div className="menuItem">
                        <UilSignOutAlt />
                    </div>
                </div>
            </motion.div>
        </>
    );
};

