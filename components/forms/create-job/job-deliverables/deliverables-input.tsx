"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface DeliverablesProps {
	deliverables: string[];
	setDeliverables: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DeliverablesInput: React.FC<DeliverablesProps> = ({
	deliverables,
	setDeliverables,
}) => {
	const MAX_DELIVERABLES = 5;
	const deliverableListRef = React.useRef<HTMLDivElement>(null);

	const addDeliverable = (): void => {
		setDeliverables([...deliverables, ""]);
	};

	const deleteDeliverable = (deliverableIndex: number): void => {
		setDeliverables(
			// @ts-expect-error Unused variable
			deliverables.filter((d, index) => index !== deliverableIndex),
		);
	};

	const editDeliverable = (
		deliverableIndex: number,
		newDeliverable: string,
	): void => {
		const updatedDeliverables = deliverables.map((d, index) =>
			index === deliverableIndex ? newDeliverable : d,
		);
		setDeliverables(updatedDeliverables);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLTextAreaElement>,
	): void => {
		if (e.key === "Enter" && deliverables.length < MAX_DELIVERABLES) {
			addDeliverable();

			if (deliverableListRef.current) {
				const newDeliverableIndex = deliverables.length;
				// wait for the new deliverable to be rendered
				setTimeout(() => {
					const newDeliverableInput =
						deliverableListRef.current?.children[
							newDeliverableIndex
						]?.querySelector("textarea");
					newDeliverableInput?.focus();
				}, 1);
			}
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-2" ref={deliverableListRef}>
				{deliverables.map((deliverable, index) => {
					return (
						<div key={index} className="flex gap-2">
							<div className="relative w-full rounded-lg border border-line pr-16 hover:border-secondary hover:duration-200">
								<textarea
									// rows={2}
									contentEditable
									key={index}
									value={deliverable}
									onKeyDown={handleKeyDown}
									onChange={(e) => {
										editDeliverable(index, e.target.value);
									}}
									maxLength={120}
									className="w-full resize-none rounded-lg px-4 py-2 outline-none focus-within:border-secondary"
								/>
								<div className="absolute bottom-0 right-0 top-0 flex w-[64px] items-center justify-center rounded-lg text-sm text-body">
									{deliverable.length}/120
								</div>
							</div>
							<button
								type="button"
								onClick={() => {
									deleteDeliverable(index);
								}}
								className="flex shrink-0 basis-[50px] items-center justify-center rounded-lg border border-line bg-slate-50 duration-200 hover:bg-gray-100"
								aria-label="Delete Deliverable"
							>
								<Trash2
									size={20}
									strokeWidth={2}
									className="text-danger"
								/>
							</button>
						</div>
					);
				})}
			</div>

			{deliverables.length < MAX_DELIVERABLES && (
				<button
					type="button"
					onClick={addDeliverable}
					disabled={deliverables.length === MAX_DELIVERABLES}
					className="flex items-center justify-center rounded-lg border border-primary border-opacity-30 bg-success bg-opacity-10 px-2 py-2 text-center text-base text-primary duration-200 hover:bg-opacity-20 disabled:opacity-50"
				>
					<div className="flex items-center gap-2">
						<Plus size={18} strokeWidth={2} />
						<span>Add New Deliverable</span>
					</div>
				</button>
			)}
		</div>
	);
};
