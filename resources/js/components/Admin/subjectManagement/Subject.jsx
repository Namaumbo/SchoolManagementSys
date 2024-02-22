import React from "react";
import * as IconSection from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { Fab } from "@mui/material";
import "./subject.css";

const Profile = () => {
    const handleSubmit = () => {};
    return (
        <>
            <div className="heading">
                <IconSection.BiBookOpen />
                <span style={{ color: "white" }}>Subject Management</span>
            </div>

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
                                        // checked={selectedValue === "Male"}
                                        // onChange={handleRadioChange}
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
                                        // checked={selectedValue === "Female"}
                                        // onChange={handleRadioChange}
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
                                        // value={formValues.firstname}
                                        // onChange={handleInputChange}
                                        name="firstname"
                                    />
                                    {/* lastname */}
                                    <input
                                        type="text"
                                        aria-label="last name name"
                                        class="form-control"
                                        placeholder="Last Name"
                                        // value={formValues.surname}
                                        // onChange={handleInputChange}
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
                                    // value={formValues.district}
                                    // onChange={handleInputChange}
                                    name="district"
                                />
                                {/* village */}
                                <input
                                    type="text"
                                    aria-label="last name name"
                                    class="form-control"
                                    placeholder="Village"
                                    // value={formValues.village}
                                    // onChange={handleInputChange}
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
                                    // value={formValues.traditional_authority}
                                    // onChange={handleInputChange}
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
                                    // value={formValues.email}
                                    // onChange={handleInputChange}
                                    name="email"
                                />
                                {/* password */}
                                <input
                                    type="password"
                                    aria-label="last name name"
                                    class="form-control"
                                    placeholder="Partial Password"
                                    // value={formValues.password}
                                    // onChange={handleInputChange}
                                    name="password"
                                />
                            </div>

                            {/* <div className="location">
                                <select
                                    id="ok"
                                    class="form-select form-select-sm"
                                    name="department"
                                    // value={formValues.departmentName}
                                    // onChange={handleSelectChange}
                                >
                                    <option value="" selected>
                                        departments
                                    </option>
                                    {departments.map((department) => {
                                        return (
                                            <option
                                                key={department.departmentName}
                                                value={
                                                    department.departmentName
                                                }
                                            >
                                                {department.departmentName}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    className="form-select form-select-sm"
                                    aria-label=".form-select-sm example"
                                    value={formValues.role_name}
                                    onChange={handleRoleChange}
                                >
                                    <option value="" selected>
                                        Roles
                                    </option>
                                    {roles.map((role) => {
                                        return (
                                            <option key={role.id}>
                                                {role.role_name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div> */}
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

            <Fab
                size="medium"
                color="primary"
                aria-label="add"
                id="fab"
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
            >
                <GoPlus size={25} />
            </Fab>
        </>
    );
};
export default Profile;
