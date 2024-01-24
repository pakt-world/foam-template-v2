"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";

const WALLET_LOGO: Record<string, string> = {
    MetaMask: "/icons/metamask.svg",
    "Core Wallet": "/icons/core-wallet.svg",
    WalletConnect: "/icons/wallet-connect.svg",
    "Coinbase Wallet": "/icons/coinbase-wallet.svg",
};

export const WalletConnectorList: FC = () => {
    const { isConnected, connector: activeConnector } = useAccount();
    const { connect, connectors, isLoading, pendingConnector } = useConnect();
    return (
        <div className="flex flex-col gap-6">
            {/* @ts-expect-error -- Connector can't be used as types */}
            {connectors.map((connector: Connector) => {
                const isActive = isConnected && activeConnector?.id === connector.id;
                const logo = WALLET_LOGO[connector.name];

                return (
                    <button
                        key={connector.name}
                        type="button"
                        disabled={!connector.ready}
                        onClick={() => {
                            connect({ connector });
                        }}
                        className={`flex items-center justify-between rounded-2xl border border-[#DFDFE6] p-1 px-4 py-3 text-left duration-300 hover:border-primary hover:!border-opacity-30 ${
                            isActive ? "border-primary !border-opacity-60 bg-green-50" : "border-[#DFDFE6]"
                        }`}
                    >
                        <span className="flex w-full items-center gap-2">
                            <span>{connector.name}</span>
                            {isLoading && pendingConnector?.id === connector.id && (
                                <span className="animate-spin">
                                    <Loader2 size={16} />
                                </span>
                            )}
                        </span>

                        <span>{logo != null && <Image src={logo} width={20} height={20} alt="" />}</span>
                    </button>
                );
            })}
        </div>
    );
};
