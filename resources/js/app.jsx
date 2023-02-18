import './bootstrap'
import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";

import {RecoilRoot, useRecoilState} from "recoil";
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import Login from "@/components/Login";
import Home from "@/components/Home";
import AdminDashboard from "@/components/Admin/dashboard/AdminDashboard";
import Classes from "@/components/Admin/classmanagement/Classes";
import Logs from "@/components/Admin/logsmanagement/Logs";
import Profile from "@/components/Admin/Profile";
import Team from "@/components/Admin/teammanagement/Team";
import SchoolPerformance from "@/components/Admin/schoolmanagement/SchoolPerformance";
import ClassesPerformance from "@/components/Admin/classmanagement/ClassPerformance";
import Messages from "@/components/Admin/messagemanagement/Messages";
import Students from "@/components/Student/Students";
import StudentsInfo from "@/components/Student/StudentsInfo";
import Department from "@/components/Student/Department";
import StudentPerformance from "@/components/Student/StudentPerformance";
import {userDetails} from "@/components/recoil_states/userdetails";
import {userState} from "@/components/User/userState";
import SideBar from "@/components/global/SideBar";
import UserManagement from "@/components/Admin/usermanagement/UserManagement";

export default function Index (){

    return(
        <>
             <HashRouter>
                 <Routes>
                     <Route exact path="/" element={<Login/>}/>
                     <Route path='/login' element={<Login/>}/>
                     <Route path="/" element={<Home/>}>
                         <Route path="/dashboard" element={<AdminDashboard/>}/>
                         <Route path="/classes" element={<Classes/>}/>
                         <Route path="/logs" element={<Logs/>}/>
                         <Route path="/profile" element={<Profile/>}/>
                         <Route path="/teachers" element={<Team/>}/>
                        <Route path="/performance" element={<SchoolPerformance/>}/>
                        <Route exact path="/users" element={<UserManagement/>}/>
                        <Route path="/class-Performance" element={<ClassesPerformance/>}/>
                        <Route path="/messages" element={<Messages/>}
                        />
                        //students and H-teacher
                        <Route path="/students" element={<Students/>}/>
                        <Route path='/students-info' element={<StudentsInfo/>}/>
                        <Route path='/department-performance' element={<Department/>}/>
                        <Route path='student-performance' element={<StudentPerformance/>}/>
                        students and teacher
                    </Route>
                </Routes>
             </HashRouter>
            {/* <AdminDashboard/>*/}

            {/*<SideBar/>*/}

        </>

    )
}



ReactDOM.createRoot(document.getElementById('app')).render(
    <RecoilRoot>
        <Index/>
    </RecoilRoot>

);

