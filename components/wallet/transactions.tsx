import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { Spinner } from '@/components/common';
import { ArrowUpRight, ArrowDownLeft, Circle } from 'lucide-react';
import { Table } from '@/components/common/table';

type TransactionType = 'withdrawal' | 'deposit';
type TransactionStatus = 'processing' | 'pending' | 'completed' | 'failed' | 'reprocessing';
interface WalletTransactions {
  date: string;
  amount: string;
  description: string;
  coin: string;
  usdValue: string;
  type: TransactionType;
  status: TransactionStatus;
}

const TABLE_COLUMNS: ColumnDef<WalletTransactions>[] = [
  {
    header: 'Date',
    accessorFn: (data) => data.date,
  },
  {
    header: 'Type',
    accessorFn: (data) => data.type,
    cell: ({ getValue }) => <TransactionType type={getValue<TransactionType>()} />,
  },
  {
    header: 'Amount',
    accessorFn: (data) => data.amount,
  },
  {
    header: 'Description',
    accessorFn: (data) => data.description,
  },
  {
    header: 'Coin',
    accessorFn: (data) => data.coin,
  },
  {
    header: 'USD Value',
    accessorFn: (data) => data.usdValue,
  },
  {
    header: 'Status',
    accessorFn: (data) => data.status,
    cell: ({ getValue }) => <TransactionStatus status={getValue<TransactionStatus>()} />,
  },
];

export const WalletTransactions = ({
  data,
  page,
  limit,
  pageSize,
  loading,
  onPageChange,
}: {
  data: WalletTransactions[];
  page: number;
  limit: number;
  pageSize: number;
  loading: boolean;
  onPageChange: React.Dispatch<React.SetStateAction<PaginationState>>;
}) => {
  return (
    <div className="border-line flex flex-col gap-4 rounded-lg border bg-white px-6 py-6 w-full max-w-full h-[450px]">
      <h3 className="text-base font-semibold">Wallet Transactions</h3>
      <Table
        data={data}
        columns={TABLE_COLUMNS}
        pageCount={pageSize}
        setPagination={onPageChange}
        pagination={{ pageIndex: page, pageSize }}
        loading={loading}
      />
    </div>
  );
};

type TransactionStatusColors = { [key in TransactionStatus]: { bgColor: string; textColor: string } };

const TRANSACTION_STATUS_COLORS: TransactionStatusColors = {
  failed: { bgColor: 'bg-danger', textColor: 'text-danger' },
  completed: { bgColor: 'bg-success', textColor: 'text-success' },
  pending: { bgColor: 'bg-yellow-dark', textColor: 'text-yellow' },
  processing: { bgColor: 'bg-yellow-dark', textColor: 'text-yellow' },
  reprocessing: { bgColor: 'bg-yellow-dark', textColor: 'text-yellow' },
};

const TransactionStatus = ({ status }: { status: TransactionStatus }) => (
  <div
    className={`${
      TRANSACTION_STATUS_COLORS[status].bgColor || 'bg-gray-300'
    } flex w-fit items-center gap-2 rounded-full bg-opacity-10 px-3 py-0.5 capitalize`}
  >
    <span className={`text-sm ${TRANSACTION_STATUS_COLORS[status].textColor || 'text-title'}`}>{status}</span>
  </div>
);

const TransactionType = ({ type }: { type: TransactionType }) => {
  let color: string;
  let Icon: React.ElementType;

  switch (type) {
    case 'deposit':
      color = 'success';
      Icon = ArrowDownLeft;
      break;
    case 'withdrawal':
      color = 'danger';
      Icon = ArrowUpRight;
      break;
    default:
      color = 'gray-300';
      Icon = Circle;
      break;
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex rounded-full bg-opacity-20 p-0.5 bg-${color}`}>
        <Icon className={`text-${color}`} size={12} />
      </div>
      <span className="capitalize text-sm">{type}</span>
    </div>
  );
};
