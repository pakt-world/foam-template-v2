"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDismissFeed, useGetTimeline } from "@/lib/api/dashboard";
import { ParseFeedView } from "./feed-viewer";
import { useUserState } from "@/lib/store/account";
import { PageEmpty } from "../common/page-empty";
import { PageLoading } from "../common/page-loading";
import { PageError } from "../common/page-error";
import { FEED_TYPES } from "@/lib/utils";

export const Feeds = (): ReactElement => {
    const { _id: loggedInUser } = useUserState();
    // @ts-expect-error --- Unused variable
    const [currentPage, setCurrentPage] = useState(1);
    // @ts-expect-error --- Unused variable
    const [prevPage, setPrevPage] = useState(0);
    const [currentData, setCurrentData] = useState([]);
    const [observe, setObserve] = useState(false);
    const {
        data: timelineData,
        refetch: feedRefetch,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetTimeline({
        page: currentPage,
        limit: 10,
        filter: {
            isOwner: true,
            type: `${FEED_TYPES.JOB_DELIVERABLE_UPDATE},${FEED_TYPES.JOB_APPLICATION_SUBMITTED},${FEED_TYPES.JOB_CANCELLED},${FEED_TYPES.JOB_COMPLETION},${FEED_TYPES.JOB_INVITATION_ACCEPTED},${FEED_TYPES.JOB_INVITATION_DECLINED},${FEED_TYPES.JOB_INVITATION_RECEIVED},${FEED_TYPES.PUBLIC_JOB_CREATED},${FEED_TYPES.PUBLIC_JOB_FILLED}`,
            isPublic: true,
        },
    });

    const scrollParentRef = useRef<HTMLDivElement | null>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    const callback = async (): Promise<void> => {
        await Promise.all([feedRefetch()]);
    };
    const dismissFeed = useDismissFeed();

    const dismissByID = (id: string): void => {
        dismissFeed.mutate(id, {
            onSuccess: () => {
                // refetch feeds
                void callback?.();
            },
        });
    };

    const fetchMore = (): void => {
        setObserve(false);
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    };

    useEffect(() => {
        const currentTarget = observerTarget.current;
        if (!currentTarget) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) setObserve(true);
            },
            { threshold: 0.5 },
        );

        observer.observe(currentTarget);

        return () => {
            observer.unobserve(currentTarget);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observerTarget.current]);

    useEffect(() => {
        if (!isLoading && !isFetchingNextPage && prevPage !== currentPage) {
            void feedRefetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    useEffect(() => {
        if (observe) {
            fetchMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observe]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let totalData: any = [];
        // if (timelineData?.pages) {
        if (timelineData && Array.isArray(timelineData.pages)) {
            for (let i = 0; i < timelineData.pages.length; i++) {
                const timeData = timelineData.pages[i];
                if (Array.isArray(timeData)) {
                    totalData = [...totalData, ...timeData];
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newData = totalData.sort((a: any, b: any) => {
            if (a && b) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        });
        setCurrentData(newData);
        // }
    }, [timelineData, timelineData?.pages]);

    const timelineFeeds = useMemo(
        () => (currentData || []).map((feed, i) => ParseFeedView(feed, loggedInUser, i, callback, dismissByID)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentData],
    );
    if (isLoading && timelineFeeds.length < 1)
        return <PageLoading className="h-[65vh] rounded-2xl border border-line" color="#007C5B" />;
    if (isError) return <PageError className="h-[65vh] rounded-2xl border border-line" />;
    if (timelineFeeds.length === 0) return <PageEmpty className="h-[65vh] rounded-2xl border border-line" />;
    return (
        <div className="relative h-[65vh]">
            <div
                id="timeline-content"
                ref={scrollParentRef}
                className="scrollbar-hide h-full w-full overflow-auto rounded-2xl  border border-line bg-white p-4 [&:last]:mb-0 [&>*]:mb-5"
            >
                <div className="[&>*]:mb-5">
                    {timelineFeeds}
                    {isFetchingNextPage && (
                        <div className="mx-auto flex w-full flex-row items-center justify-center text-center">
                            <Loader size={25} className="animate-spin text-center text-black" />
                        </div>
                    )}
                    <span ref={observerTarget} />
                </div>
            </div>
            {/* <div className="absolute left-0 right-0 -bottom-[0px] h-10 z-50 bg-gradient-to-b from-transparent via-transparent to-green-50 rounded-2xl"></div> */}
        </div>
    );
};
