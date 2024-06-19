import React, { useState } from "react";
import { Logout } from "@mui/icons-material";
import { Link ,  useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../User/userState";
import {
    BiBarChartAlt2,
    BiBusSchool,
    BiChild,
    BiDollar,
    BiHomeAlt2,
    BiMaleFemale,
    BiMessageAltDetail,
    BiMessageRounded,
    BiStats,
    BiUser,
} from "react-icons/bi";
import { GoBook } from "react-icons/go";
import { AiFillDashboard } from "react-icons/ai";
import { FiUmbrella } from "react-icons/fi";
import "./sidebar.css";
import placeholder from "../../../assets/placeHolderLogo.png";

const SideBar = () => {
    const location = useLocation();
    const role = localStorage.getItem("role");
    const loggedIn = localStorage.getItem("loggedIn");
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    if (window.atob(loggedIn) && window.atob(role) === "admin") {
        return (
            <div className="bg-[#1ab394] h-full ">
                <div className="flex flex-row justify-center">
                    <img src={placeholder} alt="logo" width={100} />
                </div>
                <div className=" container  pt-4">
                    {[
                        {
                            path: "/dashboard",
                            text: "Home",
                            Icon: AiFillDashboard,
                        },
                        {
                            path: "/teachers",
                            text: "Teachers",
                            Icon: BiMaleFemale,
                        },
                        { path: "/users", text: "User", Icon: BiUser },
                        {
                            path: "/assessment",
                            text: "Student Assessment",
                            Icon: BiStats,
                        },
                        { path: "/students", text: "Students", Icon: BiChild },
                        {
                            path: "/logs",
                            text: "Logs",
                            Icon: BiMessageAltDetail,
                        },
                        {
                            path: "/messages",
                            text: "Messages",
                            Icon: BiMessageRounded,
                        },
                        { path: "/classes", text: "Classes", Icon: BiHomeAlt2 },
                        {
                            path: "/performance",
                            text: "Performance",
                            Icon: BiBarChartAlt2,
                        },
                        {
                            path: "/department",
                            text: "Department",
                            Icon: FiUmbrella,
                        },
                        {
                            path: "/payments",
                            text: "Fees Balances",
                            Icon: BiDollar,
                        },
                        { path: "/subject", text: "Subjects", Icon: GoBook },
                    ].map(({ path, text, Icon }) => (
                        <Link
                            to={path}
                            key={path}
                            
                        >
                            <li 
                            id={location.pathname === path ? "active" : ""}
                            className="link p-2 hover:bg-[#9a8644c2] rounder-md flex items-center text-gray-100 text-base pl-3 ">
                                <Icon className="pr-1 text-[23px]" />
                                <span className="text-[16px]">{text}</span>
                            </li>
                        </Link>
                    ))}
                </div>

                <button onClick={toggleTheme}>Toggle Theme</button>
            </div>
        );
    } else if (window.atob(loggedIn) && window.atob(role) === "Teacher") {
        return (
            <>
                {/* <div className="sideBarItems"> */}
                {[
                    { path: "/dashboard", text: "Home", Icon: AiFillDashboard },
                    {
                        path: "/assessment",
                        text: "Student Assessment",
                        Icon: BiStats,
                    },
                    { path: "/students", text: "Students", Icon: BiChild },
                    { path: "/classes", text: "Classes", Icon: BiHomeAlt2 },
                    {
                        path: "/performance",
                        text: "Performance",
                        Icon: BiBarChartAlt2,
                    },
                    { path: "/subject", text: "Subjects", Icon: GoBook },
                ].map(({ path, text, Icon }) => (
                    <Link to={path}  key={path}>
                        <li >
                            <Icon className="icon" />
                            <span className="sideBarItemText">{text}</span>
                        </li>
                    </Link>
                ))}

                <button onClick={toggleTheme}>Toggle Theme</button>
                {/* </div> */}
            </>
        );
    }
};

export default SideBar;
