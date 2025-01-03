import React from "react";
import SideBar from "@/components/global/SideBar";
import Navbar from "./NavBar";
import "../../css/home.css";
import { Outlet } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex flex-col flex-1 border">
                <div className="flex-1 overflow-y-auto bg-gray-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
export default Home;
