import React, { useEffect, useState } from "react";
import "./teachers.css";
import { AddCircle, GpsFixed, Phone, Search } from "@mui/icons-material";
import profile from "../../../../assets/profile.jpeg";
import { FiUsers } from "react-icons/fi";
import axios from 'axios'

const Team = () => {
    const [newTeacher, setNewTeacher] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    // getting the key
    const accessKey = localStorage.getItem("key");
    const headers = {
        Authorization: `Bearer ${accessKey}`,
    };

    useEffect(() => {
        async function departments() {
            
            await axios
                .get("http://127.0.0.1:8000/api/departments",{ headers })
                .then((res) => {
                    setDepartments(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        departments().then(null);

        async function roles() {
            await axios
                .get("http://127.0.0.1:8000/api/roles",{ headers })
                .then((res) => {
                    setRoles(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        roles().then(null);
    }, ["http://127.0.0.1:8000/api/departments"]);

    const [formValues, setFormValues] = useState({
        firstname: "",
        surname: "",
        title: "",
        village: "",
        phoneNumber: "",
        traditional_authority: "",
        district: "",
        email: "",
        password: "",
        departmentName: "",
        sex: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };
    const handleSelectChange = (event) => {
        // its giving a bug
        setFormValues({
            ...formValues,
            departmentName: event.target.value,
            sex: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const options = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            await axios
                .post(
                    "http://127.0.0.1:8000/api/register-user",
                    formValues,
                    options
                )
                .then((res) => {
                    if (res.status === 201) {
                        alert("for now alert is ok user saved");
                        setFormValues({
                            firstname: "",
                            surname: "",
                            title: "",
                            village: "",
                            phoneNumber: "",
                            traditional_authority: "",
                            district: "",
                            email: "",
                            password: "",
                            departmentName: "",
                            sex: "",
                        });
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        } catch (error) {
            console.log(error);
        }
    };

    // function AddTeacher() {
    //     return (
    //         <>
    //             <div className="addTeacherWrapper">
    //                 <div className="personal">
    //                     <div className="input">
    //                         <label>Title</label>
    //                         <br />
    //                         <input
    //                             className="form-control"
    //                             type="text"
    //                             value={formValues.title}
    //                             onChange={handleInputChange}
    //                             name="title"
    //                         />
    //                     </div>

    //                     <div className="input">
    //                         <label>Phone number</label>
    //                         <br />
    //                         <input
    //                             className="form-control"
    //                             type="tel"
    //                             value={formValues.phoneNumber}
    //                             onChange={handleInputChange}
    //                             name="phoneNumber"
    //                         />
    //                     </div>
    //                 </div>
    //                 <div className="input">
    //                     <label>Department</label>
    //                     <span style={{ color: "red" }}>*</span>
    //                     <br />

    //                     <select className="form-select">
    //                         {departments.map((department) => {
    //                             return (
    //                                 <option
    //                                     key={department.departmentName}
    //                                     value={department.departmentName}
    //                                 >
    //                                     {department.departmentName}
    //                                 </option>
    //                             );
    //                         })}
    //                     </select>
    //                 </div>
    //                 <div className="input">
    //                     <label>Class</label>
    //                     <span style={{ color: "red" }}>*</span>
    //                     <br />
    //                     <select className="form-select">
    //                         <option>Form 1</option>
    //                         <option>Form 2</option>
    //                         <option>Form 3</option>
    //                         <option>Form 4</option>
    //                     </select>
    //                 </div>
    //                 <div className="input">
    //                     <label>Sex</label>
    //                     <span style={{ color: "red" }}>*</span>
    //                     <br />
    //                     <select
    //                         className="form-select"
    //                         value={formValues.sex}
    //                         onChange={handleSelectChange}
    //                     >
    //                         <option value="male">Female</option>
    //                         <option value="female">Male</option>
    //                     </select>
    //                 </div>
    //                 <div className="input">
    //                     <br />
    //                     <select className="form-select"></select>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }

    return (
        <>
            <div>
                <div className="heading-title">
                    <FiUsers />
                    <h4>Teachers-panel</h4>
                </div>
                {/*search and buttons*/}
                <div className="upperActions">
                    <div className="search">
                        <Search />
                        <input
                            type="text"
                            className="input"
                            placeholder="Search Teachers"
                        />
                    </div>
                    <div>
                        {/* <button className='addBtn' onClick={() => {
                        setNewTeacher(true)
                    }}><AddCircle/>New Teacher
                    </button>
                   */}

                        {/* ////////////////////////// */}
                        <div className="buttons">
                            <button
                                type="button"
                                class="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                            >
                                Add Teacher
                            </button>

                            <div
                                class="modal fade"
                                id="staticBackdrop"
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabindex="-1"
                                aria-labelledby="staticBackdropLabel"
                                aria-hidden="true"
                            >
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1
                                                class="modal-title fs-5"
                                                id="staticBackdropLabel"
                                            >
                                                Add Teacher Details
                                            </h1>
                                            <button
                                                type="button"
                                                class="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div class="modal-body">
                                            <div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="inlineRadioOptions"
                                                        id="inlineRadio1"
                                                        value="option1"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="inlineRadio1"
                                                    >
                                                        male
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="inlineRadioOptions"
                                                        id="inlineRadio2"
                                                        value="option2"
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
                                                <input
                                                    type="text"
                                                    aria-label="First name"
                                                    class="form-control"
                                                    placeholder="Department"
                                                />
                                                <input
                                                    type="password"
                                                    aria-label="last name name"
                                                    class="form-control"
                                                    placeholder="Class"
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
                                                    class="form-select form-select-sm"
                                                    aria-label=".form-select-sm example"
                                                >
                                                    <option selected>
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
                                            </div>
                                        </div>

                                        <div class="modal-footer">
                                            <button
                                                type="button"
                                                class="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                                onClick={handleSubmit}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <button className='addBtn' ><AddCircle/>New Teacher
                    </button> */}
                            <button
                                type="button"
                                onClick={() => {
                                    setNewTeacher(true);
                                }}
                                class="btn btn-primary"
                            >
                                Add Teacher
                            </button>
                        </div>
                        {/* ////////////////////////// */}
                    </div>
                </div>
                {newTeacher ? (
                    <>
                        <AddTeacher />
                    </>
                ) : (
                    <>
                        <div className="teacherInfo">
                            <div className="insideWrapper">
                                <div className="Image">
                                    <img src={profile} className="profilePic" />
                                </div>
                                <span className="name">Tom Hanswell</span>
                                <div className="expertise">Science</div>
                                <div className="details">
                                    <Phone />
                                    <GpsFixed />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default Team;
