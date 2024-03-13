import React, { useState } from "react";
import { RiUserFill, RiLockPasswordFill } from "react-icons/ri";
import "../../css/login.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "./User/userState";
import logo from "../../assets/logo.jpg";
import UsersServices from "../../services/UsersServices";
import Swal from "sweetalert2";

import "../../css/login.css";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [, setLoginStatus] = useRecoilState(userState);

    const handleErrorResponse = (res) => {
        const { status, data } = res;

        if (
            status === 422 &&
            data?.status === "error" &&
            data?.message === "Validation Error"
        ) {
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
                text:
                    data?.message ||
                    "An unexpected error occurred. Please contact the administrator.",
            });
            // Add a link to the administrator here (replace '/admin-contact' with the actual route)
            Swal.fire({
                icon: "info",
                title: "Administrator Contact",
                text: "If you're an administrator, please click below to contact support.",
                showCancelButton: true,
                confirmButtonText: "Contact Administrator",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to the administrator contact page
                    navigate("/admin-contact");
                }
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
                console.log(res);
                if (res.status === 200) {
                    const user = window.btoa(JSON.stringify(res.data["user"]));
                    localStorage.setItem("key", res.data.access_token);
                    localStorage.setItem("vitals", user);

                    switch (res.data.user.role_name) {
                        case "Teacher":
                            localStorage.setItem("loggedIn", window.btoa(true));
                            localStorage.setItem(
                                "role",
                                window.btoa("Teacher")
                            );
                            break;
                        case "Head teacher":
                            localStorage.setItem("loggedIn", window.btoa(true));
                            localStorage.setItem(
                                "role",
                                window.btoa("Head teacher")
                            );
                            break;
                        case "Student":
                            localStorage.setItem("loggedIn", window.btoa(true));
                            localStorage.setItem(
                                "role",
                                window.btoa("Student")
                            );
                            break;
                        case "admin":
                            localStorage.setItem("loggedIn", window.btoa(true));
                            localStorage.setItem("role", window.btoa("admin"));

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
                    <div className="input-wrapper">
                        <label htmlFor="email">
                            <RiUserFill />
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="Username"
                            value={email}
                            placeholder="email@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">
                            <RiLockPasswordFill />
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="loginBtn" disabled={loading}>
                        {loading ? (
                            <span className="login-text">Logging in...</span>
                        ) : (
                            <span>Login</span>
                        )}
                    </button>
                    {/* Link to the administrator contact page */}
                </form>
                <div className="admin-link">
                    <p>
                        Don't have an account? Please
                        <a href="/admin-contact"> Contact Administrator</a>
                    </p>
                </div>
            </div>
        </>
    );
}
