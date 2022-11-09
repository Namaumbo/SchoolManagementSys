import React from "react";
import "../../css/login.css"
import loginjpg from "../../Assets/login.jpg"
import {Button} from "react-bootstrap";

export default function Login (){
    return<>

    <div className="main">

<div className="vitals">
    <form className="row g-3">
        <h2>Welcome,</h2>
        <div className="col-md-12">
            <label htmlFor="validationDefault03" className="form-label">Username</label>
            <input type="text" className="form-control" id="validationDefault03" required size=""/>
        </div>
        <div className="col-md-12">
            <label htmlFor="validationDefault03" className="form-label">Password</label>
            <input type="text" className="form-control" id="validationDefault03" required/>
        </div>
        <Button variant="primary">Login</Button>
    </form>

</div>

        <div>
            <img alt="imgs" className="login-pic" src={loginjpg}/>
        </div>

       </div>

    </>
}
