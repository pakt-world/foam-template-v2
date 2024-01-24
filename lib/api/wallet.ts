/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type QueryKey, useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type AxiosError, type AxiosResponse } from "axios";
import { toast } from "@/components/common/toaster";
import { type ApiError, type ApiResponse, axios } from "@/lib/axios";
import { useWalletState } from "@/lib/store/wallet";

export interface IWallet {
    totalWalletBalance: string;
    value: string;
    wallets: [
        {
            _id: string;
            amount: number;
            usdValue: number;
            coin: string;
            icon: string;
        },
    ];
}

const getWalletQueryKey: QueryKey = ["wallet-details"];
const getWalletTxQueryKey: QueryKey = ["wallet-txs"];

// fetch wallets
const fetchWallet = async (): Promise<ApiResponse<IWallet>> => axios.get(`/wallet`);

// transactions

// single transactions
// const fetchSingleTransactions = async (id: string): Promise<void> => {
//     try {
//         const { data } = await axios.get(`/transaction/${id}`);
//         if (data?.status === "success") {
//             return data?.data;
//         }
//     } catch (error) {
//         return error?.response?.data;
//     }
// };

// single transactions

interface fetchWalletStatsParams {
    format: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWalletStats = async ({ format }: fetchWalletStatsParams): Promise<any> => {
    try {
        const { data } = await axios.get(`/transaction/stats?format=${format}`);
        if (data?.status === "success") {
            return data?.data;
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        return axiosError?.response?.data;
    }
};

// wallet withdrawal
// const fetchWithdrawalStats = async (payload: any) => {
//     try {
//         const { data } = await axios.post(`/withdrawals`, payload);
//         if (data?.status === "success") {
//             return data;
//         }
//     } catch (error: any) {
//         return error?.response?.data;
//     }
// };

// const fetchExchangeRate = async () => {
//     try {
//         const { data } = await axios.get(`/wallet/exchange`);
//         if (data?.status === "success") {
//             return data;
//         }
//     } catch (error: any) {
//         return error?.response?.data;
//     }
// };

export const useGetWalletDetails = (): UseQueryResult<ApiResponse<IWallet>, ApiError<null>> => {
    const { setWallet } = useWalletState();
    const options: UseQueryOptions<ApiResponse<IWallet>, ApiError<null>> = {
        queryFn: async () => {
            return fetchWallet();
        },
        queryKey: ["wallet-data-fetch"],
        onError: (error) => {
            toast.error(error.response?.data.message ?? "An error occurred");
        },
        onSuccess: ({ data }) => {
            setWallet(data.data);
        },
    };

    return useQuery(getWalletQueryKey, options);
};

// ===

export interface IWalletTx {
    page: string;
    pages: string;
    limit: string;
    transactions: [];
}

interface ITransaction {
    limit: number;
    page: number;
    filters: Record<string, unknown>;
}

const fetchWalletTransactions = async ({ limit, page, filters }: ITransaction): Promise<AxiosResponse<IWalletTx>> => {
    return axios.get(`/transaction`, {
        params: {
            page,
            limit,
            ...filters,
        },
    });
};

export const useGetWalletTxs = ({
    limit,
    page,
    filters,
}: ITransaction): UseQueryResult<ApiResponse<IWalletTx>, ApiError<null>> => {
    const options: UseQueryOptions<ApiResponse<IWalletTx>, ApiError<null>> = {
        // @ts-expect-error ---
        queryFn: async () => {
            return fetchWalletTransactions({ limit, page, filters });
        },
        queryKey: ["wallet-tx-q", limit, page],
        onError: (error) => {
            toast.error(error.response?.data.message ?? "An error occurred");
        },
        enabled: true,
    };

    return useQuery(getWalletTxQueryKey, options);
};

// ===

export interface PaymentCoinsProps {
    active: boolean;
    contractAddress: string;
    createdAt: string;
    decimal: string;
    isToken: boolean;
    name: string;
    reference: string;
    rpcChainId: string;
    symbol: string;
    icon: string;
    updatedAt: string;
}

const fetchPaymentCoins = async (): Promise<PaymentCoinsProps[]> => {
    const res = await axios.get(`/payment/coins`);
    return res.data.data;
};

export const useGetPaymentCoins = (): UseQueryResult<PaymentCoinsProps[], ApiError> => {
    const getQueryIdKey = ["payment-coin"];
    return useQuery({
        queryFn: fetchPaymentCoins,
        queryKey: getQueryIdKey,
        onError: (error: ApiError) => {
            toast.error(error.response?.data.message ?? "An error fetching talents occurred");
        },
    });
};

// ===

export interface ActiveRPCProps {
    rpcName: string;
    rpcChainId: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
}

const fetchRPCServer = async (): Promise<ActiveRPCProps> => {
    const res = await axios.get(`/payment/rpc`);
    return res.data.data;
};

export const useGetActiveRPC = (): UseQueryResult<ActiveRPCProps, unknown> => {
    const getQueryIdKey = ["active-rpc"];
    return useQuery({
        queryFn: fetchRPCServer,
        queryKey: getQueryIdKey,
        onError: (error: ApiError) => {
            toast.error(error.response?.data.message ?? "An error fetching talents occurred");
        },
    });
};
