import React, { useState } from "react";
import { RiUserFill, RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "./User/userState";
import logo from "../../assets/logo.jpg";
import UsersServices from "../../services/UsersServices";
import Swal from "sweetalert2";
import "../../css/login.css"; // Assuming this is for custom styles

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
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: Object.values(data.errors).flat().join("\n"),
                customClass: {
                    container: "bg-red-100 text-red-800 rounded-md p-4",
                    title: "font-bold",
                    icon: "text-red-600",
                },
            });
        } else if (status === 401 && data?.status === "error") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    data?.message ||
                    "An unexpected error occurred. Please contact the administrator.",
                customClass: {
                    container: "bg-red-100 text-red-800 rounded-md p-4",
                    title: "font-bold",
                    icon: "text-red-600",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/admin-contact");
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "An unexpected error occurred. Please contact the administrator.",
                customClass: {
                    container: "bg-red-100 text-red-800 rounded-md p-4",
                    title: "font-bold",
                    icon: "text-red-600",
                },
            });
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
                        case "Administrator":
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
                        if (res.data.user.login_count > 0) {
                            navigate("/dashboard");
                        } else {
                            navigate("/initial-page");
                        }
                    }
                } else {
                    handleErrorResponse(res);
                }
            } catch (error) {
                handleErrorResponse(error.response);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                        <img src={logo} className="w-48 mx-auto" alt="Logo" />
                    </div>
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                            <span className="w-10 pl-2 text-center flex items-center justify-center text-gray-400">
                                <RiUserFill />
                            </span>
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-700 py-2 px-3 leading-tight focus:outline-none"
                                id="email"
                                type="text"
                                placeholder="email@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                            <span className="w-10 pl-2 text-center flex items-center justify-center text-gray-400">
                                <RiLockPasswordFill />
                            </span>
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-700 py-2 px-3 leading-tight focus:outline-none"
                                id="password"
                                type="password"
                                placeholder="******************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Sign In"}
                        </button>
                    </div>
                    <p className="text-center mt-4 text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <a
                            className="inline-block align-baseline font-bold text-blue-500 hover:text-blue-800"
                            href="/admin-contact"
                        >
                            Contact Administrator
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
