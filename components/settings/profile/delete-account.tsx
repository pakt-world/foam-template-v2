"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import { Button, Checkbox } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

const DeleteAccount = (): ReactElement => {
	const [showDelete, setShowDelete] = useState(false);
	const [acceptedDelete, setAcceptedDelete] = useState(false);
	return (
		<div className="mb-8 rounded-lg bg-white p-4">
			<div
				className="flex h-[50px] cursor-pointer flex-row items-center justify-between"
				onClick={() => {
					setShowDelete(!showDelete);
				}}
				role="button"
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setShowDelete(!showDelete);
					}
				}}
				tabIndex={0}
			>
				<p className="text-lg font-bold text-title">Delete Account</p>
				{showDelete ? <ChevronUp /> : <ChevronDown />}
			</div>
			{showDelete && (
				<div className="my-4 flex flex-col gap-4">
					<div className="flex flex-row gap-4 rounded-lg bg-yellow p-4">
						<InfoIcon size={40} />
						<div>
							<p className="text-base font-bold text-title">
								You’re Deleting Your Account
							</p>
							<p className="text-sm font-thin leading-5 text-title">
								Deleting your account will permanently remove
								all data associated with it, including projects,
								APIs, and analytics. This action cannot be
								undone. Please make sure you have downloaded any
								necessary data or backups before proceeding with
								account deletion.
							</p>
						</div>
					</div>
					<div className="flex flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Checkbox
								title="I confirm my account deletion"
								checked={acceptedDelete}
								onCheckedChange={() => {
									setAcceptedDelete(!acceptedDelete);
								}}
							/>
							I confirm my account deletion
						</div>
						<Button
							variant="danger"
							size="md"
							disabled={!acceptedDelete}
						>
							Delete
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DeleteAccount;
