import React, { useState } from "react";
import "../../css/login.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState, userInfo } from "./User/userState";
import logo from "../../assets/logo.jpg";
import UsersServices from "../../services/UsersServices";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [login, setLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const [ userInformation , setUserInformation] = useRecoilState(userInfo)
    // const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") || false);

    //-----------setting role of the user logged in----------//

    let [{}, setLoginStatus] = useRecoilState(userState);

    ///----------------end------------------------------//

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email.length > 0 && password.length > 0) {
            const user = { _token: "{{csrf_token()}}", email, password };

            setLoading(false);
            setMessage("");
            setTimeout(() => {
                setLoading(true);
                setLogin(true);
            }, 2000);
            UsersServices.userLogin(user)
                .then((res) => {
                    if (res.status === 200) {

                        const user = btoa(JSON.stringify(res.data["user"]));
                        localStorage.setItem("key", res.data.access_token);
                        localStorage.setItem('vitals' , user)
                        setLoginStatus({ loggedIn: true, role: "admin" });
                        navigate("/dashboard");
                        // in the api there should be a return statement as an exception
                    } else if (res.status === 422) {
                        console.log(res);
                    } else {
                        res = {
                            message:
                                "An error occurred Please contact the administrator",
                            code: 500,
                            status: "error",
                        };
                        console.error(res);
                    }
                })
                .catch((err) => {
                    console.log("error =>", err);
                });
        }
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
                <div>
                    <p>Don't have an account? please contact administrator</p>
                </div>
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
