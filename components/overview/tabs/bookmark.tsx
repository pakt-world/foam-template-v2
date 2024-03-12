"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ParseFeedView } from "../feeds";
import { useUserState } from "@/lib/store/account";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { PageEmpty } from "../../common/page-empty";
import { PageLoading } from "../../common/page-loading";
import { PageError } from "../../common/page-error";

export const FeedsBookmark = (): ReactElement => {
	const { _id: loggedInUser } = useUserState();
	const {
		data: bookmarkData,
		isFetched,
		isFetching,
		refetch,
		isError,
	} = useGetBookmarks({ page: 1, limit: 10, filter: { type: "feed" } });

	const bookmarks = useMemo(
		() =>
			(bookmarkData?.data ?? []).map((feed, i) =>
				ParseFeedView(
					{ ...feed.feed, bookmarkId: feed._id, isBookmarked: true },
					loggedInUser,
					i,
					refetch,
				),
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[bookmarkData?.data],
	);

	if (!isFetched && isFetching)
		return (
			<PageLoading
				className="h-[65vh] rounded-2xl border border-line"
				color="#007C5B"
			/>
		);
	if (isError)
		return (
			<PageError className="h-[65vh] rounded-2xl border border-red-200" />
		);
	if (bookmarks.length === 0)
		return (
			<PageEmpty
				className="h-[65vh] rounded-2xl border border-line"
				label="Bookmarked notifications will appear here"
			/>
		);

	return (
		<div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-white p-4">
			{bookmarks}
		</div>
	);
};
