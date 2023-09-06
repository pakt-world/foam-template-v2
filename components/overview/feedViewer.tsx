import React, { useMemo, useState } from 'react';
import { Button } from 'pakt-ui';
import { X, Bookmark, Briefcase, Clock4, Gavel } from 'lucide-react';
import { UserAvatar } from '../common/user-avatar';
import Lottie from 'lottie-react';

import win from '@/lottiefiles/win.json';
import alert from '@/lottiefiles/alert.json';
import gavel from '@/lottiefiles/gavel.json';
import failed from '@/lottiefiles/failed.json';
import warning from '@/lottiefiles/warning.json';
import { useSaveToBookmark } from '@/lib/api/bookmark';

const RenderBookMark = ({ size = 20, isBookmarked, id }: { id: string, isBookmarked?: boolean, size: number }) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const addBookmark = useSaveToBookmark()
  const removeBookmark = useSaveToBookmark()
  // const CallFuc = () => isBookmarked ? removeBookmark : addBookmark;
  const CallFuc = () => {
    return bookmarked ? removeBookmark.mutate({ reference: id, type: "feed" }, {
      onSuccess: (_data) => {
        setBookmarked(!bookmarked)
      }
    }) : addBookmark.mutate({ reference: id, type: "feed" }, {
      onSuccess: (_data) => {
        setBookmarked(!bookmarked)
      }
    });
  };
  return <Bookmark fill={isBookmarked ? "#404446" : "#FFFFFF"} className='cursor-pointer' size={size} onClick={() => CallFuc()} />
}
interface JobInvitePendingProps {
  _id: string;
  id: string;
  title: string;
  amount: string;
  inviter: {
    name: string;
    avatar?: string;
    score: number;
  };
  invitationExpiry?: string;
  bookmarked?: boolean;
  type: 'job-invite-pending';
}

interface JobFilledProps {
  _id: string;
  title: string;
  inviter: {
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  type: 'job-invite-filled';
}

type JobFeedCardProps = JobInvitePendingProps | JobFilledProps;

export const JobFeedCard: React.FC<JobFeedCardProps> = (props) => {
  const { type } = props;

  if (type === 'job-invite-filled') {
    const { _id, title, inviter, bookmarked } = props;

    return (
      <JobFeedWrapper>
        <UserAvatar score={97} />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-title text-xl font-bold">Job Filled</h3>

            <X size={20} />
          </div>

          <p className="text-body">
            The <span className="text-title text-bold">&quot;{title}&quot;</span> Job you applied to has been filled.
            You can check out more public jobs that fit your profile
          </p>

          <div className="justify-between items-center flex mt-auto">
            <Button size="xs" variant="secondary">
              See More Jobs
            </Button>
            <RenderBookMark size={20} isBookmarked={bookmarked} id={_id} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }

  if (type === 'job-invite-pending') {
    const { _id, title, amount, inviter, bookmarked, invitationExpiry, id } = props;

    return (
      <JobFeedWrapper>
        <UserAvatar score={75} />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center">
            <span className="text-body text-xl font-bold">
              {inviter.name} Invited you to a{' '}
              <span className="px-2 text-lg text-title inline-flex rounded-full bg-[#B2E9AA66]">${amount}</span> job
            </span>

            <div className="flex items-center gap-2">
              {invitationExpiry && <div className="flex gap-1 text-body items-center text-sm">
                <Clock4 size={20} />
                <span>Time left: 1:48:00</span>
              </div>}
              <X size={20} />
            </div>
          </div>

          <span className="text-title text-2xl font-normal">{title}</span>

          <div className="justify-between items-center flex mt-auto">
            <div className="flex items-center gap-2">
              <Button size="xs" variant="secondary">
                See Details
              </Button>
              <Button size="xs" variant="outline">
                Accept
              </Button>
            </div>
            {/* <Bookmark size={20} /> */}
            <RenderBookMark size={20} isBookmarked={bookmarked} id={_id} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }
};

export const JobFeedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="border-blue-lighter gap-4 p-4 flex border bg-[#F1FBFF] z-10 w-full rounded-2xl relative overflow-hidden">
      {children}

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#C9F0FF" />
      </div>
    </div>
  );
};

export const PublicJobCreatedFeed = ({ creator, title, amount, jobId, _id, bookmarked }: { creator: string, title: string, amount: string, jobId: string, _id: string, bookmarked: boolean }) => {
  return (
    <JobFeedWrapper>
      <UserAvatar score={54} size='md' />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">
            {creator} created a{" "}
            <span className="px-2 text-lg text-title inline-flex rounded-full bg-green-300">${amount}</span> public job
          </h3>
        </div>
        <h3 className="text-title text-2xl font-normal">{title}</h3>
        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Apply
            </Button>
            <Button size="xs" variant="outline">
              See Details
            </Button>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} id={_id} />
        </div>
      </div>
    </JobFeedWrapper>
  );
};

