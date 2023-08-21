'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { Button } from 'pakt-ui';
import { formatUsd } from '@/lib/utils';
import dayjs from 'dayjs';
import { UserBalance } from '@/components/common/user-balance';
import { fetchWalletStats, useGetWalletTxs } from '@/lib/api/wallet';
import { useWalletState } from '@/lib/store/wallet';
import { WalletTransactions } from '@/components/wallet/transactions';
import { WalletBalanceChart, chartDataProps } from '@/components/wallet/chart';
import { WithdrawalModal } from '@/components/wallet/withdrawalModal';

const dateFormat = "DD/MM/YYYY";

export default function Wallet() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [limit, _setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [statData, setStatData] = React.useState<chartDataProps>({ weekly: [], monthly: [], yearly: [] });
  const { totalWalletBalance, wallets } = useWalletState();
  const { data: walletTx, refetch: fetchWalletTx, isFetched: walletFetched, isFetching: walletIsFetching } = useGetWalletTxs({ limit, page });

  const walletTransactions = useMemo(() => (walletTx?.data?.data.transactions ?? []).map((tx: any) => ({
    date: dayjs(tx.createdAt).format(dateFormat),
    type: tx.type,
    amount: tx.amount,
    description: tx.description,
    coin: tx.currency.toUpperCase(),
    usdValue: formatUsd(tx.usdValue),
    status: tx.status,
  })), [walletTx?.data?.data]);

  const getChartData = async () => {
    // const { payload: weekStat } = await fetchWalletStats({ format: "seven-day" });
    const respon = await Promise.all([
      fetchWalletStats({ format: "seven-day" }),
      fetchWalletStats({ format: "thirty-day" }),
      fetchWalletStats({ format: "yearly" }),
    ]);

    const weeklyStats = respon[0].map((c: any) => {
      return {
        date: String(dayjs(c.date).format(dateFormat)),
        amt: c.amount,
      };
    });

    const monthlyStats = respon[1].map((c: any) => {
      return {
        date: String(dayjs(c.date).format(dateFormat)),
        amt: c.amount,
      };
    });

    const yearlyStats = respon[2].map((c: any) => {
      return {
        date: String(dayjs(c.date).format(dateFormat)),
        amt: c.amount,
      };
    });

    const chartData = {
      'weekly': weeklyStats,
      'monthly': monthlyStats,
      'yearly': yearlyStats,
    }
    setStatData(chartData);
  };

  const loadpage = async () => {
    return await Promise.all([
      fetchWalletTx(),
      getChartData(),
    ]);
  }

  useEffect(() => {
    loadpage();
  }, []);


  useEffect(() => {
    fetchWalletTx();
  }, [page, limit]);

  const changePage = (p: number) => setPage(p);
  return (
    <div className="flex flex-col h-full gap-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div className="text-3xl text-title font-bold">Wallet</div>

        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2 text-3xl text-title">
            <UserBalance />
            <span>|</span> <span className="text-body">Balance</span>
          </div>
          <button className="flex gap-2 items-center text-primary text-sm font-bold bg-[#008D6C1A] p-3 rounded-full">
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="gap-6 flex flex-col">
        <div className="grid grid-cols-2 gap-6">
          <div className=" gap-6 items-center grid grid-rows-2">
            <div className="bg-[#ECFCE5] text-primary items-center w-full border border-primary rounded-lg px-6 py-8 flex gap-2 justify-between">
              <div className="flex-col gap-2 flex">
                <span className="text-sm">Total Wallet Balance</span>
                <span className="text-3xl font-semibold">{formatUsd(parseFloat(totalWalletBalance) ?? 0.00)}</span>
              </div>
              <Button size="md" onClick={() => setIsOpen(true)}>
                Withdraw
              </Button>
              <WithdrawalModal isOpen={isOpen} onChange={setIsOpen} />
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
              {wallets.map((w, i) =>
                <div key={i} className="bg-[#F9F6FE] p-4 w-full h-full rounded-lg border border-[#5538EE] flex gap-2 items-center" style={{ background: w.coin == "avax" ? "#FEF4E3" : "#F9F6FE", borderColor: w.coin == "avax" ? "#A05E03" : "#5538EE" }}>
                  <Image src={w.coin == "avax" ? "/icons/avax-logo.svg" : "/icons/usdc-logo.svg"} width={75} height={75} alt="" />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-body text-sm">{w.coin.toUpperCase()} Wallet Balance</span>
                      <span className="text-2xl text-title font-semibold">{w.amount}</span>
                    </div>

                    <span className="mt-auto text-body text-sm">{formatUsd(w.usdValue)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <WalletBalanceChart data={statData} />
        </div>
        <div className='grow'>
          <WalletTransactions
            data={walletTransactions}
            page={parseInt(walletTx?.data.data.page || "1")}
            limit={parseInt(walletTx?.data?.data?.limit || "10")}
            pageSize={parseInt(walletTx?.data?.data?.pages || "1")}
            onPageChange={changePage}
            loading={!walletFetched && walletIsFetching}
          />
        </div>
      </div>
    </div>
  );
}
