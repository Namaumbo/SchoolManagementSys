import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';

export default function NavBar() {
    const [schoolData, setSchoolData] = useState(null);

    useEffect(() => {
        fetchSchoolInformation();
    }, []);

    const fetchSchoolInformation = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/schools'); // Adjust the API endpoint as per your backend route
            if (response.status !== 200) {
                throw new Error('Failed to fetch school information');
            }
            setSchoolData(response.data); 
        } catch (error) {
            console.error('Error fetching school information:', error.message);
        }
    };

    // Retrieve and parse user data from localStorage
    const user = JSON.parse(window.atob(localStorage.getItem('vitals')) || '{}');

    // Function to get the first name from the school name in uppercase
    const getFirstName = (name) => {
        if (!name) return "";
        return name.split(' ')[0].toUpperCase();
    };

    return (
        <div className="nav-items">
            <div className="school-logo">
                {schoolData ? (
                    <>
                        <span className="font-bold text-xl text-white">
                            {getFirstName(schoolData.schools[0].name)} SECONDARY MANAGEMENT INFORMATION SYSTEM ({schoolData.schools[0].abbreviation})
                        </span>
                    </>
                ) : (
                    'Loading...'
                )}
            </div>
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
                                <NavDropdown title="Profile" id="collapsible-nav-dropdown" className="nav-dropdown-title">
                                    <NavDropdown.Item href="#">
                                        {user['firstname']}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#">
                                        Role: {user['role_name']}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <Nav>
                                <Link to="/logout" className="link">
                                    <span className="nts">Logout</span>
                                </Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </div>
    );
}
