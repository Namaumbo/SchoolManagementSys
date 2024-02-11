import React from "react";
import * as IconSection from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { Fab } from "@mui/material";
import './subject.css'
const btnStyles = {
  // marginLeft : '1000px',
  // alignSelf : 'flex-end'
  // border: '1px solid yellow',
}
const Profile = () => {
    return (
        <>
            <div className="heading">
                <IconSection.BiBookOpen />
                <span style={{ color: "white" }}>Subject Management</span>
            </div>
            <Fab size="medium" color="primary" aria-label="add" style={btnStyles} id="fab">
                <GoPlus size={25} />
            </Fab>
        </>
    );
};
export default Profile;
