import React from 'react'
import SideBar from "@/components/global/SideBar";
import Navbar from "@/components/global/Navbar";
import "../../css/home.css"
import {Outlet} from "react-router-dom";

const Home = () => {
    return (
        <div className="home">
                    {/*<Navbar/>*/}
            <div className="innerHome">
                <div className='content-wrapper'>
                    <div className='sideBar'>
                        <SideBar/>
                    </div>
                    <div className='outlet'>
                        <Outlet/>
                    </div>
                    {/*<div className='rightBar'>*/}
                    {/*    Right bar*/}
                    {/*</div>*/}

                </div>
            </div>
        </div>
    )
}
export default Home
