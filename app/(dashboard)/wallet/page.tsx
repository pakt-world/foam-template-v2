"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "pakt-ui";
import { type PaginationState } from "@tanstack/react-table";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type TransformedData, WalletBalanceChart, type ChartDataProps } from "@/components/wallet/chart";
import { WalletTransactions } from "@/components/wallet/transactions";
import { WithdrawalModal } from "@/components/wallet/withdrawal-modal";
import { fetchWalletStats, useGetActiveRPC, useGetWalletDetails, useGetWalletTxs } from "@/lib/api/wallet";
import { formatUsd } from "@/lib/utils";

const dateFormat = "DD/MM/YYYY";
const MAX = 20;

interface ChartData {
    _id: string;
    count: number;
}

interface DataItem {
    date: string;
    amt: number;
}

interface TransactionProps {
    createdAt: string;
    type: "withdrawal" | "deposit";
    amount: string;
    description: string;
    currency: string;
    usdValue: number;
    status: "processing" | "pending" | "completed" | "failed" | "reprocessing";
    responseData: string;
}

export default function WalletPage(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    // const [limit, _setLimit] = useState(10);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 6,
    });
    const [statData, setStatData] = useState<ChartDataProps>({ weekly: [], monthly: [], yearly: [] });
    const { data: walletData } = useGetWalletDetails();
    const wallets = walletData?.data.data.wallets ?? [];
    const totalWalletBalance = walletData?.data.data.totalWalletBalance ?? "0.00";
    const {
        data: walletTx,
        refetch: fetchWalletTx,
        // isLoading,
        isFetched: walletFetched,
        isFetching: walletIsFetching,
    } = useGetWalletTxs({
        limit: pageSize,
        page: pageIndex,
        filters: { status: ["processing", "completed", "reprocessing"] },
    });
    const { data: rpcData } = useGetActiveRPC();

    const chainName = rpcData?.rpcName ?? "";

    const walletTransactions = useMemo(
        () =>
            (walletTx?.data?.data.transactions ?? [])
                .map((tx: TransactionProps) => ({
                    date: dayjs(tx.createdAt).format(dateFormat),
                    type: tx.type,
                    amount: String(tx.amount),
                    description:
                        tx.description && tx.description?.length > MAX
                            ? `${tx.description.slice(0, MAX)}...`
                            : tx.description,
                    coin: tx.currency.toUpperCase(),
                    usdValue: formatUsd(tx.usdValue),
                    status: tx.status,
                    transactionHash:
                        tx.responseData !== null && tx.responseData !== undefined
                            ? JSON.parse(tx.responseData).data.tx.transactionHash
                            : "",
                }))
                .sort((a, b) => new Date(b?.date).getTime() - new Date(a?.date).getTime()),
        [walletTx?.data?.data],
    );

    // Function to remove duplicates
    const removeDuplicates = (array: DataItem[]): DataItem[] => {
        return array.filter(
            (item, index, self) => index === self.findIndex((t) => t.date === item.date && t.amt === item.amt),
        );
    };
    const getChartData = async (): Promise<void> => {
        const response = await Promise.all([
            fetchWalletStats({ format: "weekly" }),
            fetchWalletStats({ format: "monthly" }),
            fetchWalletStats({ format: "yearly" }),
        ]);

        // ===== Weekly ===== //
        const weeklyData: TransformedData[] = response[0].map((c: ChartData) => {
            return {
                date: String(dayjs(c._id).format("ddd")),
                amt: c.count,
            };
        });

        function completeAndCarryOverWeekDataFromStartDay(data: DataItem[]): DataItem[] {
            const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const extendedDayOrder: DataItem[] = [];
            const resultMap: Record<string, number> = {};
            let lastAmount: number = 0;

            // Find the starting day from the data
            const startDay = data[0]?.date as string;

            // Reorder the dayOrder array to start from the startDay
            const startIndex = dayOrder.indexOf(startDay);
            const reorderedDayOrder = [...dayOrder.slice(startIndex), ...dayOrder.slice(0, startIndex)];

            // Extend the reorderedDayOrder array to include duplicates from the data
            reorderedDayOrder.forEach((day) => {
                const occurrences = data.filter((item) => item.date === day);
                if (occurrences.length > 0) {
                    occurrences.forEach((occurrence) => extendedDayOrder.push({ date: day, amt: occurrence.amt }));
                } else {
                    extendedDayOrder.push({ date: day, amt: 0 });
                }
            });

            // Update resultMap with data and carry over the last known balance
            extendedDayOrder.forEach((item) => {
                if (item.amt !== 0) {
                    lastAmount = item.amt;
                }
                resultMap[item.date] = lastAmount;
            });

            // Convert the resultMap to an array
            return Object.keys(resultMap).map((day) => ({
                date: day,
                amt: resultMap[day] as number,
            }));
        }

        const rdWeeklyStats = removeDuplicates(weeklyData);
        const weeklyStats = completeAndCarryOverWeekDataFromStartDay(rdWeeklyStats);

        // ===== Weekly ===== //

        // ===== Monthly ===== //

        const monthlyStats = response[1].map((c: ChartData) => {
            return {
                date: String(dayjs(c._id).format("DD MMM")),
                amt: c.count,
            };
        });

        // ===== Monthly ===== //
        const yearlyStats = response[2].map((c: ChartData) => {
            return {
                date: String(dayjs(c._id).format("MMM YY")),
                amt: c.count,
            };
        });

        const chartData = {
            weekly: weeklyStats,
            monthly: monthlyStats,
            yearly: yearlyStats,
        };

        setStatData(chartData);
    };

    const loadPage = async (): Promise<void> => {
        await Promise.all([fetchWalletTx(), getChartData()]);
    };

    useEffect(() => {
        void loadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        void fetchWalletTx();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize]);

    const getWalletIcon = (wallet: {
        _id: string;
        amount: number;
        usdValue: number;
        coin: string;
        icon?: string;
    }): string => {
        return wallet.icon ?? "/icons/usdc-logo.svg";
    };

    return (
        <div className="flex h-full flex-col gap-6 overflow-auto">
            <div className="flex h-full flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className=" grid grid-rows-2 items-center gap-6">
                        <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-primary bg-[#ECFCE5] px-6 py-8 text-primary">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">Total Wallet Balance</span>
                                <span className="text-3xl font-semibold">
                                    {formatUsd(parseFloat(totalWalletBalance) ?? 0.0)}
                                </span>
                            </div>
                            <Button
                                size="md"
                                onClick={() => {
                                    setIsOpen(true);
                                }}
                            >
                                Withdraw
                            </Button>
                            <WithdrawalModal
                                isOpen={isOpen}
                                onChange={setIsOpen}
                                wallets={wallets}
                                network={chainName}
                            />
                        </div>
                        <div className="grid h-full grid-cols-2 gap-6">
                            {wallets.map((w, i) => (
                                <div
                                    key={i}
                                    className="flex h-full w-full items-center gap-2 rounded-lg border border-[#5538EE] bg-[#F9F6FE] p-4"
                                    style={{
                                        background: w.coin === "avax" ? "#FEF4E3" : "#F9F6FE",
                                        borderColor: w.coin === "avax" ? "#A05E03" : "#5538EE",
                                    }}
                                >
                                    <Image src={getWalletIcon(w)} width={75} height={75} alt="" />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-body">
                                                {w.coin.toUpperCase()} Wallet Balance
                                            </span>
                                            <span className="text-2xl font-semibold text-title">{w.amount}</span>
                                        </div>

                                        <span className="mt-auto text-sm text-body">{formatUsd(w.usdValue)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <WalletBalanceChart data={statData} />
                </div>
                <div className="h-full grow">
                    <WalletTransactions
                        data={walletTransactions}
                        page={parseInt(walletTx?.data?.data?.page ?? "1", 10)}
                        // limit={parseInt(walletTx?.data?.data?.limit ?? "10", 10)}
                        pageSize={parseInt(walletTx?.data?.data?.pages ?? "1", 10)}
                        onPageChange={setPagination}
                        loading={!walletFetched && walletIsFetching}
                    />
                </div>
            </div>
        </div>
    );
}
