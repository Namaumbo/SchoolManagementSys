import React, { useState } from "react";
import "../../css/login.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "./User/userState";
import * as iconSection from "react-icons/all";
import logo from "../../assets/logo.jpg";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [login, setLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") || false);
    const user = { "_token":"{{csrf_token()}}",email, password };
    let [{ loggedIn, role, usersList }, setLoginStatus] =
        useRecoilState(userState);

    const handleSubmit = async (e) => {
       
        e.preventDefault();
        setLoading(false);
        setMessage("");
        setTimeout(() => {
            setLoading(true);
            setLogin(true);
        }, 2000);
        
       await axios.post("http://localhost:8000/api/login", user)

            .then((res) => {
                
                if (res.data.status === "ok") {
                  localStorage.setItem('key',res.data.access_token)
                    setLoginStatus({ loggedIn: true, role: "admin" });
                    navigate("/dashboard");
                }
            })
            .catch((error) =>{
                if (error.response && error.response.status === 419) {
                    console.log(error.response)
                }    
            });
    };
    return (
        <>
      
            <div className="logoScn">
                <img src={logo} className="logo" />
            </div>
            <div className="login-wrapper">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="validationDefault03" className="label">
                        Email
                    </label>
                    <br />
                    <input
                        type="text"
                        className="usernameInput"
                        name="Username"
                        value={email}
                        placeholder="email@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <br />
                    <label htmlFor="validationDefault03" className="label">
                        Password
                    </label>

                    <br />
                    <input
                        type="password"
                        className="password-input"
                        name="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <br />
                    <button className="loginBtn">
                        {loading ? (
                            <span className="login-text">Login</span>
                        ) : (
                            <span style={{ color: "white" }}>
                                <span
                                    className="spinner-grow spinner-grow-sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            </span>
                        )}
                    </button>
                </form>
            </div>
            {/* <div className="wrappers">
            
                        
                       
                        <Button  onClick={handleSubmit}>{loading ?
                            <span style={{color: "white", fontSize: "18px"}}>Login</span> :
                            <span style={{color: "white"}}>
                            {/* <span className="spinner-grow spinner-grow-sm" role="status"
                                  aria-hidden="true"/> 
                        </span>
                        }
                        </Button>
                        <div className="col-md-6">
                            <span style={{color: "red"}}>{message}</span>
                        </div>
                    </form>
                </div>
            </div> */}
        </>
    );
}
