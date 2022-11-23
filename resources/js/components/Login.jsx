import React, {useState} from "react";
import "../../css/login.css"
import loginjpg from "../../Assets/login.jpg"
import {Button} from "react-bootstrap";


export default function Login() {
    
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    function login() {
        setLoading(false)
        setMessage("")
        setTimeout(() => {
            setLoading(true)
            setMessage("Oops wrong cridetials")
        }, 2000)
    }


    return <>

        <div className="main1">
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
                            <input type="password" className="form-control" id="validationDefault03" required/>
                        </div>
                        <Button variant="primary" onClick={login}>{loading ? <span>Login</span> :
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>}</Button>
                        <div className="col-md-6">
                            <span style={{color: "red"}}>{message}</span>
                        </div>
                    </form>

                </div>

                <div>

                    <img alt="imgs" className="login-pic" src={loginjpg}/>
                </div>

            </div>
        </div>

    </>
}
