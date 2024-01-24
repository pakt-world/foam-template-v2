"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface TransformedData {
    date: string;
    amt: number;
    // [key: string]: string | number; // Add this line
}

interface ChartProps {
    data: TransformedData[];
    height?: "sm" | "md" | "lg";
    dataKey: string;
    xAxisKey: string;
}

const HEIGHT_MAP = {
    sm: 200,
    md: 300,
    lg: 400,
};

export const Chart = ({ data, dataKey, xAxisKey, height = "sm" }: ChartProps): React.JSX.Element => {
    return (
        <ResponsiveContainer width="100%" height="100%" maxHeight={HEIGHT_MAP[height]}>
            <LineChart data={data} margin={{ right: 5, top: 5, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#F0F1F2" horizontal={false} />
                <XAxis
                    dataKey={xAxisKey}
                    fontSize="12px"
                    tick={{
                        fill: "#1818196B",
                    }}
                    axisLine={false}
                    stroke="#E8E8E8"
                    allowDuplicatedCategory={false}
                />
                <YAxis
                    width={40}
                    fontSize="12px"
                    tick={{
                        fill: "#1818196B",
                    }}
                    axisLine={false}
                    stroke="#E8E8E8"
                />
                <Line dot={false} type="step" stroke="#28A745" strokeWidth={1.5} name={dataKey} dataKey={dataKey} />
            </LineChart>
        </ResponsiveContainer>
    );
};
