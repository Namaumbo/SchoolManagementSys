import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { BiBell } from "react-icons/bi";


export default function CustomPaper({ ...props }) {
    const { heading, count } = props;
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                    m: 1,
                    width: 250,
                    height: 128,
                },
            }}
        >
            <Paper elevation={2} sx={{ backgroundColor: 'grey' }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                    {heading}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                        <BiBell />{count}
                        </Typography>
                        <Typography variant="body2">
                            This is some example content inside the Paper
                            component
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}