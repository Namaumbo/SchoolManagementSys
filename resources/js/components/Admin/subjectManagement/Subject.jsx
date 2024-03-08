import React, { useEffect } from "react";
import * as IconSection from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import Button from "@mui/material/Button";
import { Fab, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import SubjectService from "../../../../services/SubjectService";

const Subject = () => {
    /**
     *
     */
    const [subjects, setSubjects] = React.useState([]);
    const [subjectName, setSubjectName] = React.useState("");
    const [open, setOpen] = React.useState(false);

    // Improved version of the SubjectService function

    useEffect(() => {
        //TODO: display to the user interface
        const displayErrorMessage = (message) => {
            // Display user-friendly error message
            // Use proper error handling mechanism or library
            // Example: displayErrorMessage(message);
            console.log(message);
        };

        // FIXME: implement error to be logged to service
        const logErrorToService = (error) => {
            // Log error to external service
            // Use proper error handling mechanism or library
            // Example: logErrorToService(error);
            console.log(error);
        };

        const handleTimeout = () => {
            console.log("Request timed out");
            // Handle timeout error
        };

        const getAllSubjects = async () => {
            try {
                const response = await SubjectService.getAllSubjects();
                clearTimeout(timeout); // Clear the timeout if the request completes successfully
                if (response !== null && response !== undefined) {
                    if (response.length > 0) {
                        console.log(response);
                        setSubjects(response);
                    } else {
                        // Handle empty array case
                        setSubjects([]);
                    }
                } else {
                    // handle the case where subjects is null or undefined
                }
            } catch (error) {
                clearTimeout(timeout); // Clear the timeout if there is an error
                // TODO: Display user-friendly error message or log error to external service
                displayErrorMessage(
                    "Failed to fetch subjects. Please try again later."
                );
                // or
                // TODO: Log error message
                logErrorToService(error);
            }
        };

        const timeout = setTimeout(handleTimeout, 5000); // Timeout after 5 seconds

        getAllSubjects();

        return () => {
            clearTimeout(timeout); // Clear the timeout if the component is unmounted
        };
    }, [SubjectService.getAllSubjects]);

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
            <Snackbar
                open={open}
                autoHideDuration={6000}
                message="Subject Saved Successifuly 🙂"
            />
            <div className="row align-items-start">
                {subjects.map((subject) => {
                    return (
                        <div className="row" key={subject.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {subject.name}
                                    </h5>
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        20Students
                                    </h6>
                                    <p className="card-text">
                                        Some information and description added
                                        to the Subject.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
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
export default Subject;
