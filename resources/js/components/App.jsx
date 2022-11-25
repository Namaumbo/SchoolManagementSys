import React from 'react';
import "../../css/app.css"
// import {BrowserRouter } from "react-router-dom"
import Login from "@/components/Login";;
import AdminDashboard from "@/components/AdminDashboard";
import Sidebar from "@/components/global/SideBar";

function App() {
    return (

            <div className="index">
                <div className="inner">
                    <Sidebar/>
                    <AdminDashboard />
                </div>
            {/*<Login/>*/}
            </div>
    );
}

export default App;
