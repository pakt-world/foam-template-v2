'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from 'pakt-ui';
import { cn } from '@/lib/utils';
import { PostJobPaymentDetailsResponse, useConfirmJobPayment, useGetJobById } from '@/lib/api/job';
import { RaceBy } from '@uiball/loaders';
import { useInviteTalentToJob } from '@/lib/api/job';
import { parseEther, parseUnits } from 'viem';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'next/navigation';
import { erc20ABI } from '@wagmi/core';
import { Copy, Loader2, X, ChevronLeft } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { Spinner } from '@/components/common';
import { useCopyToClipboard } from 'usehooks-ts';
import { usePostJobPaymentDetails } from '@/lib/api/job';
import { avalanche, avalancheFuji } from '@wagmi/core/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { useRouter } from 'next/navigation';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { AlertCircle } from 'lucide-react';
import { Modal } from '@/components/common/headless-modal';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

import {
  Connector,
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';
import { set } from 'date-fns';
import { Job } from '@/lib/types';
import { useGetPaymentCoins } from '@/lib/api/wallet';

const { chains, publicClient, webSocketPublicClient } = configureChains([avalancheFuji, avalanche], [publicProvider()]);

const wagmiConfig = createConfig({
  connectors: [
    // new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Pakt',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? '',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const CHAIN_ID = 43113;
const USDC_CONTRACT_ADDRESS = '0xa1ef10416440a13d555b9dc78f81153d13340588';

const WALLET_LOGO: Record<string, string> = {
  MetaMask: '/icons/metamask.svg',
  'Core Wallet': '/icons/core-wallet.svg',
  WalletConnect: '/icons/wallet-connect.svg',
  'Coinbase Wallet': '/icons/coinbase-wallet.svg',
};

type SUPPORTED_COINS = 'USDC' | 'AVAX';
const SUPPORTED_COINS = {
  USDC: 'USDC',
  AVAX: 'AVAX',
}

interface Props {
  params: {
    'job-id': string;
  };
}

export default function MakeDepositPage({ params }: Props) {
  const jobId = params['job-id'];
  const router = useRouter();
  const { data: job, isLoading, isFetched, isError } = useGetJobById({ jobId });
  const mutation = usePostJobPaymentDetails();
  const [paymentCoin, setPaymentCoin] = React.useState<SUPPORTED_COINS>();
  const [contractAddress, setContractAddress] = React.useState<string>();
  const { data: paymentCoinsData, isLoading: paymentCoinsLoading } = useGetPaymentCoins();

  const selectPaymentCoin = async (coin: SUPPORTED_COINS) => {
    setPaymentCoin(coin);
    mutation.mutate({ jobId, coin });
  };

  console.log("coins==>", paymentCoinsData);

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="flex flex-col gap-6 overflow-y-auto">
        <div>
          <div className="flex items-center gap-1">
            <ChevronLeft size={24} strokeWidth={2} onClick={router.back} className="cursor-pointer" />
            <span className="text-2xl font-medium">Make Deposit</span>
          </div>
        </div>
        <div className="flex">
          <div className="w-full max-w-3xl bg-white p-6 rounded-3xl gap-6 flex flex-col border border-line">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">Escrow Payment</h2>
              <p className="text-body text-lg">
                Before an invitation is sent to talent, a client is required to deposit payment into a secure escrow
                wallet. This payment safely lives on the blockchain and cannot be accessed by Afro.Fund, nor Pakt, nor
                any third party.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Choose Payment Method</h2>
              <div className="flex gap-2 items-center">
                {(paymentCoinsData || [])?.map((coin, i) => <button key={i}
                  className={cn(
                    'p-4 rounded-xl bg-white border-line flex items-center gap-2 border-[1.5px] hover:bg-green-50 duration-200',
                    {
                      'border-secondary bg-green-50': paymentCoin === coin.symbol,
                    },
                  )}
                  onClick={() => {
                    selectPaymentCoin(coin.symbol as SUPPORTED_COINS);
                    setContractAddress(coin.contractAddress);
                  }}
                >
                  <Image src={coin.symbol == SUPPORTED_COINS.USDC ? "/icons/usdc-logo.svg" : "/icons/avax-logo.svg"} alt="Coinbase" width={30} height={30} />
                  <span className="font-bold text-lg">{coin.symbol.toUpperCase()}</span>
                </button>)}
                {/* <button
                  className={cn(
                    'p-4 rounded-xl bg-white border-line flex items-center gap-2 border-[1.5px] hover:bg-green-50 duration-200',
                    {
                      'border-secondary bg-green-50': paymentCoin === 'AVAX',
                    },
                  )}
                  onClick={() => selectPaymentCoin('AVAX')}
                >
                  <Image src="/icons/avax-logo.svg" alt="Coinbase" width={30} height={30} />
                  <span className="font-bold text-lg">AVAX</span>
                </button> */}
              </div>
            </div>

            {paymentCoin && (
              <PaymentDetails
                jobId={jobId}
                coin={paymentCoin}
                paymentDetails={mutation.data}
                isLoading={mutation.isLoading || (!isFetched && isLoading)}
                isError={mutation.isError || isError}
                errMsg={mutation.error?.message}
                contractAddress={contractAddress}
                job={job}
              />
            )}
          </div>
        </div>
      </div>
    </WagmiConfig>
  );
}

interface PaymentDetailsProps {
  jobId: string;
  job?: Job;
  coin: SUPPORTED_COINS;
  paymentDetails?: PostJobPaymentDetailsResponse;
  isLoading: boolean;
  isError: boolean;
  errMsg?: string;
  contractAddress?: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  coin,
  jobId,
  isLoading,
  isError,
  errMsg,
  paymentDetails,
  job,
  contractAddress,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  if (isLoading)
    return (
      <div className="w-full bg-slate-50 min-h-[400px] rounded-xl flex items-center justify-center border border-line">
        <RaceBy />
      </div>
    );

  if (isError || !paymentDetails || !job)
    return (
      <div className="w-full bg-red-50 min-h-[400px] rounded-xl flex items-center justify-center border border-red-100">
        <div className="flex flex-col gap-2 text-red-500 items-center">
          <AlertCircle size={45} strokeWidth={2} />
          <span>{errMsg ?? 'Something went wrong. Please try again later.'}</span>
        </div>
      </div>
    );
  console.log(paymentDetails)
  const depositAddress = paymentDetails.address;

  return (
    <div className="gap-6 flex flex-col  w-full">
      <div className={cn('bg-[#ECFCE5] border border-[#198155] rounded-lg p-4 flex flex-col gap-4 text-[#198155]')}>
        <h2 className="text-lg font-bold">Payment Details</h2>

        <div className="flex flex-col gap-6 text-lg">
          <div className="flex items-center justify-between">
            <span>Amount</span>
            <span>${paymentDetails?.collectionAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Talent Receives</span>
            <span>${paymentDetails?.collectionAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Transaction Fee</span>
            <span>
              ${Number(paymentDetails?.usdFee).toFixed(2)} ({paymentDetails?.feePercentage}%)
            </span>
          </div>
          <div className="flex items-center justify-between font-bold">
            <span>Total</span>
            <span>
              {paymentDetails?.amountToPay} {coin}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-line p-6 bg-[#FCFCFC] rounded-2xl flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Image src="/icons/metamask.svg" alt="Coinbase" width={50} height={50} />
          <Image src="/icons/coinbase.svg" alt="Coinbase" width={50} height={50} />
          <Image src="/icons/wallet-connect.svg" alt="Coinbase" width={50} height={50} />
        </div>
        <p className="text-body">Connect your wallet of choice or pay with a deposit address.</p>
      </div>

      <Modal
        isOpen={isOpen}
        closeModal={() => {
          setIsOpen(false);
        }}
        disableClickOutside
      >
        <MakePaymentModal
          depositAddress={depositAddress}
          job={job}
          jobId={jobId}
          closeModal={() => setIsOpen(false)}
          coin={coin}
          coinAmount={paymentDetails?.amountToPay}
          contractAddress={contractAddress}
        />
      </Modal>

      <Button
        fullWidth
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Make Deposit
      </Button>
    </div>
  );
};

interface MakePaymentModalProps {
  jobId: string;
  job: Job;
  coinAmount: number;
  depositAddress: string;
  closeModal: () => void;
  coin: SUPPORTED_COINS;
  contractAddress?: string;
}

const MakePaymentModal = ({ closeModal, depositAddress, jobId, job, coinAmount, coin, contractAddress }: MakePaymentModalProps) => {
  return (
    <div className="flex w-full flex-col gap-6 bg-white p-6 border rounded-2xl max-w-[400px] mx-auto">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold text-title">Make Payment</h2>

        <button
          className="rounded-full border border-[#DFDFE6] p-2 text-black hover:border-danger duration-200 hover:text-danger"
          onClick={closeModal}
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="flex grow flex-col items-center justify-center">
        <Tabs.Root defaultValue="connect-wallet" className="flex flex-col gap-6">
          <Tabs.List className="grid grid-cols-2 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B]">
            <Tabs.Trigger
              className="radix-state-active:bg-white rounded-lg p-2 px-2 duration-200 hover:bg-white"
              value="connect-wallet"
            >
              Connect Wallet
            </Tabs.Trigger>
            <Tabs.Trigger
              className="radix-state-active:bg-white rounded-lg p-2 px-2 duration-200 hover:bg-white"
              value="deposit-to-address"
            >
              Deposit To Address
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="connect-wallet">
            <PayWithWallet
              jobId={jobId}
              closeModel={closeModal}
              amount={coinAmount}
              depositAddress={depositAddress}
              coin={coin}
              contractAddress={contractAddress}
              job={job}
            />
          </Tabs.Content>
          <Tabs.Content value="deposit-to-address">
            <DepositToAddress
              jobId={jobId}
              job={job}
              coin={coin}
              closeModel={closeModal}
              amount={coinAmount}
              depositAddress={depositAddress}
            />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

interface DepositToAddressProps {
  jobId: string;
  job: Job;
  amount: number;
  coin: SUPPORTED_COINS;
  depositAddress: string;
  closeModel: () => void;
}

const DepositToAddress = ({ amount, depositAddress, jobId, job, closeModel, coin }: DepositToAddressProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, copy] = useCopyToClipboard();
  const confirmPayment = useConfirmJobPayment();
  const talentId = searchParams.get('talent-id') ?? '';
  const inviteTalent = useInviteTalentToJob({ talentId: talentId, job });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-[#87898E]">
        Copy the wallet address or scan QR code to make payment. Click I have made transfer to continue.
      </p>

      <div className="border-primary text-primary flex justify-between gap-2 rounded-2xl border bg-[#ECFCE5] px-4 py-6">
        <span className="text-lg">Total Amount:</span>
        <span className="text-lg font-bold">
          {amount} {coin}
        </span>
      </div>

      <div className="border-line flex w-full items-center justify-between gap-2 rounded-2xl border bg-[#fcfcfc] px-4 py-4">
        <span className="max-w-[250px] break-words text-sm">{depositAddress}</span>

        <button
          className="text-primary border-primary flex shrink-0 items-center gap-1 rounded-lg border !border-opacity-80 bg-[#ECFCE5] px-3 py-2 text-xs !text-opacity-80"
          onClick={() => copy(depositAddress)}
        >
          <Copy size={14} strokeWidth={2} />
          <span>
            {value ? <span className="animate-pulse">Copied</span> : <span className="animate-pulse">Copy</span>}
          </span>
        </button>
      </div>

      <div className="border-line flex items-center justify-center gap-2 rounded-2xl border bg-[#fcfcfc] px-4 py-4">
        <QRCode value={depositAddress} size={150} />
      </div>

      <Button
        onClick={() => {
          confirmPayment.mutate(
            { jobId },
            {
              onSuccess: async () => {
                if (talentId) {
                  await inviteTalent.mutate(
                    {
                      jobId,
                      talentId,
                    },
                    {
                      onSuccess: () => {
                        router.push(`/overview`);
                      },
                    },
                  );
                }
                closeModel();
                return router.push(`/overview`);
              },
              onError: () => { },
            },
          );
        }}
        fullWidth
      >
        {confirmPayment.isLoading || inviteTalent.isLoading ? <Spinner /> : 'I have made transfer'}
      </Button>
    </div>
  );
};

interface PayWithWalletProps {
  jobId: string;
  job: Job;
  amount: number;
  coin: SUPPORTED_COINS;
  depositAddress: string;
  contractAddress?: string;
  closeModel: () => void;
}

const PayWithWallet = ({ amount, depositAddress, jobId, closeModel, coin, job, contractAddress }: PayWithWalletProps) => {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const isWrongChain = chain?.unsupported;

  const { switchNetwork } = useSwitchNetwork({
    chainId: CHAIN_ID,
  });

  // switch network if wrong chain
  React.useEffect(() => {
    if (isWrongChain && switchNetwork) {
      switchNetwork();
    }
  }, [isConnected, isWrongChain, switchNetwork]);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-sm text-[#87898E]">
        By connecting a wallet, you agree to
        <span className="text-[#3772FF]"> Terms of Service </span>
        and acknowledge that you have read and understand the <span className="text-[#3772FF]">disclaimer.</span>
      </p>

      <WalletConnectorList />

      {coin === 'AVAX' && (
        <DepositAvax jobId={jobId} amount={amount} depositAddress={depositAddress} closeModel={closeModel} job={job} />
      )}
      {coin === 'USDC' && (
        <DepositUSDC jobId={jobId} amount={amount} depositAddress={depositAddress} closeModel={closeModel} job={job} contractAddress={contractAddress} />
      )}
    </div>
  );
};

const WalletConnectorList: React.FC = () => {
  const { isConnected, connector: activeConnector } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  return (
    <div className="flex flex-col gap-6">
      {connectors.map((connector: Connector) => {
        const isActive = isConnected && activeConnector?.id === connector.id;
        const logo = WALLET_LOGO[connector.name];

        return (
          <button
            key={connector.name}
            type="button"
            disabled={!connector.ready}
            onClick={() => connect({ connector: connector })}
            className={`hover:border-primary flex items-center justify-between rounded-2xl border border-[#DFDFE6] p-1 px-4 py-3 text-left duration-300 hover:!border-opacity-30 ${isActive ? 'border-primary !border-opacity-60 bg-green-50' : 'border-[#DFDFE6]'
              }`}
          >
            <span className="flex w-full items-center gap-2">
              <span>{connector.name}</span>
              {isLoading && pendingConnector?.id === connector.id && (
                <span className="animate-spin">{<Loader2 size={16} />}</span>
              )}
            </span>

            <span>{logo && <Image src={logo} width={20} height={20} alt="" />}</span>
          </button>
        );
      })}
    </div>
  );
};

interface WalletDepositProps {
  jobId: string;
  amount: number;
  depositAddress: string;
  job: Job;
  closeModel: () => void;
  contractAddress?: string;
}

const DepositAvax: React.FC<WalletDepositProps> = ({ depositAddress, amount, jobId, job }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmPayment = useConfirmJobPayment();
  const talentId = searchParams.get('talent-id') ?? '';
  const inviteTalent = useInviteTalentToJob({ talentId, job });

  const { config } = usePrepareSendTransaction({
    chainId: CHAIN_ID,
    to: depositAddress,
    value: parseEther(amount.toString()),
  });

  const { sendTransaction, isLoading } = useSendTransaction({
    ...config,
    onSuccess() {
      confirmPayment.mutate(
        { jobId },
        {
          onSuccess: () => {
            if (talentId) {
              inviteTalent.mutate(
                {
                  jobId,
                  talentId,
                },
                {
                  onSuccess: () => {
                    router.push(`/overview`);
                  },
                },
              );
            }
          },
        },
      );
    },
    onError(error) {
      console.error('send transaction error:', error);
    },
  });

  return (
    <div>
      <Button
        disabled={!sendTransaction || isLoading || confirmPayment.isLoading}
        onClick={() => sendTransaction?.()}
        fullWidth
      >
        <div className="flex items-center justify-center gap-2">
          <span> Make Payment</span> <span>{(isLoading || confirmPayment.isLoading) && <Spinner />}</span>
        </div>
      </Button>
    </div>
  );
};

const DepositUSDC: React.FC<WalletDepositProps> = ({ amount, depositAddress, jobId, job, contractAddress }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const talentId = searchParams.get('talent-id') ?? '';
  const confirmPayment = useConfirmJobPayment();
  const inviteTalent = useInviteTalentToJob({ talentId, job });
  const [showReconfirmButton, setShowReconfirmButton] = React.useState(false);
  const amountToPay = parseUnits(amount.toString(), 6);
  const { config } = usePrepareContractWrite({
    abi: erc20ABI,
    chainId: CHAIN_ID,
    functionName: 'transfer',
    address: `0x${contractAddress?.substring(2)}`,
    args: [`0x${depositAddress.substring(2)}`, amountToPay],
  });

  const { write, isError, isLoading } = useContractWrite({
    ...config,
    onSuccess() {
      confirmPayment.mutate(
        { jobId, delay: 6000 },
        {
          onSuccess: () => {
            if (talentId) {
              inviteTalent.mutate(
                {
                  jobId,
                  talentId,
                },
                {
                  onSuccess: () => {
                    router.push(`/overview`);
                  },
                },
              );
            }
          },
          onError: () => {
            setShowReconfirmButton(true);
          },
        },
      );
    },
    onError(error) {
      console.error('write error:', error);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex flex-col gap-2 text-red-500 items-center text-sm">
          <span>An error occurred while making payment.</span>
        </div>
      )}

      {showReconfirmButton && (
        <Button
          fullWidth
          disabled={confirmPayment.isLoading}
          onClick={() => {
            confirmPayment.mutate(
              { jobId, delay: 6000 },
              {
                onSuccess: () => {
                  if (talentId) {
                    inviteTalent.mutate(
                      {
                        jobId,
                        talentId,
                      },
                      {
                        onSuccess: () => {
                          router.push(`/overview`);
                        },
                      },
                    );
                  }
                },
                onError: () => {
                  setShowReconfirmButton(true);
                },
              },
            );
          }}
        >
          {confirmPayment.isLoading ? <Spinner /> : 'Confirm Payment'}
        </Button>
      )}

      <Button fullWidth disabled={!write || isLoading || confirmPayment.isLoading} onClick={() => write?.()}>
        <div className="flex items-center justify-center gap-2">
          <span> {confirmPayment.isLoading ? 'Confirming Payment' : 'Make Payment'}</span>{' '}
          <span>{(isLoading || confirmPayment.isLoading) && <Spinner />}</span>
        </div>
      </Button>
    </div>
  );
};
