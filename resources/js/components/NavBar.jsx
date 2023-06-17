import React from "react";
import "./navbar.css";
import {Link} from 'react-router-dom'
import { FiBell, FiUser } from "react-icons/fi";

export default function NavBar() {
    return (
        <div className="navbar-wrapper">git a
            <div className="nav-items">
                <div className="logo">Secondary School</div>
                <div className="profile-vitals">
                    <div className="user-detail">
                        <span className="profile-name">
                            Admin <span> </span> | <span> </span>
                            <Link to="/logout">
                                <button className="btn btn-primary btn-sm">
                                    Logout
                                </button>
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
