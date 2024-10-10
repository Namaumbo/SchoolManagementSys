import React from "react";
import { ResponsiveLine } from "@nivo/line";

const data = [
    {
        id: "Passing Rate (%)",
        color: "hsl(217, 70%, 50%)",
        data: [
            { x: "2000", y: 85 },
            { x: "2001", y: 90 },
            { x: "2002", y: 78 },
            { x: "2003", y: 92 },
            { x: "2004", y: 88 },
            { x: "2005", y: 95 },
        ],
    },
];

const NivoLineChartComponent = () => (
    <div className="h-[350px] w-full ">
        <ResponsiveLine            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
            }}
            axisBottom={{
                orient: "bottom",
                legend: "Years",
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                orient: "left",
                legend: "Passing Rate (%)",
                legendOffset: -40,
                legendPosition: "middle",
            }}
            colors={{ scheme: "nivo" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
        />
    </div>
);

export default NivoLineChartComponent;
