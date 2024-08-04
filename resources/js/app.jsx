
import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import {RecoilRoot, useRecoilState} from "recoil";
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminDashboard from "./components/Admin/dashboard/AdminDashboard";
import ClassManagement from "./components/Admin/classmanagement/ClassManagement";
import ClassDetails from "./components/Admin/classmanagement/ClassDetails";

import Logs from "./components/Admin/logsmanagement/Logs";
import Profile from "./components/Admin/Profile";
import Team from "./components/Admin/teammanagement/Team";
import SchoolPerformance from "./components/Admin/schoolmanagement/SchoolPerformance";
import ClassPerformance from "./components/Admin/classmanagement/ClassPerformance";
import Messages from "./components/Admin/messagemanagement/Messages";
import Assessment from "./components/Admin/assementManagement/Assessment";
import Students from "./components/Student/Students";
import StudentsInfo from "./components/Student/StudentsInfo";
import DepartmentManagement from "./components/Admin/DepartmentManagement/DepartmentManagement";
import DepartmentUsers from "./components/Admin/DepartmentManagement/DepartmentUsers";
import Subject from "./components/Admin/subjectManagement/Subject";

import StudentPerformance from "./components/Student/StudentPerformance";
import {userDetails} from "@/components/recoil_states/userdetails";
import {userState} from "@/components/User/userState";
import UserManagement from "./components/Admin/usermanagement/UserManagement";
import Test from "./Test";
import Information from "./commonPages/informationPage/Information";
import '../css/app.css';
export default function Index (){

    return(
        <>
            <HashRouter>
                <Routes>
                    <Route exact path="/" element={<Login/>}/>
                    <Route path='/login' element={<Login/>}/> 
                    {/* to render when the user is logged in for the first time */}
                     <Route path="/initial-page" element={<Information />} />
                    <Route path="/" element={<Home/>}> 
                        <Route path="/dashboard" element={<AdminDashboard/>}/>
                        <Route path="/classes" element={<ClassManagement/>}/>
                        <Route path="/logs" element={<Logs/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/teachers" element={<Team/>}/>
                        <Route path="/performance" element={<SchoolPerformance/>}/>
                        <Route path="/assessment" element={<Assessment/>}/>
                        <Route exact path="/users" element={<UserManagement/>}/>
                        <Route path="/classPerformance" element={<ClassPerformance/>}/>
                        <Route path="/messages" element={<Messages/>}/>
                        <Route path="/department" element={<DepartmentManagement/>}/>
                        <Route path="/department/:departmentId/users" element={<DepartmentUsers />} />
                        <Route path="/class/:id/students" element={<ClassDetails />} />

                        <Route path="/logout" element={<Login/>}/>
                        <Route path="/subject" element={<Subject />} />

                        <Route path="/students" element={<Students />} />
                        <Route path="/students-info" element={<StudentsInfo />} />
                       <Route path="/student-performance" element={<StudentPerformance />} />

                    </Route>
                        </Routes> 
            </HashRouter> 

        
            
            
            
        </> 

    )
}



ReactDOM.createRoot(document.getElementById('app')).render(
    <RecoilRoot>
        <Index/>
    </RecoilRoot>

);
