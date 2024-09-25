import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import { Form, Input } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { BiAlarm, BiUser, BiSearch } from "react-icons/bi";

export default function NavBar() {
    const [schoolData, setSchoolData] = useState(null);
    useEffect(() => {
        fetchSchoolInformation();
    }, []);

    const fetchSchoolInformation = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/schools"
            ); // Adjust the API endpoint as per your backend route
            if (response.status !== 200) {
                throw new Error("Failed to fetch school information");
            }
            setSchoolData(response.data);
        } catch (error) {
            console.error("Error fetching school information:", error.message);
        }
    };
    // Retrieve and parse user data from localStorage
    const user = JSON.parse(
        window.atob(localStorage.getItem("vitals")) || "{}"
    );
    // Function to get the first name from the school name in uppercase
    const getFirstName = (name) => {
        if (!name) return "";
        return name.split(" ")[0].toUpperCase();
    };
    return (
        <div className="h-14 bg-white shadow-md border-bottom flex flex-row justify-between">
            <div className="relative mt-1 ml-4">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input className="bg-gray-100 pl-10 pr-4 py-2.5 rounded-full w-64" />
                <button className="ml-2 py-2 px-6 rounded-full bg-blue-500 text-white border-none cursor-pointer">
                    Search
                </button>
            </div>
            <div className="flex items-center mr-8">
                <div className="bg-[#0d1926] rounded-full p-2 mr-4">
                    <BiBell className="text-white text-xl cursor-pointer" />
                </div>
                <div className="bg-[#0d1926] rounded-full p-2">
                    <BiUser className="text-white text-xl cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
