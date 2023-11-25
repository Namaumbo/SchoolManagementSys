import React, { useState } from "react";
import "../../css/login.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "./User/userState";
import logo from "../../assets/logo.jpg";
import UsersServices from "../../services/UsersServices";
import Swal from "sweetalert2";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [, setLoginStatus] = useRecoilState(userState);

    const handleErrorResponse = (res) => {
        const { status, data } = res;

        if (status === 422 && data?.status === "error" && data?.message === "Validation Error") {
            // Handle validation errors
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: Object.values(data.errors).flat().join("\n"),
            });
        } else if (status === 401 && data?.status === "error") {
            // Handle other errors, including invalid credentials
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data?.message || "An unexpected error occurred. Please contact the administrator.",
            });
        } else {
            // Handle other errors
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "An unexpected error occurred. Please contact the administrator.",
            });
        }

        // Handle other status codes if needed
        switch (status) {
            // ... other cases
            default:
                // Handle other status codes
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email.length > 0 && password.length > 0) {
            setLoading(true);

            try {
                const res = await UsersServices.userLogin({
                    _token: "{{csrf_token()}}",
                    email,
                    password,
                });

                if (res.status === 200) {
                    const user = btoa(JSON.stringify(res.data["user"]));
                    localStorage.setItem("key", res.data.access_token);
                    localStorage.setItem("vitals", user);

                    switch (res.data.user.role_name) {
                        case "Teacher":
                            setLoginStatus({
                                loggedIn: true,
                                role: "Teacher",
                            });
                            break;
                        case "Head teacher":
                            setLoginStatus({
                                loggedIn: true,
                                role: "Head teacher",
                            });
                            break;
                        case "Student":
                            setLoginStatus({
                                loggedIn: true,
                                role: "Student",
                            });
                            break;
                        case "Administrator":
                            setLoginStatus({
                                loggedIn: true,
                                role: "admin",
                            });
                            break;
                        default:
                            break;
                    }

                    if (res.data.status === "success") {
                        Swal.fire({
                            icon: "success",
                            title: "Login Success!",
                            text: res.data.message || "Welcome!",
                        });

                        navigate("/dashboard");
                    }
                } else {
                    handleErrorResponse(res);
                }
            } catch (error) {
                // Display error from the controller
                handleErrorResponse(error.response);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <div className="logoScn">
                <img src={logo} className="logo" alt="Logo" />
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
                    <button className="loginBtn" disabled={loading}>
                        {loading ? (
                            <span className="login-text">Logging in...</span>
                        ) : (
                            <span>Login</span>
                        )}
                    </button>
                </form>
                <div>
                    <p>Don't have an account? Please contact the administrator.</p>
                </div>
            </div>
        </>
    );
}
