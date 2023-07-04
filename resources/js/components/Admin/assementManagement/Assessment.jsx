import { Button } from "bootstrap";
import { MaterialReactTable} from "material-react-table";
import { useMemo } from "react";
import { FiHome, FiGitMerge } from "react-icons/fi";


import React from "react";
import { render } from "react-dom";

export default function Assessment() {
    const columns = useMemo(
        () => [
            { accessorKey: "firstName", header: "FirstName", size: 150 },
            { accessorKey: "surname", header: "surname", size: 150 },
            { accessorKey: "class", header: "Class", size: 200 },
            {
                accessorKey: "firstAssessment",
                header: "FirstAssessment",
                size: 150,
            },
            {
                accessorKey: "secondAssessment",
                header: "SecondAssessment",
                size: 150,
            },
            { accessorKey: "finalGrade", header: "FinalGrade", size: 150 },
            {accessorKey:"actions" , header:"Actions", size:150}
        ],
        []
    );
    const test =  [
    {
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2,
            'actions': <btn/>
        },{
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2
        }
        ,{
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2
        }
        ,{
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2
        }
        ,{
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2
        }
        ,{
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2
        }
        ,{
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2
        }
        ,{
            "firstName" : "Daelo",
            "surname" : "Namaumbo",
            "class" : "form 3",
            "firstAssessment" : 88,
            "secondAssessment" : 90,
            "finalGrade": (88+90)/2
        }

    ]
    // const rows = data;
    
    return (
        <>
        <div className="heading">
                    <FiGitMerge/>
                    <span style={{ color: "white" }}>Assessment - Panel</span>
                </div>
            <div className="assessment-main">
                <MaterialReactTable columns={columns} data={test}  enableColumnActions={true}  />
                {/* <Button>Save History</Button>
                <Button>View Reports</Button> */}

            </div>
        </>
    );
}
