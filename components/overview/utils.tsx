import React from 'react';

import { FEED_TYPES } from '@/lib/utils';

import {
  JobFeedCard,
  PublicJobCreatedFeed,
  ReferralSignupFeed,
  ReferralJobCompletion,
  PaymentReleased,
  JobCompletionFeed,
  JobReviewedFeed,
  JobCancelled,
  // IssueResolutionRaiseFeed,
  // IssueResolutionResolveFeed,
  // IssueResolutionRejectFeed,
  // SecondIssueResolutionRejectFeed,
  // JuryInvitationFeed,
  JobApplicationCard,
  JobUpdateFeed,
  ReviewChangeCard,
  ReviewResponseChangeCard,
} from './feedViewer';
import { DataFeedResponse } from '@/lib/types';

export const ParseFeedView = (
  feed: DataFeedResponse,
  loggedInUser: string,
  key: number,
  callback?: () => void,
  dismissFeed?: (id: string) => void,
) => {
  const amount = String(feed?.data?.paymentFee);
  const isBookmarked = feed.isBookmarked || false;
  const bookmarkId = feed.bookmarkId || feed._id;

  const feedCreator = {
    _id: feed?.creator?._id || '',
    avatar: feed?.creator?.profileImage?.url || '',
    name: `${feed?.creator?.firstName || ''} ${feed?.creator?.lastName || ''}`,
    score: feed?.creator?.score || 0,
  };

  const inviter = {
    _id: feed?.data?.creator?._id || '',
    avatar: feed?.data?.creator?.profileImage?.url || '',
    name: `${feed?.data?.creator?.firstName || ''} ${feed?.data?.creator?.lastName || ''}`,
    score: feed?.data?.creator?.score || 0,
  };

  const talent = {
    _id: feed?.data?.owner?._id || '',
    avatar: feed?.data?.owner?.profileImage?.url || '',
    name: `${feed?.data?.owner?.firstName || ''} ${feed?.data?.owner?.lastName || ''}`,
    score: feed?.data?.owner?.score || 0,
  };
  console.log(feed?.data)
  const deliverableTotal = (feed?.data?.collections || []).filter((f) => f.type == 'deliverable').length;
  const currentProgress = feed?.meta?.value;
  const deliverableCountPercentage = {
    total: deliverableTotal,
    progress: Math.floor(currentProgress),
  };

  switch (feed.type) {
    case FEED_TYPES.COLLECTION_CREATED:
    case FEED_TYPES.PUBLIC_JOB_CREATED:
      return (
        <PublicJobCreatedFeed
          key={key}
          creator={inviter}
          amount={amount}
          jobId={feed?.data?._id}
          title={feed?.title}
          _id={feed?._id}
          bookmark={{ active: isBookmarked, id: bookmarkId }}
          callback={callback}
          close={dismissFeed}
        />
      );
    case FEED_TYPES.COLLECTION_INVITE:
    case FEED_TYPES.JOB_INVITATION_RECEIVED:
      return (
        <JobFeedCard
          key={key}
          id={feed._id}
          title={feed?.title}
          type="job-invite-pending"
          amount={amount}
          inviteId={feed?.data?.invite?._id || ''}
          inviter={inviter}
          jobId={feed?.data?._id}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          close={dismissFeed}
        />
      );
    case FEED_TYPES.JOB_INVITATION_ACCEPTED:
    case FEED_TYPES.JOB_INVITATION_DECLINED:
    case FEED_TYPES.COLLECTION_INVITE_ACCEPTED:
    case FEED_TYPES.COLLECTION_INVITE_REJECTED:
    case FEED_TYPES.COLLECTION_INVITE_CANCELLED:
      return (
        <JobFeedCard
          key={key}
          id={feed._id}
          title={feed?.data?.name}
          type="job-invite-response"
          accepted={feed?.type === (FEED_TYPES.JOB_INVITATION_ACCEPTED || FEED_TYPES.COLLECTION_INVITE_ACCEPTED)}
          cancelled={feed?.type === FEED_TYPES.COLLECTION_INVITE_CANCELLED}
          bookmarked={isBookmarked}
          jobId={feed?.data?._id}
          bookmarkId={bookmarkId}
          talent={feedCreator}
          close={dismissFeed}
        />
      );
    case FEED_TYPES.JOB_APPLICATION_SUBMITTED:
      return (
        <JobApplicationCard
          key={key}
          id={feed?._id}
          title={feed?.data?.parent?.name || ''}
          applicant={{
            _id: feed?.data?.creator?._id || '',
            name: `${feed?.data?.creator.firstName} ${feed?.data?.creator?.lastName}`,
            avatar: feed?.data?.creator?.profileImage?.url || '',
            score: feed?.data?.creator?.score,
          }}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          jobId={feed?.data?.parent?._id || ''}
          close={dismissFeed}
        />
      );
    case FEED_TYPES.JOB_DELIVERABLE_UPDATE:
    case FEED_TYPES.COLLECTION_UPDATE:
      return (
        <JobUpdateFeed
          key={key}
          talent={talent}
          creator={inviter}
          id={feed?._id}
          title={feed?.title}
          description={feed?.description}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          close={dismissFeed}
          jobId={feed?.data?._id}
          progress={deliverableCountPercentage}
          isCreator={feed?.data?.creator?._id === loggedInUser}
          jobTitle={feed.data.name}
          isMarked={feed?.meta?.isMarked}
        />
      );
    case FEED_TYPES.REFERRAL_SIGNUP:
      return (
        <ReferralSignupFeed
          key={key}
          id={feed?._id}
          name={`${feed?.creator?.firstName || ''} ${feed?.creator?.lastName || ''}`}
          title={feed?.title}
          description={feed?.description}
          avatar={feed?.creator?.profileImage?.url}
          userId={feed?.creator?._id}
          score={feed?.creator?.score}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
        />
      );
    case FEED_TYPES.JOB_REVIEW:
      return (
        <JobReviewedFeed
          key={key}
          id={feed?._id}
          talent={talent}
          creator={inviter}
          jobId={feed?.data?._id}
          isCreator={feed?.data?.creator?._id === loggedInUser}
          title={feed?.data?.name}
          description={feed?.description}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          rating={feed?.meta?.rating}
        />
      );
    case FEED_TYPES.REFERRAL_COLLECTION_COMPLETION:
      return (
        <ReferralJobCompletion
          key={key}
          id={feed?._id}
          talent={talent}
          jobId={feed?.data?._id}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          title={feed?.data?.name}
          rating={feed?.meta?.rating}
        />
      );
    case FEED_TYPES.JOB_PAYMENT_RELEASED:
      return (
        <PaymentReleased
          key={key}
          id={feed?._id}
          talent={talent}
          creator={inviter}
          jobId={feed?.data?._id}
          isCreator={feed?.data?.creator?._id === loggedInUser}
          amount={String(feed?.data?.paymentFee)}
          description={feed?.description}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          title={feed?.title}
        />
      );
    case FEED_TYPES.COLLECTION_COMPLETED:
    case FEED_TYPES.JOB_COMPLETION:
      return (
        <JobCompletionFeed
          key={key}
          id={feed?._id}
          talent={talent}
          creator={inviter}
          jobId={feed?.data?._id}
          isCreator={feed?.data?.creator?._id === loggedInUser}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          title={feed?.data?.name}
        />
      );
    case FEED_TYPES.COLLECTION_CANCELLED:
    case FEED_TYPES.JOB_CANCELLED:
      return (
        <JobCancelled
          key={key}
          id={feed?._id}
          talent={talent}
          creator={inviter}
          jobId={feed?.data?._id}
          isCreator={feed?.data?.creator?._id === loggedInUser}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          title={feed?.title}
        />
      );
    case FEED_TYPES.JOB_CANCELLED_REQUEST:
    case FEED_TYPES.JOB_CANCELLED_ACCEPTED:
      return (
        <ReviewChangeCard
          key={key}
          id={feed?._id}
          talent={talent}
          creator={inviter}
          jobId={feed?.data?._id}
          isCreator={feed?.data?.creator?._id === loggedInUser}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          title={
            feed?.type == FEED_TYPES.JOB_CANCELLED_ACCEPTED
              ? feed?.data?.name
              : `${talent.name} requested to cancel a job`
          }
          description={feed?.description}
          isAccepted={feed?.type == FEED_TYPES.JOB_CANCELLED_ACCEPTED}
          rating={feed?.meta?.value}
        />
      );
    case FEED_TYPES.JOB_REVIEW_CHANGE:
      return (
        <ReviewChangeCard
          key={key}
          id={feed?._id}
          talent={talent}
          creator={inviter}
          jobId={feed?.data?._id}
          isCreator={feed?.data?.creator?._id === loggedInUser}
          close={dismissFeed}
          bookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          title={`${talent.name} submitted a redo request`}
          description={feed?.description}
          isAccepted={false}
        />
      );
    case FEED_TYPES.JOB_REVIEW_CHANGE_ACCEPTED:
    case FEED_TYPES.JOB_REVIEW_CHANGE_DECLINED:
      return <ReviewResponseChangeCard
        key={key}
        id={feed?._id}
        talent={talent}
        creator={inviter}
        jobId={feed?.data?._id}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        close={dismissFeed}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        title={feed?.title}
        description={feed?.description}
        isDeclined={feed?.type == FEED_TYPES.JOB_REVIEW_CHANGE_DECLINED}
      />

    // case FEED_TYPES.ISSUE_RAISED:
    //   return <IssueResolutionRaiseFeed />;
    // case FEED_TYPES.ISSUE_RESOLUTION_GUILTY:
    //   return <IssueResolutionRejectFeed />;
    // case FEED_TYPES.ISSUE_RESOLUTION_RESOLVED:
    //   return <IssueResolutionResolveFeed />;
    // case FEED_TYPES.ISSUE_RESOLUTION_GUILTY_SECOND:
    //   return <SecondIssueResolutionRejectFeed />;
    // case FEED_TYPES.JURY_INVITATION:
    //   return <JuryInvitationFeed />;
    default:
      return;
    // return (
    //   <JobFeedCard
    //     key={key}
    //     title="Not known yet"
    //     type="job-invite-filled"
    //     inviter={inviter}
    //     id={feed?._id}
    //     // amount={amount}
    //     // inviteId={feed?.data?.invite}
    //     // jobId={feed?.data?._id}
    //     bookmarked={isBookmarked}
    //     bookmarkId={bookmarkId}
    //     close={dismissFeed}
    //   />
    // );
  }
};
