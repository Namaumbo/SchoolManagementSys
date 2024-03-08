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
    // Fetch roles, departments, and users on component mount
    SchoolVitals.getRoles().then((roles) => {
      setRoles(roles.length > 0 ? roles : ["add roles"]);
    });

    SchoolVitals.getDepartments().then((departments) => {
      setDepartments(departments.length > 0 ? departments : ["add departments"]);
    });

    UsersServices.getAllUsers().then((users) => {
      setUsers(users.length > 0 ? users : []);
    });
  }, []);

  const [formValues, setFormValues] = useState({
    title: "",
    firstname: "",
    surname: "",
    email: "",
    password: "",
    sex: "",
    village: "",
    traditional_authority: "",
    district: "",
    departmentName: "",
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

  const handleRoleChange = (ev) => {
    setFormValues({
      ...formValues,
      role_name: ev.target.value,
    });
  };

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
      // Send a POST request to add a new user
      const response = await UsersServices.addUser(formValues);
      console.log(response.data); // Log the response from the server
      alert("User added successfully");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div>
      <div className="heading">
        <FiUsers />
        <span style={{ color: "white" }}>Teachers - Panel</span>
      </div>
      <div className="upperActions">
        <div className="searchForm">
          <form role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
        </div>
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
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
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
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      value="Male"
                      checked={selectedValue === "Male"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      Male
                    </label>
                    <input
                      type="radio"
                      value="Female"
                      checked={selectedValue === "Female"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      Female
                    </label>
                  </div>
                  <div className="names">
                    <input
                      type="text"
                      aria-label="Title"
                      className="form-control"
                      placeholder="Title"
                      value={formValues.title}
                      onChange={handleInputChange}
                      name="title"
                    />
                    <input
                      type="text"
                      aria-label="First name"
                      className="form-control"
                      placeholder="First Name"
                      value={formValues.firstname}
                      onChange={handleInputChange}
                      name="firstname"
                    />
                    <input
                      type="text"
                      aria-label="Surname"
                      className="form-control"
                      placeholder="Surname"
                      value={formValues.surname}
                      onChange={handleInputChange}
                      name="surname"
                    />
                  </div>
                  <div className="location">
                    <input
                      type="text"
                      aria-label="Village"
                      className="form-control"
                      placeholder="Village"
                      value={formValues.village}
                      onChange={handleInputChange}
                      name="village"
                    />
                    <input
                      type="text"
                      aria-label="Traditional Authority"
                      className="form-control"
                      placeholder="Traditional Authority"
                      value={formValues.traditional_authority}
                      onChange={handleInputChange}
                      name="traditional_authority"
                    />
                    <input
                      type="text"
                      aria-label="District"
                      className="form-control"
                      placeholder="District"
                      value={formValues.district}
                      onChange={handleInputChange}
                      name="district"
                    />
                  </div>
                  <div className="email">
                    <input
                      type="text"
                      aria-label="Email"
                      className="form-control"
                      placeholder="Email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      name="email"
                    />
                    <input
                      type="password"
                      aria-label="Password"
                      className="form-control"
                      placeholder="Password"
                      value={formValues.password}
                      onChange={handleInputChange}
                      name="password"
                    />
                  </div>
                  <div className="department">
                    <label htmlFor="departmentName">Department:</label>
                    <select
                      className="form-select"
                      id="departmentName"
                      value={formValues.departmentName}
                      onChange={handleSelectChange}
                      name="departmentName"
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.departmentName}>
                          {department.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="role">
                    <label htmlFor="role_name">Role:</label>
                    <select
                      className="form-select"
                      id="role_name"
                      value={formValues.role_name}
                      onChange={handleRoleChange}
                      name="role_name"
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {users.map((user) => (
        <div className="teacherInfo" key={user.id}>
          <div className="Image">
            <img src={profile} className="profilePic" alt="profile" />
          </div>
          <span className="name">{user.firstname}</span>
          <div className="expertise">{user.departmentName}</div>
          <div className="details"></div>
        </div>
      ))}
    </div>
  );
};

export default Team;
