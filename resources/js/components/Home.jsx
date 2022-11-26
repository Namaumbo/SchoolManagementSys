import React from 'react'
import SideBar from "@/components/global/SideBar";
import Navbar from "@/components/global/Navbar";
import "../../css/home.css"
const Home = () =>{
    return(
        <div className="home">
            <SideBar/>
            <div className="innerHome">
                <Navbar/>
            </div>

        </div>
    )
}
export default Home
