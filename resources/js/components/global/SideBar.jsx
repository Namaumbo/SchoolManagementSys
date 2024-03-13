import React from "react";
import { Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";
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
    const role = localStorage.getItem("role");
    const loggedIn = localStorage.getItem("loggedIn");
    // const navigate = useNavigate()

    // function logOut() {
    //     setUser(loggedIn="",role="")
    //     window.location.reload(true)
    //     navigate('/login')
    // }

    console.log(window.atob(role))
    if (window.atob(loggedIn) && window.atob(role) === "admin") {
        return (
            <div className="sideBarItems">
                <div className="sidebar-img">
                    <img src={placeholder} alt="logo" width={100} />
                </div>
                <ul className="sideBarList">
                    <Link to="/dashboard" className="link">
                        <li className="itemList">
                            <AiFillDashboard className="icon" />
                            <span className="sideBarItemText">Home</span>
                        </li>
                    </Link>

                    <Link to="teachers" className="link">
                        <li className="itemList">
                            <BiMaleFemale className="icon" />
                            <span className="sideBarItemText">Teachers</span>
                        </li>
                    </Link>

                    <Link to="users" className="link">
                        <li className="itemList">
                            <BiUser className="icon" />
                            <span className="sideBarItemText">User</span>
                        </li>
                    </Link>

                    <Link to="assessment" className="link">
                        <li className="itemList">
                            <BiStats className="icon" />
                            <span className="sideBarItemText">
                                Student Assessment
                            </span>
                        </li>
                    </Link>

                    <Link to="students" className="link">
                        <li className="itemList">
                            <BiChild className="icon" />
                            <span className="sideBarItemText">Students</span>
                        </li>
                    </Link>

                    <Link to="logs" className="link">
                        <li className="itemList">
                            <BiMessageAltDetail className="icon" />
                            <span className="sideBarItemText">Logs</span>
                        </li>
                    </Link>
                    <Link to="messages" className="link">
                        <li className="itemList">
                            <BiMessageRounded className="icon" />
                            <span className="sideBarItemText">Messages</span>
                        </li>
                    </Link>

                    <Link to="classes" className="link">
                        <li className="itemList">
                            <BiHomeAlt2 className="icon" />
                            <span className="sideBarItemText">Classes</span>
                        </li>
                    </Link>

                    <Link to="performance" className="link">
                        <li className="itemList">
                            <BiBarChartAlt2 className="icon" />
                            <span className="sideBarItemText">Performance</span>
                        </li>
                    </Link>
                    <Link to="department" className="link">
                        <li className="itemList">
                            <FiUmbrella className="icon" />
                            <span className="sideBarItemText">Department</span>
                        </li>
                    </Link>

                    <Link to="payments" className="link">
                        <li className="itemList">
                            <BiDollar className="icon" />
                            <span className="sideBarItemText">
                                Fees Balances{" "}
                            </span>
                        </li>
                    </Link>
                    <Link to="subject" className="link">
                        <li className="itemList">
                            <GoBook className="icon" />
                            <span className="sideBarItemText">Subjects </span>
                        </li>
                    </Link>
                </ul>
            </div>
        );
    } else if (window.atob(loggedIn) && window.atob(role) === "Teacher") {
        return (
            <>
                {/* <div className="sideBarItems"> */}
                <ul className="sideBarList">
                    <Link to="/dashboard" className="link">
                        <li className="itemList">
                            <AiFillDashboard className="icon" />
                            <span className="sideBarItemText">Home</span>
                        </li>
                    </Link>
                    <Link to="/assessment" className="link">
                        <li className="itemList">
                            <BiStats className="icon" />
                            <span className="sideBarItemText">
                                Student Assessment
                            </span>
                        </li>
                    </Link>

                    <Link to="students" className="link">
                        <li className="itemList">
                            <BiChild className="icon" />
                            <span className="sideBarItemText">Students</span>
                        </li>
                    </Link>

                    <Link to="classes" className="link">
                        <li className="itemList">
                            <BiHomeAlt2 className="icon" />
                            <span className="sideBarItemText">Classes</span>
                        </li>
                    </Link>

                    <Link to="performance" className="link">
                        <li className="itemList">
                            <BiBarChartAlt2 className="icon" />
                            <span className="sideBarItemText">Performance</span>
                        </li>
                    </Link>

                    <Link to="subject" className="link">
                        <li className="itemList">
                            <GoBook className="icon" />
                            <span className="sideBarItemText">Subjects </span>
                        </li>
                    </Link>
                </ul>
                {/* </div> */}
            </>
        );
    }
};

export default SideBar;
