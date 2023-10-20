/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDismissAllFeed, useDismissFeed, useGetTimeline } from '@/lib/api/dashboard';
import { ParseFeedView } from './utils';
import { Spinner } from '../common';
import { useUserState } from '@/lib/store/account';
import { PageEmpty } from '../common/page-empty';
import { PageLoading } from '../common/page-loading';
import { PageError } from '../common/page-error';
import { FEED_TYPES } from '@/lib/utils';
import { Loader } from 'lucide-react';

export const Feeds = () => {
  const { _id: loggedInUser } = useUserState();
  // const [resetTimeLine, setResetTimeLine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
    isFetching,
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
  const scrollParentRef = useRef(null);
  const observerTarget = useRef(null);

  const callback = async () => {
    await Promise.all([feedRefetch()]);
  };
  const dismissFeed = useDismissFeed();

  const dismissByID = (id: string) => {
    dismissFeed.mutate(id, {
      onSuccess: () => {
        // refetch feeds
        callback && callback();
      },
    });
  };

  const fetchMore = () => {
    setObserve(false);
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    console.log(observerTarget)
    if (!observerTarget.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setObserve(true);
      },
      { threshold: 0.5 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget.current]);
  console.log("here===>", observerTarget, observe);

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && prevPage != currentPage) {
      feedRefetch();
    }
  }, [currentPage]);

  useEffect(() => {
    if (observe) {
      fetchMore();
    }
  }, [observe]);

  useEffect(() => {
    // @ts-ignore
    const allIds = currentData.map((c) => c._id);
    if (timelineData && timelineData?.pages) {
      let totalData: any = [];
      for (let i = 0; i < timelineData.pages.length; i++) {
        const timeData = timelineData.pages[i];
        totalData = [...totalData, ...timeData];
      }
      // @ts-ignore
      let newData = totalData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCurrentData(newData);
    }
  }, [timelineData, timelineData?.pages]);

  const timelineFeeds = useMemo(() => (currentData || []).map((feed, i) => ParseFeedView(feed, loggedInUser, i, callback, dismissByID)), [currentData]);

  if (isLoading && timelineFeeds.length < 1) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;
  if (isError) return <PageError className="h-[85vh] rounded-2xl border border-line" />;
  if (timelineFeeds.length === 0) return <PageEmpty className="h-[85vh] rounded-2xl border border-line" />;
  return (
    <div className="relative h-full">
      <div
        id="timeline-content"
        ref={scrollParentRef}
        className="h-full overflow-auto scrollbar-hide [&>*]:mb-5 [&:last]:mb-0  border border-line bg-white rounded-2xl p-4 w-full"
      >
        <div className="[&>*]:mb-5">
          {timelineFeeds}
          {isFetchingNextPage && (
            <div className="flex flex-row justify-center items-center w-full mx-auto text-center">
              <Loader size={25} className="text-black animate-spin text-center" />
            </div>
          )}
          <span ref={observerTarget}></span>
        </div>
      </div>
      {/* <div className="absolute left-0 right-0 -bottom-[0px] h-10 z-50 bg-gradient-to-b from-transparent via-transparent to-green-50 rounded-2xl"></div> */}
    </div>
  );
};
