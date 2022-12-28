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
import {userDetails} from "@/components/recoil_states/userdetails";




function App() {
let [ userInfo , setUserInfo] = useRecoilState(userDetails)

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/users').then(res => {
            setUserInfo(userInfo=res.data)
        }).catch(err => {
            console.error(err)
        })

    }, ["http://127.0.0.1:8000/api/users"])

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Login/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path="/" element={<Home/>}>
                        <Route path="/dashboard" element={<AdminDashboard/>}/>
                        <Route path="/classes" element={<Classes/>}/>
                        <Route path="/logs" element={<Logs/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/team" element={<Team/>}/>
                        <Route path="/performance" element={<SchoolPerformance/>}/>
                        <Route path="/users" element={<Users/>}/>
                        <Route path="/class-Performance" element={<ClassesPerformance/>}/>
                        <Route path="/messages" element={<Messages/>}
                        />


                        {/*//students and H-teacher*/}

                        <Route path="/students" element={<Students/>}/>
                        <Route path='/students-info' element={<StudentsInfo/>}/>
                        <Route path='/department-performance' element={<Department/>}/>
                        <Route path='student-performance' element={<StudentPerformance/>}/>

                        {/*students and teacher*/}

                    </Route>
                </Routes>
            </BrowserRouter>
            {/*<AdminDashboard/>*/}
        </>
    );
}

export default App;
