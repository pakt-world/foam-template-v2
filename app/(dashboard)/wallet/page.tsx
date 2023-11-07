'use client';

import React, {
  useEffect,
  useMemo,
} from 'react';

import dayjs from 'dayjs';
import Image from 'next/image';
import { Button } from 'pakt-ui';

import {
  chartDataProps,
  WalletBalanceChart,
} from '@/components/wallet/chart';
import { WalletTransactions } from '@/components/wallet/transactions';
import { WithdrawalModal } from '@/components/wallet/withdrawalModal';
import {
  fetchWalletStats,
  useGetWalletDetails,
  useGetWalletTxs,
} from '@/lib/api/wallet';
import { formatUsd } from '@/lib/utils';
import { PaginationState } from '@tanstack/react-table';

const dateFormat = 'DD/MM/YYYY';
const MAX = 20;

export default function Wallet() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [limit, _setLimit] = React.useState(10);
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 1,
    pageSize: 6,
  });
  const [statData, setStatData] = React.useState<chartDataProps>({ weekly: [], monthly: [], yearly: [] });
  const { data: walletData } = useGetWalletDetails();
  const wallets = walletData?.data.data.wallets ?? [];
  const totalWalletBalance = walletData?.data.data.totalWalletBalance ?? "0.00";
  const {
    data: walletTx,
    refetch: fetchWalletTx,
    isLoading,
    isFetched: walletFetched,
    isFetching: walletIsFetching,
  } = useGetWalletTxs({ limit: pageSize, page: pageIndex, filters: { status: ["processing", "completed", "reprocessing"] } });

  const walletTransactions = useMemo(
    () =>
      (walletTx?.data?.data.transactions ?? []).map((tx: any) => ({
        date: dayjs(tx.createdAt).format(dateFormat),
        type: tx.type,
        amount: tx.amount,
        description:
          tx.description && tx.description?.length > MAX ? tx.description.slice(0, MAX) + '...' : tx.description,
        coin: tx.currency.toUpperCase(),
        usdValue: formatUsd(tx.usdValue),
        status: tx.status,
      }))
        // @ts-ignore
        .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()),
    [walletTx?.data?.data],
  );

  const getChartData = async () => {
    const response = await Promise.all([
      fetchWalletStats({ format: "weekly" }),
      fetchWalletStats({ format: "monthly" }),
      fetchWalletStats({ format: "yearly" }),
    ]);

    const weeklyStats = response[0].chart.map((c: any) => {
      return {
        date: String(dayjs(c.date).format('ddd')),
        amt: c.amount,
      };
    });

    const monthlyStats = () => {
      const data = response[1].chart;
      const n = 3;
      const mainData = [];
      let amt = 0;
      for (var i = 0, j = 0; i < data.length; i++) {
        const c = data[i];
        const date = String(dayjs(c.date).format("DD MMM"));
        amt += c.amount;
        if (i >= n && i % n === 0) {
          // push to array
          mainData.push({
            date,
            amt
          })
          amt = 0
          j++;
        }
      }
      return mainData as any;
    }

    const yearlyStats = response[2].chart.map((c: any) => {
      return {
        date: String(dayjs(c.date).format("MMM YY")),
        amt: c.amount,
      };
    });

    const chartData = {
      weekly: weeklyStats,
      monthly: monthlyStats(),
      yearly: yearlyStats,
    };

    setStatData(chartData);
  };

  const loadPage = async () => {
    return await Promise.all([fetchWalletTx(), getChartData()]);
  };

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
    fetchWalletTx();
  }, [pageIndex, pageSize]);

  const getWalletIcon = (wallet: any) => {
    return wallet.icon ?? '/icons/usdc-logo.svg';
  }

  return (
    <div className="flex flex-col h-full gap-6 overflow-auto">
      <div className="gap-6 flex flex-col h-full">
        <div className="grid grid-cols-2 gap-6">
          <div className=" gap-6 items-center grid grid-rows-2">
            <div className="bg-[#ECFCE5] text-primary items-center w-full border border-primary rounded-lg px-6 py-8 flex gap-2 justify-between">
              <div className="flex-col gap-2 flex">
                <span className="text-sm">Total Wallet Balance</span>
                <span className="text-3xl font-semibold">{formatUsd(parseFloat(totalWalletBalance) ?? 0.0)}</span>
              </div>
              <Button size="md" onClick={() => setIsOpen(true)}>
                Withdraw
              </Button>
              <WithdrawalModal isOpen={isOpen} onChange={setIsOpen} wallets={wallets} />
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
              {wallets.map((w, i) => (
                <div
                  key={i}
                  className="bg-[#F9F6FE] p-4 w-full h-full rounded-lg border border-[#5538EE] flex gap-2 items-center"
                  style={{
                    background: w.coin == 'avax' ? '#FEF4E3' : '#F9F6FE',
                    borderColor: w.coin == 'avax' ? '#A05E03' : '#5538EE',
                  }}
                >
                  <Image
                    src={getWalletIcon(w)}
                    width={75}
                    height={75}
                    alt=""
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-body text-sm">{w.coin.toUpperCase()} Wallet Balance</span>
                      <span className="text-2xl text-title font-semibold">{w.amount}</span>
                    </div>

                    <span className="mt-auto text-body text-sm">{formatUsd(w.usdValue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <WalletBalanceChart data={statData} />
        </div>
        <div className="grow h-full">
          <WalletTransactions
            data={walletTransactions}
            page={parseInt(walletTx?.data.data.page || '1')}
            limit={parseInt(walletTx?.data?.data?.limit || '10')}
            pageSize={parseInt(walletTx?.data?.data?.pages || '1')}
            onPageChange={setPagination}
            loading={!walletFetched && walletIsFetching}
          />
        </div>
      </div>
    </div>
  );
}
