import React, { useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const {
    data: timelineData,
    refetch: feedRefetch,
    isLoading,
    isFetching,
    isError,
  } = useGetTimeline({ page: currentPage, limit: 10, filter: { isOwner: true, type: `${FEED_TYPES.JOB_DELIVERABLE_UPDATE},${FEED_TYPES.JOB_APPLICATION_SUBMITTED},${FEED_TYPES.JOB_CANCELLED},${FEED_TYPES.JOB_COMPLETION},${FEED_TYPES.JOB_INVITATION_ACCEPTED},${FEED_TYPES.JOB_INVITATION_DECLINED},${FEED_TYPES.JOB_INVITATION_RECEIVED},${FEED_TYPES.PUBLIC_JOB_CREATED},${FEED_TYPES.PUBLIC_JOB_FILLED}`, isPublic: true } });
  const callback = async () => {
    await Promise.all([
      feedRefetch()
    ]);
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
    console.log("next-==<", currentPage + 1);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (currentPage)
      feedRefetch();
  }, [currentPage])

  useEffect(() => {
    // @ts-ignore
    const allIds = currentData.map(c => c._id);
    if (timelineData && timelineData.data) {
      // @ts-ignore
      const newData = currentData.concat(timelineData?.data.filter(c => !allIds.includes(c._id)));
      setCurrentData(newData);
      setTotalPages(timelineData.pages);
      setCurrentPage(timelineData.page);
    }
  }, [timelineData, timelineData?.data]);

  const timelineFeeds = useMemo(() => (currentData || []).map((feed, i) => ParseFeedView(feed, loggedInUser, i, callback, dismissByID)), [currentData]);

  if (isLoading && timelineFeeds.length < 1) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;
  if (isError) return <PageError className="h-[85vh] rounded-2xl border border-line" />;
  if (timelineFeeds.length === 0) return <PageEmpty className="h-[85vh] rounded-2xl border border-line" />;
  return (
    <div className="relative h-full">
      <div id="timeline-content" className="h-full overflow-y-auto scrollbar-hide [&>*]:mb-5 border border-line bg-white rounded-2xl p-4 w-full">
        <InfiniteScroll
          scrollThreshold={0.5}
          scrollableTarget="timeline-content"
          dataLength={timelineData?.total ?? 10}
          next={fetchMore}
          hasMore={true}
          loader={<></>}
          className='mb-0'
        >
          <div className='[&>*]:mb-5'>
            {timelineFeeds}
          </div>
          {isFetching && <div className='flex flex-row justify-center items-center w-full mx-auto text-center'><Loader size={25} className='text-black animate-spin text-center' /></div>}
        </InfiniteScroll>
      </div>
      <div className="absolute left-0 right-0 -bottom-[0px] h-10 z-50 bg-gradient-to-b from-transparent via-transparent to-green-50 rounded-2xl"></div>
    </div>
  );
};
