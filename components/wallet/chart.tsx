"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Tabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Chart } from "@/components/common/chart";

export interface TransformedData {
	date: string;
	amt: number;
	// [key: string]: string | number;
}

export interface ChartDataProps {
	weekly: TransformedData[];
	monthly: TransformedData[];
	yearly: TransformedData[];
}

export const WalletBalanceChart = ({
	data,
}: {
	data: ChartDataProps;
}): React.JSX.Element => {
	const modifiedWeeklyData = [...data.weekly];
	const modifiedMonthlyData = [...data.monthly];
	const modifiedYearlyData = [...data.yearly];

	if (modifiedWeeklyData.length > 0) {
		const lastData = modifiedWeeklyData[
			modifiedWeeklyData.length - 1
		] as TransformedData;
		const additionalDataPoint = { date: "", amt: lastData.amt };
		modifiedWeeklyData.push(additionalDataPoint);
	}

	if (modifiedMonthlyData.length > 0) {
		const lastData = modifiedMonthlyData[
			modifiedMonthlyData.length - 1
		] as TransformedData;
		const additionalDataPoint = { date: "", amt: lastData.amt };
		modifiedMonthlyData.push(additionalDataPoint);
	}

	if (modifiedYearlyData.length > 0) {
		const lastData = modifiedYearlyData[
			modifiedYearlyData.length - 1
		] as TransformedData;
		const additionalDataPoint = { date: "", amt: lastData.amt };
		modifiedYearlyData.push(additionalDataPoint);
	}

	return (
		<Tabs.Root
			defaultValue="week"
			className="flex flex-col gap-2 rounded-lg border border-line bg-white p-2"
		>
			<div className="flex items-center justify-between gap-2">
				<span className="text-lg font-medium text-title">Balance</span>

				<Tabs.List className="flex gap-1 rounded-lg bg-[#F0F2F5] p-1 px-2 text-xs text-[#828A9B]">
					<Tabs.Trigger
						className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
						value="week"
					>
						7 Days
					</Tabs.Trigger>
					<Tabs.Trigger
						className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
						value="month"
					>
						30 Days
					</Tabs.Trigger>
					<Tabs.Trigger
						className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
						value="year"
					>
						1 Year
					</Tabs.Trigger>
				</Tabs.List>
			</div>
			<div className="h-full">
				<Tabs.Content value="week" className="h-full">
					<Chart
						data={modifiedWeeklyData}
						dataKey="amt"
						xAxisKey="date"
						height="md"
					/>
				</Tabs.Content>
				<Tabs.Content value="month" className="h-full">
					<Chart
						data={modifiedMonthlyData}
						dataKey="amt"
						xAxisKey="date"
						height="md"
						isMonth
					/>
				</Tabs.Content>
				<Tabs.Content value="year" className="h-full">
					<Chart
						data={modifiedYearlyData}
						dataKey="amt"
						xAxisKey="date"
						height="md"
					/>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	);
};
