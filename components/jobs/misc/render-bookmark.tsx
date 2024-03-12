"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Bookmark } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRemoveFromBookmark, useSaveToBookmark } from "@/lib/api/bookmark";
import { CheckMark } from "@/components/common/icons";

interface bookmarkType {
	id: string;
	size: number;
	type: string;
	isBookmarked?: boolean;
	bookmarkId: string;
	callback?: () => void;
	useCheck?: boolean;
}
export const RenderBookMark: FC<bookmarkType> = ({
	size = 20,
	isBookmarked,
	id,
	bookmarkId,
	type = "collection",
	callback,
	useCheck,
}) => {
	const [bookmarked, setBookmarked] = useState(isBookmarked);
	const addBookmark = useSaveToBookmark(callback);
	const removeBookmark = useRemoveFromBookmark(callback);

	const CallFuc = (): void => {
		if (bookmarked) {
			setBookmarked(false);
			removeBookmark.mutate(
				{ id: bookmarkId },
				{
					onSuccess: () => {
						setBookmarked(false);
					},
					onSettled: () => {
						callback?.();
					},
				},
			);
			return;
		}
		setBookmarked(true);
		addBookmark.mutate(
			{ reference: id, type },
			{
				onSuccess: () => {
					setBookmarked(true);
				},
				onSettled: () => {
					callback?.();
				},
			},
		);
	};

	if (useCheck) {
		return (
			<div
				className="flex-end flex min-w-fit"
				onClick={CallFuc}
				role="button"
				tabIndex={0}
				onKeyPress={(event) => {
					if (event.key === "Enter") {
						CallFuc();
					}
				}}
			>
				<CheckMark
					fill={bookmarked ? "#7DDE86" : undefined}
					className="cursor-pointer"
					size={24}
				/>{" "}
				<span className="ml-2">{bookmarked ? "Saved" : "Save"}</span>
			</div>
		);
	}

	return (
		<Bookmark
			fill={bookmarked ? "#404446" : "#FFFFFF"}
			className="cursor-pointer"
			size={size}
			onClick={() => {
				CallFuc();
			}}
		/>
	);
};
