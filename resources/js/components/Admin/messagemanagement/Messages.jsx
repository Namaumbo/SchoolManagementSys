import React from "react"
import "../../../../css/message.css"
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UserStack from "@/components/UserStack";
import { FiMessageCircle} from "react-icons/fi";

const Messages = () => {
    return <>
    <div className="wrappers">
        <div className="heading-title">
            <FiMessageCircle/><h4>Messaging-chats</h4>
        </div>
        <div className="userStack">
            <UserStack/>
        </div>
        <div className="card" style={{position: "absolute"}}>
            <div className="inputText">
                <div  className="textField" >
                    <TextField
                        id="outlined-textarea"
                        placeholder="Hi send a message"
                        multiline
                        className="textFieldIn"
                    />
                </div>
                <div className="sendBtn">
                    <SendIcon style={{color: "grey"}} fontSize="large"/>
                </div>
            </div>
        </div>
    </div>


    </>
}
export default Messages
