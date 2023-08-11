import React, { useEffect, useState } from "react";
import "./users.css";
import { useRecoilState } from "recoil";
import { userState } from "@/components/User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import * as IconSection from "react-icons/all";
import UsersServices from "../../../../services/UsersServices";

function UserManagement() {
    const [{ loggedIn, role, usersList }, setUsersList] =
        useRecoilState(userState);
    const [loading, setLoading] = useState(true);

    let [users, setUsers] = useRecoilState(userDetails);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    function handleEdit() {
        alert("ok");
        // redirect('/teachers')
    }
    useEffect(() => {
        let data = UsersServices.getAllUsers();

        data.then((res) => {
            console.log(res)
            setUsers(res);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <>
            <div className="heading">
                <IconSection.FiUsers />
                <span style={{ color: "white" }}>Users-available</span>
            </div>
            <div className="searchForm">
                <form role="search">
                    <input
                        class="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                </form>
            </div>
            {loading ? (
                <div
                    className="container text-center"
                    style={{ marginTop: "25%" }}
                >
                    <span className="noUser"> Fetching users wait...</span>
                </div>
            ) : (
                <div>
                    {users ? (
                        <>
                            <div className="user-tb">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Gender</th>
                                            <th>T/A</th>
                                            <th>Email</th>
                                            <th>District</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {users.map((user) => {
                                            return (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.title}</td>
                                                    <td>{user.firstname}</td>
                                                    <td>{user.surname}</td>
                                                    <td>{user.sex}</td>
                                                    <td>
                                                        {
                                                            user.traditional_authority
                                                        }
                                                    </td>

                                                    <td>{user.email}</td>
                                                    <td>{user.district}</td>
                                                    <td>
                                                        <button className="btn  btn-danger btn-sm">
                                                            <IconSection.AiFillDelete size="10px" />
                                                            Delete
                                                        </button>{" "}
                                                        <button className="btn btn-primary btn-sm">
                                                            <IconSection.FiEdit
                                                                size="10px"
                                                                onClick={
                                                                    handleEdit
                                                                }
                                                            />
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div
                            className="container text-center"
                            style={{ marginTop: "25%" }}
                        >
                            <span className="noUser">
                                Oops! no users so far add Users
                            </span>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default UserManagement;
