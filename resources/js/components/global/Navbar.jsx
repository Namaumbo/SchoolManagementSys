import React from 'react'
import "./navbar.css"
import {
    ChatBubbleOutlined,
    DarkModeOutlined,
    FullscreenExitOutlined,
    LanguageOutlined,
    NotificationsNone,
    SearchOutlined
} from "@mui/icons-material";


const Navbar = () =>{
    return<>
        <div className="navbar">


        <div className="wrapper">
<div className="search">
    <input type="text" placeholder="search"/>
    <SearchOutlined/>
</div>
    <div className="items">
        <div className="item">
            <LanguageOutlined/>
            English
        </div>
        <div className="item">
            <DarkModeOutlined/>

        </div>
        <div className="item">
            <FullscreenExitOutlined/>

        </div>  <div className="item">
        <NotificationsNone/>

    </div>  <div className="item">
        <ChatBubbleOutlined/>

    </div>
    </div>
        </div>
        </div>
    </>
}
export default Navbar;
