import React from "react";
import * as IconSection from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { Fab } from "@mui/material";
import "./subject.css";
import axios from "axios";
import SubjectService from "../../../../services/SubjectService";

const Profile = () => {
    /**
     *
     */
    const [subjectName, setSubjectName] = React.useState("");
    // TODO: add subject name option
    const allowedSubjects = [
        "Math",
        "English",
        "History",
        "BibleKnowledge",
        "Chemistry",
        "Physics",
        "Chichewa",
    ];
    const handleSubmit = () => {
        // Create a new subject object with the specified subject name

        if (!allowedSubjects.includes(subjectName)) {
            window.alert("Invalid subject name");
            return;
        }
          /**
   * Handles the submission of the subject form.
   * Checks if the subject name is valid and adds the subject if it is.
   */
       SubjectService.addSubject(subjectName)
       .then((res) => {
        console.log(res);
        alert("user added successfully");
    })
    .catch((err) => {
        console.log(err);
    });
    };
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
                                Add Subject Details
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="gadgets">
                                {/* Subject name */}
                                <input
                                    type="text"
                                    aria-label="First name"
                                    className="form-control"
                                    placeholder="e.g. English"
                                    id="subjectName"
                                    onChange={(e) =>
                                        setSubjectName(e.target.value)
                                    }
                                    value={subjectName}
                                    name="subjectName"
                                />
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
