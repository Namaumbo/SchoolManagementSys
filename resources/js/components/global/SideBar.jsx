import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    BiBarChartAlt2,
    BiChild,
    BiDollar,
    BiHomeAlt2,
    BiMessageAltDetail,
    BiMessageRounded,
    BiStats,
    BiUser,
    BiMaleFemale,
} from "react-icons/bi";
import { GoBook } from "react-icons/go";
import { AiFillDashboard } from "react-icons/ai";
import { FiUmbrella } from "react-icons/fi";
// import "./sidebar.css";
import placeholder from "../../../assets/placeHolderLogo.png";

const SideBar = () => {
    const role = window.atob(localStorage.getItem("role"));
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const adminMenuItems = [
        { to: "/dashboard", icon: <AiFillDashboard />, text: "Home" },
        { to: "users", icon: <BiUser />, text: "Teachers" },
        // { to: " ", icon: <BiMaleFemale />, text: "Supporting Staffs" },
        { to: "assessment", icon: <BiStats />, text: "Student Assessment" },
        { to: "students", icon: <BiChild />, text: "Students" },
        // { to: "logs", icon: <BiMessageAltDetail />, text: "Logs" },
        { to: "messages", icon: <BiMessageRounded />, text: "Messages" },
        { to: "classes", icon: <BiHomeAlt2 />, text: "Classes" },
        { to: "performance", icon: <BiBarChartAlt2 />, text: "Performance" },
        { to: "department", icon: <FiUmbrella />, text: "Department" },
        // { to: "payments", icon: <BiDollar />, text: "Fees Balances" },
        { to: "subject", icon: <GoBook />, text: "Subjects" },
    ];

    const headOfDepartmentMenuItems = [
        { to: "/dashboard", icon: <AiFillDashboard />, text: "Home" },
        { to: "/assessment", icon: <BiStats />, text: "Student Assessment" },
        { to: "students", icon: <BiChild />, text: "Students" },
        { to: "classes", icon: <BiHomeAlt2 />, text: "Classes" },
        { to: "performance", icon: <BiBarChartAlt2 />, text: "Performance" },
        { to: "subject", icon: <GoBook />, text: "Subjects" },
        { to: "department", icon: <FiUmbrella />, text: "Department" },
    ];

    const teacherMenuItems = [
        { to: "/dashboard", icon: <AiFillDashboard />, text: "Home" },
        { to: "/assessment", icon: <BiStats />, text: "Student Assessment" },
        { to: "students", icon: <BiChild />, text: "Students" },
        { to: "classes", icon: <BiHomeAlt2 />, text: "Classes" },
        { to: "performance", icon: <BiBarChartAlt2 />, text: "Performance" },
        { to: "subject", icon: <GoBook />, text: "Subjects" },
    ];

    const getMenuItemsByRole = (role) => {
        switch (role) {
            case "admin":
                return adminMenuItems;
            case "Head Of Department":
                return headOfDepartmentMenuItems;
            case "Teacher":
                return teacherMenuItems;
            default:
                return [];
        }
    };

    const menuItems = getMenuItemsByRole(role);

    return (
        <div className="bg-[#0d1926] border-r-2 w-64 h-full">
            <div className="sidebar-img p-4 flex justify-center">
                <img src={placeholder} alt="logo" className="w-32 h-auto" />
            </div>
            <ul className="space-y-2 p-4 ">
                {menuItems.map((item, index) => (
                    <Link to={item.to} className="block" key={index}>
                        <li className={`flex items-center space-x-3 p-1 rounded-lg transition duration-150 ease-in-out ${location.pathname === item.to ? 'bg-blue-100 text-blue-600' : 'hover:bg-[#2c3e52]'}`}>
                            <div className={`p-2 rounded-full ${location.pathname === item.to ? 'bg-blue-600' : 'bg-[#1e2a38]'}`}>
                                <i className={`text-xl text-white`}>{item.icon}</i>
                            </div>
                            <p className={`font-medium text-sm ${location.pathname === item.to ? 'text-white font-bold' : 'text-white'}`}>{item.text}</p>
                        </li>
                    </Link>
                ))}
           
            </ul>
        </div>
    );
};

export default SideBar;
