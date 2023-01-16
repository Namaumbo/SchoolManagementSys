import React, {useEffect, useState} from "react"
import "../../../../css/users.css"
import Paper from '@mui/material/Paper';
import pic1 from '../../../../assets/photo-1628563694622-5a76957fd09c.jpg'
import Avatar from '@mui/material/Avatar';
import {Button} from "@mui/material";
import Grid from '@mui/material/Grid'
import {ListAltOutlined, Security} from "@mui/icons-material";
import AddUser from "@/components/User/AddUser";
import {useRecoilState} from "recoil";
import {userState} from "@/components/User/userState";
import {userDetails} from "@/components/recoil_states/userdetails";

function Users() {
    const [{loggedIn,role,usersList}, setUsersList] = useRecoilState(userState)
    const [userInfo , setUserInfo] = useRecoilState(userDetails)
    return <>

        <div className="container text-center">
            <div className="addBtn">
                <Button>
                    <AddUser/>
                </Button>
                <Button size="small" variant="outlined" color="success">
                    <ListAltOutlined/>Show Table
                </Button>
            </div>
            <hr/>
            <div className="row">
                <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 16}}>
                    {
                        userInfo.map(user => {
                            const firstName = user.firstname;
                            const firstLetter = firstName[0].toUpperCase()
                            const lastName =user.surname
                            return (
                                <Grid item xs={8} sm={4} md={4} key={user.id}>
                                    <Paper elevation={2} style={{padding: "1em"}}>
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            <Avatar style={{width: "3em", height: "3em", alignItems: "center"}}
                                                    src={pic1}/>
                                        </div>
                                        <div>
                                            <h4>{firstLetter}. {lastName}</h4>
                                        </div>
                                        <div>
                                            <h6>Administrator<Security/></h6>
                                        </div>
                                        <div>
                                            <Button variant="contained" size="small">Edit</Button>{" "}
                                            <Button variant="contained" size="small">View</Button>
                                        </div>
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>
            <span> </span>

        </div>
    </>
}

export default Users
