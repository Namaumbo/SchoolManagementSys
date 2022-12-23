import React, {useEffect, useState} from "react";
import "../../css/login.css"
import loginjpg from "../../assets/login.jpg"
import {Button} from "react-bootstrap";
import {useNavigate} from 'react-router-dom'
import {  useRecoilState } from "recoil";
import {userState} from './User/userState'

export default function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [login, setLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") || false);
    const users = [{username: "name", password: "password"}];
    let [{loggedIn,role,usersList} , setLoginStatus] = useRecoilState(userState)

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(false)
        setMessage("")
        setTimeout(() => {
            setLoading(true)
            setLogin(true)
        }, 2000)
        const account = users.find((user) => user.username === username);
        if (account && account.password === password) {
            setLoginStatus({loggedIn: true,role: 'admin'})
            localStorage.setItem("authenticated", true);
            navigate("/dashboard");
        }
    };
    return <>
        <div className="main1">
            <div className="main">
                <div className="vitals">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <h2>Welcome,</h2>
                        <div className="col-md-12">
                            <label htmlFor="validationDefault03" className="form-label">Username</label>
                            <input type="text" className="form-control"
                                   name="Username"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)} required size=""/>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="validationDefault03" className="form-label">Password</label>
                            <input type="password" className="form-control"
                                   name="Password"
                                   onChange={(e) => setPassword(e.target.value)}
                                   required/>
                        </div>
                        <Button variant="primary" onClick={handleSubmit}>{loading ?
                            <span style={{color: "white", fontSize: "18px"}}>Login</span> :
                            <span style={{color: "white"}}>
                            <span className="spinner-grow spinner-grow-sm" role="status"
                                  aria-hidden="true"/>
                        </span>
                        }
                        </Button>
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
