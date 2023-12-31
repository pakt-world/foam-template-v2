'use client';

import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/common/tabs';
import { Feeds } from '@/components/overview/feeds';
import { Header } from '@/components/overview/header';
import { LeaderBoard } from '@/components/overview/leaderboard';
import { Invites } from '@/components/overview/invites';
import { ActiveJobs } from '@/components/overview/activeJobs';
import { FeedsBookmark } from '@/components/overview/bookmark';
import { Search, Plus, Briefcase } from 'lucide-react';
import { useUserState } from '@/lib/store/account';

export default function Overview() {
  return (
    <div className="h-screen gap-6 flex flex-col overflow-hidden">
      <div className="flex gap-6 h-full justify-start w-full">
        <div className="w-full flex flex-col grow h-full gap-7">
          <Header />
          <JobHeader />
          <div className="overflow-y-auto basis-0 flex flex-1">
            <Tabs
              tabs={[
                { label: 'Your Feed', value: 'feed', content: <Feeds /> },
                { label: 'Active Jobs', value: 'active', content: <ActiveJobs /> },
                { label: 'Invites', value: 'invites', content: <Invites /> },
                { label: 'Bookmarks', value: 'bookmarks', content: <FeedsBookmark /> },
              ]}
            />
          </div>
        </div>

        <div className="basis-[270px] shrink-0 flex flex-col min-h-full xw-fit items-center overflow-y-auto w-full">
          <div className="overflow-y-auto basis-0 flex flex-col gap-2 flex-1 w-full scrollbar-hide">
            <LeaderBoard />
          </div>
        </div>
      </div>
    </div>
  );
}

const JobHeader = () => {
  const router = useRouter();
  const user = useUserState();
  const value = user.profileCompleteness ?? 0;
  const profileCompleted = value > 70;
  if (!profileCompleted) {
    return (
      <div className={`flex w-full h-[154px] gap-2 rounded-2xl border p-2 bg-white`}>
        <div className={`flex flex-[8] items-center`}>
          <div className="flex flex-[2] flex-col items-center text-center">
            <h3 className="text-[50px] font-bold leading-[54px]">{value}%</h3>
            <p className="text-base">of your profile is completed</p>
          </div>
          <div className="gap-2 flex flex-[7] flex-col border-l-[1px] border-[#e8e8e8] pl-[24px]">
            {/* <h4 className="text-xl font-bold">Complete your profile to start Applying for Jobs and Projects</h4> */}
            <p className="text-base leading-6 tracking-[0.75px] text-body">
              Welcome to Afrofund! Fill out your profile so you can begin collaborating.
            </p>
            <div className="h-[48px] w-[226px]">
              <Button variant="primary" size="md" onClick={() => router.push('/settings')}>
                <span className="flex items-center gap-2">
                  <span>Complete Profile</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-4 grid-cols-2">
      <div className="border-2 bg-[#ECFCE5] p-4 rounded-2xl border-primary relative overflow-hidden">
        <div className="flex flex-col gap-4 relative z-10">
          <p className="text-xl font-bold max-w-[300px]">Search Afrofund Talent Pool to find skilled workers.</p>
          <Button size="sm" onClick={() => router.push('/jobs/create')}>
            <span className="flex items-center gap-2">
              <Plus size={20} />
              <span>Create Job</span>
            </span>
          </Button>
        </div>

        <div className="absolute right-0 translate-x-1/3 top-2">
          <Briefcase size={200} color="#B4EDB6" />
        </div>
      </div>

      <div className="border-2 p-4 relative overflow-hidden rounded-2xl bg-[#C9F0FF] border-blue-darkest">
        <div className="flex flex-col gap-4 z-10 relative">
          <p className="text-xl font-bold max-w-[320px]">
            Search the Afrofund job board for work that matches your skills.
          </p>
          <Button variant="secondary" size="sm" onClick={() => router.push('/jobs')}>
            <span className="flex items-center gap-2">
              <Search size={20} />
              <span>Find Jobs</span>
            </span>
          </Button>
        </div>

        <div className="absolute right-0 translate-x-[30px] top-4 ">
          <Search size={150} color="#9BDCFD" />
        </div>
      </div>
    </div>
  );
};
