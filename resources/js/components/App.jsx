import React, {useEffect, useState} from 'react';
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
import {useRecoilState} from "recoil";
import {userState} from "@/components/User/userState";
import Students from "@/components/Student/Students";
import StudentsInfo from "@/components/Student/StudentsInfo";
import Department from "@/components/Student/Department";
import StudentPerformance from "@/components/Student/StudentPerformance";


function App() {

    return (
        <>
           {/*<AdminDashboard/>*/}
        </>
    );
}

export default App;
