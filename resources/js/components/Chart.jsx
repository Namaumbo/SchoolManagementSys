import React from  "react"
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {Man} from "@mui/icons-material";


const Chart = ({student,percentages}) =>{
    return <>
    <div className="chart">
        <CircularProgressbarWithChildren value={percentages} strokeWidth={2}>
            <Man style={{fontSize:"60px"}} />
            <div style={{ fontSize: 12, marginTop: -5 }}>
                <strong>{percentages}%</strong> {student} students
            </div>
        </CircularProgressbarWithChildren>;
    </div>
    </>
}
export default Chart
