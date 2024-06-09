import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputComponent from "../Input/InputComponent";

const bull = (
    <Box
        component="span"
        sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
        •
    </Box>
);


const handelSave = () =>{
    alert("working");
}
export default function CardComponent() {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <h3 className="text-3xl font-bold">School Details</h3>
                <p>Enter your school Information.</p>
                <div className="mt-4">
                    <h3 htmlFor="school-name" className="mb-2 font-bold">
                        School Name
                    </h3>
                    <InputComponent placeholder="Enter school name" />
                </div>

                <div className="mt-4">
                    <h3 htmlFor="school-address" className="mb-2 font-bold">
                        School Address
                    </h3>
                    <InputComponent placeholder="Enter school Address" />
                </div>

                <div className="mt-4">
                    <h3 htmlFor="school-name" className="mb-2 font-bold">
                        School Phone Number
                    </h3>
                    <InputComponent placeholder="Enter school name" />
                </div>

                <div className="mt-4">
                    <h3 htmlFor="school-name" className="mb-2 font-bold">
                        School Logo
                    </h3>
                    <InputComponent placeholder="Enter school name" />
                </div>

                <div className="mt-4">
                    <h3 htmlFor="school-name" className="mb-2 font-bold">
                        School Logo
                    </h3>
                    <input type="file" required />
                </div>
            </CardContent>
            <CardActions>
                <Button size="large" variant="contained" onClick={() => {handelSave()}}>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
}
