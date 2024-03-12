"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { ArrowUpRight, ArrowDownLeft, Circle } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Table } from "@/components/common/table";

type TransactionTypeProps = "withdrawal" | "deposit";

type TransactionStatusProps =
	| "processing"
	| "pending"
	| "completed"
	| "failed"
	| "reprocessing";

type TransactionStatusColors = {
	[key in TransactionStatusProps]: { bgColor: string; textColor: string };
};

const TRANSACTION_STATUS_COLORS: TransactionStatusColors = {
	failed: { bgColor: "bg-danger", textColor: "text-danger" },
	completed: { bgColor: "bg-success", textColor: "text-success" },
	pending: { bgColor: "bg-yellow-dark", textColor: "text-yellow" },
	processing: { bgColor: "bg-yellow-dark", textColor: "text-yellow" },
	reprocessing: { bgColor: "bg-yellow-dark", textColor: "text-yellow" },
};

const TransactionStatus = ({
	status,
}: {
	status: TransactionStatusProps;
}): React.JSX.Element => (
	<div
		className={`${
			TRANSACTION_STATUS_COLORS[status].bgColor || "bg-gray-300"
		} flex w-fit items-center gap-2 rounded-full bg-opacity-10 px-3 py-0.5 capitalize`}
	>
		<span
			className={`text-sm ${TRANSACTION_STATUS_COLORS[status].textColor || "text-title"}`}
		>
			{status}
		</span>
	</div>
);

const TransactionType = ({
	type,
}: {
	type: TransactionTypeProps;
}): React.JSX.Element => {
	let color: string;
	let Icon: React.ElementType;

	switch (type) {
		case "deposit":
			color = "success";
			Icon = ArrowDownLeft;
			break;
		case "withdrawal":
			color = "danger";
			Icon = ArrowUpRight;
			break;
		default:
			color = "gray-300";
			Icon = Circle;
			break;
	}

	return (
		<div className="flex items-center gap-2">
			<div
				className={`flex rounded-full bg-opacity-20 p-0.5 bg-${color}`}
			>
				<Icon className={`text-${color}`} size={12} />
			</div>
			<span className="text-sm capitalize">{type}</span>
		</div>
	);
};

interface WalletTransactionsProps {
	date: string;
	amount: string;
	description: string;
	coin: string;
	usdValue: string;
	type: TransactionTypeProps;
	status: TransactionStatusProps;
	transactionHash: string;
}

const TABLE_COLUMNS: Array<ColumnDef<WalletTransactionsProps>> = [
	{
		header: "Date",
		accessorFn: (data) => data.date,
	},
	{
		header: "Type",
		accessorFn: (data) => data.type,
		cell: ({ getValue }) => (
			<TransactionType type={getValue<TransactionTypeProps>()} />
		),
	},
	{
		header: "Description",
		accessorFn: (data) => data.description,
	},
	{
		header: "Amount",
		accessorFn: (data) => data.amount,
	},
	{
		header: "Coin",
		accessorFn: (data) => data.coin,
	},
	{
		header: "USD Value",
		accessorFn: (data) => data.usdValue,
	},
	{
		header: "Status",
		accessorFn: (data) => data.status,
		cell: ({ getValue }) => (
			<TransactionStatus status={getValue<TransactionStatusProps>()} />
		),
	},
	{
		header: " ",
		accessorFn: (data) => data.transactionHash,
		cell: ({ getValue }) => {
			const transactionHash = getValue();
			return transactionHash !== "" ? (
				<Link
					href={`${process.env.NEXT_PUBLIC_SNOWTRACE_APP_URL}/tx/${transactionHash as string}`}
					target="_blank"
					className="inline-flex h-[22px] w-[124.35px] items-center justify-center gap-[6.45px] rounded-lg border bg-violet-100 px-2 py-0.5"
				>
					<span className="shrink grow basis-0 text-center text-xs font-medium leading-[18px] tracking-wide text-indigo-600">
						View On-chain
					</span>
					<ArrowUpRight className="relative h-[12.90px] w-[12.90px] text-indigo-600" />
				</Link>
			) : (
				<div />
			);
		},
	},
];

export const WalletTransactions = ({
	data,
	page,
	// limit,
	pageSize,
	loading,
	onPageChange,
}: {
	data: WalletTransactionsProps[];
	page: number;
	// limit: number;
	pageSize: number;
	loading: boolean;
	onPageChange: React.Dispatch<React.SetStateAction<PaginationState>>;
}): React.JSX.Element => {
	return (
		<div className="flex h-[600px] w-full max-w-full flex-col gap-4 rounded-lg border border-line bg-white px-6 py-6">
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
