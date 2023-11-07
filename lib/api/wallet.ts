import { toast } from '@/components/common/toaster';
import { ApiError, ApiResponse, axios } from '@/lib/axios';
import { useWalletState } from '@/lib/store/wallet';
import { type QueryKey, useQuery, type UseQueryOptions } from '@tanstack/react-query';

export interface IWallet {
  totalWalletBalance: string;
  value: string;
  wallets: [
    {
      _id: string;
      amount: number;
      usdValue: number;
      coin: string;
    },
  ];
}

export interface IWalletTx {
  page: string;
  pages: string;
  limit: string;
  transactions: [];
}

const getWalletQueryKey: QueryKey = ['wallet-details'];
const getWalletTxQueryKey: QueryKey = ['wallet-txs'];
// fetch wallets
const fetchWallet = async () => await axios.get(`/wallet`);

// transactions
const fetchWalletTransactions = async ({
  limit,
  page,
  filters,
}: {
  limit: number;
  page: number;
  filters: Record<string, any>;
}) => {
  return await axios.get(`/transaction`, {
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

// single transactions
const fetchSingleTransactions = async (id: string) => {
  try {
    const { data } = await axios.get(`/transaction/${id}`);
    if (data?.status === 'success') {
      return data?.data;
    }
  } catch (error: any) {
    return error?.response?.data;
  }
};

// single transactions
export const fetchWalletStats = async ({ format }: { format: string }) => {
  try {
    const { data } = await axios.get(`/transaction/stats?format=${format}`);
    if (data?.status === 'success') {
      return data?.data;
    }
  } catch (error: any) {
    return error?.response?.data;
  }
};

// wallet withdrawal
const fetchWithdrawalStats = async (payload: any) => {
  try {
    const { data } = await axios.post(`/withdrawals`, payload);
    if (data?.status === 'success') {
      return data;
    }
  } catch (error: any) {
    return error?.response?.data;
  }
};

const fetchExchangeRate = async () => {
  try {
    const { data } = await axios.get(`/wallet/exchange`);
    if (data?.status === 'success') {
      return data;
    }
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const useGetWalletDetails = () => {
  const { setWallet } = useWalletState();
  const options: UseQueryOptions<ApiResponse<IWallet>, ApiError<null>> = {
    queryFn: async () => {
      return await fetchWallet();
    },
    queryKey: ['wallet-data-fetch'],
    onError: (error) => {
      toast.error(error.response?.data.message || 'An error occurred');
    },
    onSuccess: ({ data }) => {
      setWallet(data.data);
    },
  };

  return useQuery(getWalletQueryKey, options);
};

export const useGetWalletTxs = ({
  limit,
  page,
  filters,
}: {
  limit: number;
  page: number;
  filters: Record<string, any>;
}) => {
  const options: UseQueryOptions<ApiResponse<IWalletTx>, ApiError<null>> = {
    queryFn: async () => {
      return await fetchWalletTransactions({ limit, page, filters });
    },
    queryKey: ['wallet-tx-q', limit, page],
    onError: (error) => {
      toast.error(error.response?.data.message || 'An error occurred');
    },
    enabled: true,
  };

  return useQuery(getWalletTxQueryKey, options);
};

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

export const useGetPaymentCoins = () => {
  const getQueryIdKey = ['payment-coin'];
  return useQuery({
    queryFn: fetchPaymentCoins,
    queryKey: getQueryIdKey,
    onError: (error: any) => {
      toast.error(error.response?.data.message || 'An error fetching talents occurred');
    },
  });
};
