"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	Brush,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

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
	isMonth?: boolean;
}

const HEIGHT_MAP = {
	sm: 200,
	md: 300,
	lg: 400,
};

export const Chart = ({
	data,
	dataKey,
	xAxisKey,
	height = "sm",
	isMonth,
}: ChartProps): React.JSX.Element => {
	// Set start and end index for brush (7 days)
	const totalDataPoints = data.length;
	const daysToShow = 7;

	const endIndex = totalDataPoints - 1;
	const startIndex = Math.max(0, endIndex - daysToShow);
	return (
		<ResponsiveContainer
			width="100%"
			height="100%"
			maxHeight={HEIGHT_MAP[height]}
		>
			<LineChart
				data={data}
				margin={{ right: 5, top: 5, left: 0, bottom: 5 }}
			>
				<CartesianGrid stroke="#F0F1F2" horizontal={false} />
				<XAxis
					dataKey={xAxisKey}
					fontSize="12px"
					tick={{
						fill: "#1818196B",
					}}
					stroke="#E8E8E8"
					interval={0}
				/>
				<YAxis
					width={40}
					fontSize="12px"
					tick={{
						fill: "#1818196B",
					}}
					stroke="#E8E8E8"
				/>
				<Line
					dot={false}
					type="step"
					stroke="#28A745"
					strokeWidth={1.5}
					name={dataKey}
					dataKey={dataKey}
				/>
				{isMonth && (
					<Brush
						dataKey="date"
						height={15}
						stroke="#28A745"
						startIndex={startIndex}
						endIndex={endIndex}
						className="text-xs"
					/>
				)}
			</LineChart>
		</ResponsiveContainer>
	);
};
