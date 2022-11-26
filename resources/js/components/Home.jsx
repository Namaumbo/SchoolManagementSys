import React from 'react'
import SideBar from "@/components/global/SideBar";
import Navbar from "@/components/global/Navbar";
import "../../css/home.css"
import {Outlet} from "react-router-dom";
const Home = () =>{
    return(
        <div className="home">
            <SideBar/>

            <div className="innerHome">
                <Navbar/>
                <Outlet/>
            </div>
        </div>
    )
}
export default Home
