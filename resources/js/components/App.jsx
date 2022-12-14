import React, {useState} from 'react';
import "../../css/app.css"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "@/components/Home";
import Classes from "@/components/Pages/Classes";
import Logs from "@/components/Pages/Logs";
import Messages from "@/components/Pages/Messages";
import Profile from "@/components/Pages/Profile";
import Team from "@/components/Pages/Team";
import SchoolPerformance from "@/components/Pages/SchoolPerformance";
import Users from "@/components/Pages/Users";
import ClassesPerformance from "@/components/Pages/ClassPerformance";
import AdminDashboard from "@/components/AdminDashboard";
import Login from "@/components/Login";

function App() {



    return (


        <>

                {/*<BrowserRouter>*/}
                {/*    <Routes>*/}
                {/*        <Route path="/" element={<Home/>}>*/}
                {/*            <Route path="/" element={<AdminDashboard/>}/>*/}
                {/*            <Route path="/classes" element={<Classes/>}/>*/}
                {/*            <Route path="/logs" element={<Logs/>}/>*/}
                {/*            <Route path="/profile" element={<Profile/>}/>*/}
                {/*            <Route path="/team" element={<Team/>}/>*/}
                {/*            <Route path="/performance" element={<SchoolPerformance/>}/>*/}
                {/*            <Route path="/users" element={<Users/>}/>*/}
                {/*            <Route path="/class-Performance" element={<ClassesPerformance/>}/>*/}
                {/*            <Route path="/messages" element={<Messages/>}/>*/}
                {/*        </Route>*/}
                {/*    </Routes>*/}
                {/*</BrowserRouter>*/}
            <Users/>
        </>

    );
}

export default App;
