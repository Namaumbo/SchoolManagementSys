import React, {useState} from "react"
import "../../../css/users.css"
import Paper from '@mui/material/Paper';
import pic1 from '../../../Assets/photo-1628563694622-5a76957fd09c.jpg'
import Avatar from '@mui/material/Avatar';
import {Button} from "@mui/material";
import {Add, ListAltOutlined, Security} from "@mui/icons-material";
import AddUser from "@/components/User/AddUser";


const Users = () => {
    const [modal, setModal] = useState(true)
    const addUser = () => {
        setModal(false)
    }
    return <>

        <div className="container text-center">
            <div className="addBtn">
                <Button  onClick={addUser}>
                   <AddUser/>
                </Button>

                <Button  size="small" variant="outlined"  color="success">
                    <ListAltOutlined />Show Table
                </Button>

            </div>
            <hr/>
            <div className="row">
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar style={{width: "3em", height: "3em", alignItems: "center"}} src={pic1}/>
                        </div>
                        <div>
                            <h4>Daelo Spikker</h4>
                        </div>
                        <div>
                            <h6>Administrator<Security/></h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>

                        </div>
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar style={{width: "3em", height: "3em", alignItems: "center", background: "red"}}
                                    alt="Agnes Walker"
                                    src="/static/images/avatar/4.jpg"/>
                        </div>
                        <div>
                            <h4>Anold Swzneg</h4>
                        </div>
                        <div>
                            <h6>Head Teacher</h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>

                        </div>
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar style={{width: "3em", height: "3em", alignItems: "center"}} src={pic1}/>
                        </div>
                        <div>
                            <h4>James Handulo</h4>
                        </div>
                        <div>
                            <h6>Teacher</h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>

                        </div>
                    </Paper>

                </div>
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg"
                                    style={{width: "3em", height: "3em", alignItems: "center"}}/>
                        </div>
                        <div>
                            <h4>Anold Swzneg</h4>
                        </div>
                        <div>
                            <h6>Head Teacher</h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>

                        </div>
                    </Paper>
                </div>
            </div>
            <span> </span>
            <div className="row">
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar style={{width: "3em", height: "3em", alignItems: "center"}} src={pic1}/>
                        </div>
                        <div>
                            <h4>Rodrick saona</h4>
                        </div>
                        <div>
                            <h6>Head</h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>

                        </div>
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar style={{width: "3em", height: "3em", alignItems: "center", background: "red"}}
                                    alt="Agnes Walker"
                                    src="/static/images/avatar/4.jpg"/>
                        </div>
                        <div>
                            <h4>Limbani Jambo</h4>
                        </div>
                        <div>
                            <h6>Administrator<Security/></h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>

                        </div>
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg"
                                    style={{width: "3em", height: "3em", alignItems: "center"}}/>
                        </div>
                        <div>
                            <h4>Anold Swzneg</h4>
                        </div>
                        <div>
                            <h6>Head Teacher</h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>

                        </div>
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2} style={{padding: "2em"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Avatar style={{width: "3em", height: "3em", alignItems: "center"}} src={pic1}/>
                        </div>
                        <div>
                            <h4>Thomas Juma</h4>
                        </div>
                        <div>
                            <h6>Teacher</h6>
                        </div>
                        <div>
                            <Button variant="contained" size="small">Edit</Button>{" "}
                            <Button variant="contained" size="small">View</Button>
                        </div>
                    </Paper>

                </div>

            </div>
        </div>
    </>
}
export default Users
