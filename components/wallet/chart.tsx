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

export const WalletBalanceChart = ({ data }: { data: ChartDataProps }): React.JSX.Element => {
    return (
        <Tabs.Root defaultValue="week" className="flex flex-col gap-2 rounded-lg border border-line bg-white p-2">
            <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-medium text-title">Balance</span>

                <Tabs.List className="flex gap-1 rounded-lg bg-[#F0F2F5] p-1 px-2 text-xs text-[#828A9B]">
                    <Tabs.Trigger
                        className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                        value="week"
                    >
                        1 Week
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                        value="month"
                    >
                        1 Month
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
                    <Chart data={data.weekly} dataKey="amt" xAxisKey="date" height="md" />
                </Tabs.Content>
                <Tabs.Content value="month" className="h-full">
                    <Chart data={data.monthly} dataKey="amt" xAxisKey="date" height="md" />
                </Tabs.Content>
                <Tabs.Content value="year" className="h-full">
                    <Chart data={data.yearly} dataKey="amt" xAxisKey="date" height="md" />
                </Tabs.Content>
            </div>
        </Tabs.Root>
    );
};
