import './bootstrap'
import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";

import {RecoilRoot, useRecoilState} from "recoil";
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import Login from "@/components/Login";
import Home from "@/components/Home";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import Classes from "@/components/Pages/Admin/Classes";
import Logs from "@/components/Pages/Admin/Logs";
import Profile from "@/components/Pages/Admin/Profile";
import Team from "@/components/Pages/Admin/Team";
import SchoolPerformance from "@/components/Pages/Admin/SchoolPerformance";
import Users from "@/components/Pages/Admin/Users";
import ClassesPerformance from "@/components/Pages/Admin/ClassPerformance";
import Messages from "@/components/Pages/Admin/Messages";
import Students from "@/components/Student/Students";
import StudentsInfo from "@/components/Student/StudentsInfo";
import Department from "@/components/Student/Department";
import StudentPerformance from "@/components/Student/StudentPerformance";
import {userDetails} from "@/components/recoil_states/userdetails";
import {userState} from "@/components/User/userState";
import SideBar from "@/components/global/SideBar";

export default function Index (){

    let [ userInfo , setUserInfo] = useRecoilState(userDetails)

    // useEffect(() => {
    //     axios.get('http://127.0.0.1:8000/api/users').then(res => {
    //         setUserInfo(userInfo=res.data)
    //         console.log(res.data
    //         )
    //     }).catch(err => {
    //         console.error(err)
    //     })
    // }, 'http://127.0.0.1:8000/api/users')


    return(
        <>
            // <HashRouter>
            //     <Routes>
            //         <Route exact path="/" element={<Login/>}/>
            //         <Route path='/login' element={<Login/>}/>
            //         <Route path="/" element={<Home/>}>
            //             <Route path="/dashboard" element={<AdminDashboard/>}/>
            //             <Route path="/classes" element={<Classes/>}/>
            //             <Route path="/logs" element={<Logs/>}/>
            //             <Route path="/profile" element={<Profile/>}/>
            //             <Route path="/team" element={<Team/>}/>
            //             <Route path="/performance" element={<SchoolPerformance/>}/>
                        <Route exact path="/users" element={<Users/>}/>
                        <Route path="/class-Performance" element={<ClassesPerformance/>}/>
                        <Route path="/messages" element={<Messages/>}
                        />
                        //students and H-teacher
                        <Route path="/students" element={<Students/>}/>
                        <Route path='/students-info' element={<StudentsInfo/>}/>
                        <Route path='/department-performance' element={<Department/>}/>
                        <Route path='student-performance' element={<StudentPerformance/>}/>
                        {/*students and teacher*/}
                    </Route>
                </Routes>
            </HashRouter>
            {/*<AdminDashboard/>*/}
            {/*<SideBar/>*/}

        </>

    )
}



ReactDOM.createRoot(document.getElementById('app')).render(
    <RecoilRoot>
        <Index/>
    </RecoilRoot>

);

