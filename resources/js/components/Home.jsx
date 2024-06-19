import React from "react";
import SideBar from "@/components/global/SideBar";
import Navbar from "./NavBar";
import "../../css/home.css";
import { Outlet } from "react-router-dom";

const Home = () => {
    return (
        <>
           
            <div className="flex w-full">
                <div className="w-[15%]">
                    <SideBar />
                </div>
                <div className="w-[85%]">
                  {/* <Navbar /> */}
                    <Outlet />
                </div>
            </div>
        </>

        // <div className="home">
        //     <div className="innerHome">
        //         <Navbar/>
        //         <div className='content-wrapper'>
        //             <div className='sideBar'>
        //                 <SideBar/>
        //             </div>
        //             <div className='outlet'>
        //                 <Outlet/>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};
export default Home;
