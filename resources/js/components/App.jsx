import React from 'react';
import "../../css/app.css"
import {BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "@/components/Login";;
import AdminDashboard from "@/components/AdminDashboard";
import Sidebar from "@/components/global/SideBar";
import Home from "@/components/Home";


function App() {
    return (

        // <BrowserRouter>
        //     <Routes>
        //         <Route path="/" element={<App/>}>
        //          <Route path=""/>
        //
        //         </Route>
        //     </Routes>
        // </BrowserRouter>
            //
            <div className="index">
                <div className="inner">
                    {/*<Sidebar/>*/}
                    <Home/>
                    {/*<AdminDashboard />*/}
                </div>
            {/*<Login/>*/}
            </div>
    );
}

export default App;
