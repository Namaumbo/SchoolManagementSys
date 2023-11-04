import React from "react";
import "./navbar.css";
import { Link, json } from "react-router-dom";
// import { userInfo } from "./User/userState";
// import { useRecoilState } from "recoil";

export default function NavBar() {


    const vitals  = localStorage.getItem('vitals')
    const userInfo = atob(vitals)
    const user = JSON.parse(userInfo)

    return (
        <div className="nav-items">
            <div className="school-logo">Secondary School</div>
            <div className="user-detail">
                <span className="profile-name">
                role : {user['role_name']} <span> </span> | <span> </span>
                    username : {user['firstname']} <span> </span> | <span> </span>
                    <Link to="/logout">
                        <button className="btn btn-primary btn-sm">
                            Logout
                        </button>
                    </Link>
                </span>
            </div>
        </div>
    );
}
