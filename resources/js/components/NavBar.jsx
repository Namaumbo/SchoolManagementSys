import React from "react";
import "./navbar.css";
import { Link, json } from "react-router-dom";
 import { userInfo } from "./User/userState";
 import { useRecoilState } from "recoil";
 import { BiBell } from "react-icons/bi";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
export default function NavBar() {

    const user = JSON.parse(window.atob(localStorage.getItem('vitals')))

    return (
        <div className="nav-items">
            <div className="school-logo">Secondary Management Information System(SMIS)</div>
            <div className="user-detail">

            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="#features" className="notification">
                <BiBell className="icon" />
                <span className="nts">Notifications</span> 
                   </Nav.Link>

            <NavDropdown title="Profile" id="collapsible-nav-dropdown" className="nav-dropdown-title" >
              <NavDropdown.Item href="#">{user['firstname']}</NavDropdown.Item>
              <NavDropdown.Item href="#">
              Role: {user['role_name']}
              </NavDropdown.Item>

       
            </NavDropdown>
          </Nav>
          <Nav>
        
          <Link to="" className="link"><span  className="nts">Logout</span> </Link>
        
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
            </div>
        </div>
    );
}