export const TalentJobUpdateFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Landing Page Design for a Lead Generation...</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          The goal of this project is to create visually appealing and engaging materials that communicate
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Update
            </Button>
            <Button size="xs" variant="outline">
              Message
            </Button>
            <DeliverableProgressBar />
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

export const JobDeliverableCompletionFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Joon completed a deliverable</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          ✅ Initial design concepts for the email newsletter to provide a clear understanding of how the final design
          will look like.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              See Update
            </Button>
            <Button size="xs" variant="outline">
              Message
            </Button>
            <DeliverableProgressBar />
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

export const JobCompletionFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">Joon completed a job</h3>

          <X size={20} />
        </div>

        <p className="text-title text-3xl">Landing Page Design for Snowforte</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Update
            </Button>
            <Button size="xs" variant="outline">
              Message
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

export const JobReviewedFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Theresa has reviewed your work</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit
          dolore cillum minim tempor enim...
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Write Review
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};


export const DeliverableProgressBar = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="bg-primary-gradient rounded-full h-2 w-[60px]"></div>
      <div className="bg-primary-gradient rounded-full h-2 w-[60px]"></div>
      <div className="bg-primary-gradient rounded-full h-2 w-[60px]"></div>
      <div className="bg-line rounded-full h-2 w-[60px]"></div>
      <div className="bg-line rounded-full h-2 w-[60px]"></div>
    </div>
  );
};

export const PaymentReleased = () => {
  return (
    <div className="border-[#7DDE86] bg-[#FBFFFA] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-body text-xl font-bold">Payment Released</h3>

          <X size={20} />
        </div>

        <p className="text-title text-3xl">$4000 has been added to Your Wallet! 💰</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Vie Wallet
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#ECFCE5" />
      </div>
    </div>
  );
};

export const JobCancelled = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Theresa Cancelled the Job</h3>

          <X size={20} />
        </div>

        <p className="text-body text-3xl">Landing Page Design for Snowforte</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Details
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

export const ReferralSignupFeed = ({ name }: { name: string }) => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{name} just signed up</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="outline">
              Message
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

export const ReferralJobCompletion = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Shola completed a job</h3>

          <X size={20} />
        </div>

        <p className="text-body text-3xl">Dashboard Design for Lala land</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="outline">
              See Review
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

export const IssueResolutionRaiseFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={alert} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Jane Cooper Has Raised An Issue</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          Your job “Design of landing page” has been submitted for Issue Resolution arbitration. You have 48 hours to
          submit materials to defend your case to the 5-person jury.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Details
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

export const JuryInvitationFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={gavel} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You’ve Been Invited To Serve On A Jury</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          You have two days to accept this invitation. Participating will increase your Afroscore by 1 Point. Declining
          will cost 1 Point.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Details
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

export const IssueResolutionRejectFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={warning} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You Lost Your Issue Resolution</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          After thorough review of the provided evidence for the [job] issue, the jury decided that you were in the
          wrong.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Verdict
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

export const SecondIssueResolutionRejectFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={failed} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You lost your second Issue Resolution</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          After thorough review of the provided evidence, the jury decided that you were in the wrong of this case.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Verdict
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

export const IssueResolutionResolveFeed = () => {
  return (
    <div className="border-[#7DDE86] bg-[#FBFFFA] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={win} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You Won Your Issue Resolution</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          After thorough review of the provided evidence for the [job] issue, the jury decided that you were correct.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Verdict
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#ECFCE5" />
      </div>
    </div>
  );
};