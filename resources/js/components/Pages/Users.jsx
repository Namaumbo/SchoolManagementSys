import React from "react"
import "../../../css/users.css"
import Paper from '@mui/material/Paper';
const Users = () =>{
    return<>
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <Paper elevation={2}>
                        column
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2}>
                        column
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2}>
                        column
                    </Paper>
                </div>
                <div className="col">
                    <Paper elevation={2}>
                        column
                    </Paper>
                </div>
            </div>
        </div>
    </>
}
export default Users
