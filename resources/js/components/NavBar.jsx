import React from 'react';
import './navbar.css'
import {FiBell, FiUser} from "react-icons/fi";

export default function NavBar() {

    return (
        <div className='navbar-wrapper'>
            <div className="nav-items">
                <div className="logo">Logo Sec School</div>
                <div className="profile-vitals">
                    <div className="notifications"><FiBell className='notification-icon'/></div>
                    <div className="user">
                        <FiUser className='notification-icon'/>
                        <span className="profile-name">Daelo Namaumbo</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

