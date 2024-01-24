/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IWallet {
    totalWalletBalance: string;
    value: string;
    wallets:
        | Array<{
              _id: string;
              amount: number;
              usdValue: number;
              coin: string;
              icon: string;
          }>
        | [];
}

type WalletState = IWallet & {
    setWallet: (wallet: IWallet) => void;
};

export const useWalletState = create<WalletState>()(
    persist(
        (set) => ({
            totalWalletBalance: "0.00",
            value: "0.00",
            wallets: [],
            setWallet: (wallet) => {
                set(wallet);
            },
        }),
        {
            name: "wallet",
        },
    ),
);
