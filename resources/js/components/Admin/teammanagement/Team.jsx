import React, { useEffect, useState } from "react";
import "./teachers.css";
import { AddCircle, GpsFixed, Phone, Search } from "@mui/icons-material";
import profile from "../../../../assets/icons8-male-user-100.png";
import { FiUsers } from "react-icons/fi";
import axios from "axios";
import SchoolVitals from "../../../../services/SchoolVitals";
import UsersServices from "../../../../services/UsersServices";

const Team = () => {
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        SchoolVitals.getRoles().then((roles) => {
            if (roles.length > 0) {
                setRoles(roles);
            } else {
                setRoles(["add roles"]);
            }
        });
        SchoolVitals.getDepartments().then((departments) => {
            if (departments.length > 0) {
                setDepartments(departments);
            } else {
                setDepartments(["add departments"]);
            }
        });
        UsersServices.getAllUsers().then((users) => {
            if (users.length > 0) {
                setUsers(users);
            } else {
                setUsers([]);
            }
        });
    }, ["http://127.0.0.1:8000/api/departments"]);

    const [formValues, setFormValues] = useState({
        firstname: "",
        surname: "",
        title: "",
        village: "",
        traditional_authority: "",
        district: "",
        email: "",
        password: "",
        departmentName: "",
        sex: "",
        role_name: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSelectChange = (event) => {
        setFormValues({
            ...formValues,
            departmentName: event.target.value,
        });
    };
    const handleRoleChange = ev => {
        setFormValues({
            ...formValues,
            role_name : ev.target.value,
        });
    }

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        setFormValues({
            ...formValues,
            sex: event.target.value,
            title: event.target.value === "Male" ? "Mr" : "Mrs",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            
            UsersServices.addUser(formValues)
            .then((res) => {
                alert('user added successfully')
            }).catch((err) => {
                console.log(err);
            });
                  } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
                <div className="heading">
                    <FiUsers />
                    <span style={{ color: "white" }}>Teachers - Panel</span>
                </div>
                {/*search and buttons*/}
                <div className="upperActions">
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
                    <div>
                        {/* /////////////////////////
                        / */}
                        <div className="buttons">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                            >
                                Add Teacher
                            </button>

                            <div
                                className="modal fade"
                                id="staticBackdrop"
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabindex="-1"
                                aria-labelledby="staticBackdropLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1
                                                className="modal-title fs-5"
                                                id="staticBackdropLabel"
                                            >
                                                Add Teacher Details
                                            </h1>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        type="radio"
                                                        value="Male"
                                                        checked={
                                                            selectedValue ===
                                                            "Male"
                                                        }
                                                        onChange={
                                                            handleRadioChange
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        for="inlineRadio1"
                                                    >
                                                        male
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        type="radio"
                                                        value="Female"
                                                        checked={
                                                            selectedValue ===
                                                            "Female"
                                                        }
                                                        onChange={
                                                            handleRadioChange
                                                        }
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="inlineRadio2"
                                                    >
                                                        female
                                                    </label>
                                                </div>

                                                <div className="names">
                                                    {/* firstname */}
                                                    <input
                                                        type="text"
                                                        aria-label="First name"
                                                        class="form-control"
                                                        placeholder="First Name"
                                                        value={
                                                            formValues.firstname
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        name="firstname"
                                                    />
                                                    {/* lastname */}
                                                    <input
                                                        type="text"
                                                        aria-label="last name name"
                                                        class="form-control"
                                                        placeholder="Last Name"
                                                        value={
                                                            formValues.surname
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        name="surname"
                                                    />
                                                </div>
                                            </div>

                                            <div className="location">
                                                {/* district */}
                                                <input
                                                    type="text"
                                                    aria-label="First name"
                                                    class="form-control"
                                                    placeholder="District"
                                                    value={formValues.district}
                                                    onChange={handleInputChange}
                                                    name="district"
                                                />
                                                {/* village */}
                                                <input
                                                    type="text"
                                                    aria-label="last name name"
                                                    class="form-control"
                                                    placeholder="Village"
                                                    value={formValues.village}
                                                    onChange={handleInputChange}
                                                    name="village"
                                                />
                                            </div>

                                            <div className="gadgets">
                                                {/* T/A */}
                                                <input
                                                    type="text"
                                                    aria-label="First name"
                                                    class="form-control"
                                                    placeholder="Traditional authority"
                                                    id="tA"
                                                    value={
                                                        formValues.traditional_authority
                                                    }
                                                    onChange={handleInputChange}
                                                    name="traditional_authority"
                                                />
                                            </div>

                                            <div className="location">
                                                {/* email */}
                                                <input
                                                    type="text"
                                                    aria-label="First name"
                                                    class="form-control"
                                                    placeholder="Email"
                                                    value={formValues.email}
                                                    onChange={handleInputChange}
                                                    name="email"
                                                />
                                                {/* password */}
                                                <input
                                                    type="password"
                                                    aria-label="last name name"
                                                    class="form-control"
                                                    placeholder="Partial Password"
                                                    value={formValues.password}
                                                    onChange={handleInputChange}
                                                    name="password"
                                                />
                                            </div>

                                            <div className="location">
                                                <select
                                                    id="ok"
                                                    class="form-select form-select-sm"
                                                    name="department"
                                                    value={
                                                        formValues.departmentName
                                                    }
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                >
                                                    <option value="" selected>
                                                        departments
                                                    </option>
                                                    {departments.map(
                                                        (department) => {
                                                            return (
                                                                <option
                                                                    key={
                                                                        department.departmentName
                                                                    }
                                                                    value={
                                                                        department.departmentName
                                                                    }
                                                                >
                                                                    {
                                                                        department.departmentName
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                                <select
                                                    className="form-select form-select-sm"
                                                    aria-label=".form-select-sm example"
                                                    value={
                                                        formValues.role_name
                                                    }
                                                    onChange = {
                                                        handleRoleChange
                                                    }
                                                >
                                                    <option value=""  selected>
                                                        Roles
                                                    </option>
                                                    {roles.map((role) => {
                                                        return (
                                                            <option
                                                                key={role.id}
                                                            >
                                                                {role.role_name}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                                onClick={handleSubmit}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ////////////////////////// */}
                    </div>
                </div>

                {/* userss */}
                <>
                    {users.map(function (user) {
                        return (
                            
                                <div className="teacherInfo">
                                    <div className="Image">
                                        <img
                                            src={profile}
                                            className="profilePic"
                                        />
                                    </div>
                                    <span className="name">
                                        {user.firstname}
                                    </span>
                                    <div className="expertise">
                                        {user.departmentName}
                                    </div>
                                    <div className="details"></div>
                                </div>
                            
                        );
                    })}
                </>
            </div>
    );
};
export default Team;