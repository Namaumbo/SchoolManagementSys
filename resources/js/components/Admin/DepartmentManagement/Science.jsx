import { FiHome, FiUmbrella } from "react-icons/fi";
import "./Science.css";
import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import React, { useEffect, useState } from "react";
import { userState } from "../../User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import { useRecoilState } from "recoil";
import axios from "axios";
import { Tab } from "semantic-ui-react";

export default function Science() {
    let [userInfo, setUserInfo] = useRecoilState(userDetails);
    const [data, setData] = useState([]);

    let [StudentInfo, setStudentInfo] = useRecoilState(userDetails);
    const [Student, setStudent] = useState([]);

    let [{ loggedIn, role }] = useRecoilState(userState);
    const accessKey = localStorage.getItem("key");
    const headers = {
        Authorization: `Bearer ${accessKey}`,
    };

    useEffect(async() => {
      
            await axios
                .get("http://127.0.0.1:8000/api/Science-students", { headers })
                .then((res) => {
                    setUserInfo(res.data);
                    setData(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        getUsers().then(null);
    }, ["http://127.0.0.1:8000/api/Science-students"]);

    // useEffect(async() => {

    //     await axios
    //     .get("http://127.0.0.1:8000/api/Students-science", { headers })
    //     .then((res) => {
    //         setStudentInfo(res.Student);
    //         setStudent(res.Student);
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });


    // })

    const columns = useMemo(
        () => [
            { accessorKey: "title", header: "Title", size: 150 },
            { accessorKey: "firstname", header: "Firstname", size: 150 },
            { accessorKey: "surname", header: "Surname", size: 200 },
            { accessorKey: "email", header: "Email", size: 150 },
            { accessorKey: "district", header: "District", size: 150 },
            { accessorKey: "village", header: "Village", size: 150 },
        ],

        []
    );
    const rows = data;

    // tabs
    const panes = [
        {
            menuItem: "Depart Info",
            render: () => (
                <Tab.Pane>
                    infotmatmion tab can even contain a component to render
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Teachers",
            render: () => (
                <Tab.Pane>
                    <MaterialReactTable columns={columns} data={userInfo} />
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Students",
            render: () => (
                <Tab.Pane>
                <MaterialReactTable columns={columns} Student={StudentInfo} />
            </Tab.Pane>
            ),
        },
        {
            menuItem: "another",
            render: () => <Tab.Pane>anyother tab informaiton here </Tab.Pane>,
        },
    ];

    return (
        <>
            <div className="heading-title">
                <FiUmbrella />
                <span style={{ color: "white" }}>Science - Department</span>
            </div>
            <div className="tabs">
                <Tab panes={panes} />
            </div>
        </>

        // <h1>Science</h1>
        //
    );
}
