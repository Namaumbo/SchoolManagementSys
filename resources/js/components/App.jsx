import React, {useState} from 'react';
import "../../css/app.css"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "@/components/Home";
import Classes from "@/components/Pages/Admin/Classes";
import Logs from "@/components/Pages/Admin/Logs";
import Messages from "@/components/Pages/Admin/Messages";
import Profile from "@/components/Pages/Admin/Profile";
import Team from "@/components/Pages/Admin/Team";
import SchoolPerformance from "@/components/Pages/Admin/SchoolPerformance";
import Users from "@/components/Pages/Admin/Users";
import ClassesPerformance from "@/components/Pages/Admin/ClassPerformance";
import AdminDashboard from "@/components/AdminDashboard";
import Login from "@/components/Login";

function App() {
    return (
        <>
                <BrowserRouter>
                    <Routes>
                {/*//        <Route path="/" element={<Home/>}>*/}
                {/*        <Route index element={<Home/>}/>*/}
                        <Route  index  element={<Login/>}/>
                        <Route path={"/dashboard"} element={<AdminDashboard/>}/>

                {/*//             <Route path="/" element={<AdminDashboard/>}/>*/}
                {/*//             <Route path="/classes" element={<Classes/>}/>*/}
                {/*//             <Route path="/logs" element={<Logs/>}/>*/}
                {/*            <Route path="/profile" element={<Profile/>}/>*/}
                {/*            <Route path="/team" element={<Team/>}/>*/}
                {/*            <Route path="/performance" element={<SchoolPerformance/>}/>*/}
                {/*            <Route path="/users" element={<Users/>}/>*/}
                {/*            <Route path="/class-Performance" element={<ClassesPerformance/>}/>*/}
                {/*            <Route path="/messages" element={<Messages/>}/>*/}
                {/*        </Route>*/}
                    </Routes>
                </BrowserRouter>
            {/*<Users/>*/}

            {/*<Login/>*/}
        </>

    );
}

export default App;
