"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect, useState } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useToggleDeliverableCompletion } from "@/lib/api/job";
import { useErrorService } from "@/lib/store/error-service";

interface SquareCheckMarkProps {
	isChecked: boolean;
	onClick: () => void;
}

const CheckButton = ({
	isChecked,
	onClick: setIsChecked,
}: SquareCheckMarkProps): ReactElement => {
	return (
		<button className="scale-[0.8]" onClick={setIsChecked} type="button">
			{isChecked ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						fill="#007C5B"
					/>
					<path
						d="M8 13L10.9167 16L16 8"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						stroke="#4CD571"
						strokeWidth="2"
					/>
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						fill="url(#paint0_linear_988_53583)"
					/>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						stroke="#DADADA"
						strokeWidth="2"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_988_53583"
							x1="12"
							y1="0"
							x2="12"
							y2="24"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#FCFCFC" />
							<stop offset="1" stopColor="#F8F8F8" />
						</linearGradient>
					</defs>
				</svg>
			)}
		</button>
	);
};

export interface Deliverable {
	jobId: string;
	jobCreator: string;
	progress: number; // 0 or 100
	updatedAt: string;
	description: string;
	deliverableId: string;
	// eslint-disable-next-line react/no-unused-prop-types
	meta?: Record<string, unknown> | undefined;
}

interface DeliverableProps extends Deliverable {
	isLast: boolean;
	isClient?: boolean;

	totalDeliverables: number;
	completedDeliverables: number;
}

export const DeliverableStep = ({
	jobId,
	jobCreator,
	isLast,
	isClient,
	updatedAt,
	progress,
	description,
	deliverableId,
	totalDeliverables,
	completedDeliverables,
}: DeliverableProps): ReactElement => {
	const mutation = useToggleDeliverableCompletion({ description });
	const [isComplete, setIsComplete] = useState(progress === 100);
	const { setErrorMessage } = useErrorService();

	useEffect(() => {
		setErrorMessage({
			title: "progress-changed Function",
			message: {
				progress,
				isComplete,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progress]);

	return (
		<div className="relative flex w-full items-start gap-3 py-1">
			<div
				className="absolute left-3 top-0 h-full w-[2px] translate-y-3"
				style={{
					display: isLast ? "none" : "block",
					background: isComplete ? "#4CD471" : "#E8E8E8",
				}}
			/>

			<CheckButton
				isChecked={isComplete}
				onClick={() => {
					if (isClient) return;
					mutation.mutate(
						{
							jobId,
							deliverableId,
							totalDeliverables,
							completedDeliverables,
							isComplete: !isComplete,
							jobCreator,
							meta: {
								completedAt: !isComplete ? dayjs() : "",
							},
						},
						{
							onError: () => {
								mutation.reset();
								setIsComplete((prev) => !prev);
							},
						},
					);
					setIsComplete((prev) => !prev);
				}}
			/>

			<div className=" w-full rounded-lg border border-line bg-[#F7F9FA] p-2 text-body">
				<p
					style={{
						textDecoration: isComplete ? "line-through" : "none",
					}}
				>
					{description}
				</p>

				{isComplete && updatedAt && (
					<span className="text-xs text-green-500">
						Completed:{" "}
						{format(new Date(updatedAt), "dd MMM yyyy h:mm a")}
					</span>
				)}
			</div>
		</div>
	);
};
