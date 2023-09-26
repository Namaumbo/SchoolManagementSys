import React, { useEffect, useState } from "react";
import * as iconSection from "react-icons/all";
import { FormDropdown, Tab } from "semantic-ui-react";
import "./subject.css";
import SchoolVitals from "../../../../services/SchoolVitals";

export default function Subject() {
    let [subjects, setSubjects] = useState([]);
    const [modal, setModal] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
    });

    const fetchSubjects = () => {
        const data = SchoolVitals.getSubjects();
        data.then((subjects) => {
            setSubjects(subjects);
        }).catch((err) => {
            alert(err.message);
        });
    };

    const handleSubmit = () => {
        let res = SchoolVitals.addSubject(formValues);
        res.then((res) => {
            fetchSubjects();
        }).catch((err) => {
            console.error("Error adding item:", err);
        });
    };
    const showInfo = (subject) => {
        setModal("modal");
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleInputChange = (e) => {
        setFormValues({ ...formValues, name: e.target.value });
    };

    const panes = [
        {
            menuItem: "FORM 1",
            render: () => (
                <Tab.Pane>
                    <div className="container text-center">
                        <div className="btn-holder">
                            <button
                                type="button"
                                class="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                            >
                                Add Subject
                            </button>
                        </div>
                        <div className="con">
                            <div className="row align-items-start">
                                {subjects.map((subject) => {
                                    return (
                                        <>
                                            <div
                                                key={subject.id}
                                                className="col"
                                                onClick={() =>
                                                    showInfo(subject.name)
                                                }
                                            >
                                                <div className="card">
                                                    <div>
                                                        <h2 className="title">
                                                            {subject.name}
                                                        </h2>
                                                        <h4>Teachers : 3</h4>
                                                        <h4>Students : 20</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "FORM 2",
            render: () => <Tab.Pane>form 2</Tab.Pane>,
        },
        {
            menuItem: "FORM 3",
            render: () => <Tab.Pane>form 3</Tab.Pane>,
        },
        {
            menuItem: "FORM 4",
            render: () => <Tab.Pane>form 4</Tab.Pane>,
        },
    ];

    return (
        <div>
            <div className="heading">
                <iconSection.GoBook />
                <span style={{ color: "white" }}>Subjects - Panel</span>
            </div>
            <div className="main-sub">
                <Tab panes={panes} />
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
                            <div>
                                <div classNameName="names">
                                    <input
                                        type="text"
                                        aria-label="subject name"
                                        className="form-control"
                                        placeholder="Subject Name"
                                        value={formValues.name}
                                        onChange={handleInputChange}
                                        name="name"
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
            </div>

            {/* subject modalInstance */}
            {
                modal ? <> </> :
                <>
                    <div
                        data-bs-toggle={modal}
                        data-bs-target="#staticBackdrop"
                    >
                        <div
                            className="modal fade"
                            id="staticBackdrop"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabindex="-1"
                            aria-labelledby="staticBackdropLabel"
                            aria-hidden={modal}
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
                                        <div>
                                            <div className="names">
                                                <input
                                                    type="text"
                                                    aria-label="subject name"
                                                    className="form-control"
                                                    placeholder="Subject Name"
                                                    value={formValues.name}
                                                    onChange={handleInputChange}
                                                    name="name"
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
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
