import React from "react"

import { Tab } from "semantic-ui-react";

const panes = [
    {
        menuItem: "Form 1",
        render: () => (
            <Tab.Pane>
                infotmatmion tab can even contain a component to render
            </Tab.Pane>
        ),
    },
    {
        menuItem: "Form 2",
        render: () => (
            <Tab.Pane>
                <MaterialReactTable columns={columns} data={userInfo} />
            </Tab.Pane>
        ),
    },
    {
        menuItem: "Form 3",
        render: () => (
            <Tab.Pane>
                <MaterialReactTable
                    columns={columns}
                    Student={StudentInfo}
                />
            </Tab.Pane>
        ),
    },
    {
        menuItem: "Form",
        render: () => <Tab.Pane>anyother tab informaiton here </Tab.Pane>,
    },
];


const Classes= () =>{
    return<>
        <div className="tabs">
                <Tab panes={panes} />
            </div>

    </>
}
export default Classes
