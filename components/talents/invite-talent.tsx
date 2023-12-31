'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from 'pakt-ui';
import type { Job } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import { useGetJobs } from '@/lib/api/job';
import { useRouter } from 'next/navigation';
import { SideModal } from '@/components/common/side-modal';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

interface Props {
  isOpen: boolean;
  talentId: string;
  setIsOpen: (isOpen: boolean) => void;
}

export const InviteTalentModal: React.FC<Props> = ({ isOpen, setIsOpen, talentId }) => {
  return (
    <SideModal isOpen={isOpen} onOpenChange={() => setIsOpen(false)}>
      <InviteTalent talentId={talentId} />
    </SideModal>
  );
};

const InviteTalent: React.FC<{ talentId: string }> = ({ talentId }) => {
  const jobsData = useGetJobs({ category: 'created' });

  if (jobsData.isError) return <PageError />;

  if (jobsData.isLoading) return <PageLoading />;

  const jobs = jobsData.data.data;
  const sortedJobs = jobs.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const unassignedJobs = sortedJobs
    .filter((job) => job.status === 'pending' || (job.status === 'ongoing' && job.inviteAccepted === false))
    .filter((job) => !job.invite);

  return <JobList jobs={unassignedJobs} talentId={talentId} />;
};

interface JobListProps {
  jobs: Job[];
  talentId: string;
}

const JobList: React.FC<JobListProps> = ({ jobs, talentId }) => {
  const router = useRouter();
  const [jobId, setJobId] = React.useState<string | null>(null);

  if (jobs.length === 0) return <PageEmpty label="Your Created Jobs Will Appear Here" />;

  return (
    <div className="flex flex-col gap-2 h-full ">
      <div className="bg-primary-gradient p-4 text-white">
        <div className="flex items-center gap-2">
          <ChevronLeft size={24} strokeWidth={2} />
          <h2 className="font-bold text-2xl">Invite Talent</h2>
        </div>
      </div>
      <div className="px-4 py-1">
        <p className="font-bold text-xl">Select job</p>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto grow px-4">
        {jobs.map((job) => {
          return <JobCard job={job} key={job._id} isSelected={jobId === job._id} setJobId={setJobId} />;
        })}
      </div>
      <div className="py-4 px-4">
        <Button
          fullWidth
          variant="primary"
          size="md"
          disabled={!jobId}
          onClick={() => {
            if (!jobId) return;
            router.push(`/jobs/${jobId}/edit/?talent-id=${talentId}`);
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  setJobId: (jobId: string) => void;
}
const JobCard: React.FC<JobCardProps> = ({ job, setJobId, isSelected }) => {
  return (
    <div
      className={cn(
        'border border-gray-200 rounded-xl p-3 flex flex-col gap-2 hover:bg-green-50 duration-200 cursor-pointer',
        {
          'border-green-400 bg-green-50 shadow-md': isSelected,
        },
      )}
      onClick={() => {
        setJobId(job._id);
      }}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-body text-base font-medium">
          Created {format(new Date(job.createdAt), 'dd MMM yyyy')}
        </span>
        <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${job.paymentFee}</span>
      </div>
      <div className="grow text-title text-xl">{job.name}</div>
      <div className="flex items-center gap-2">
        {job.tags.slice(0, 3).map(({ color, name }) => (
          <span
            key={name}
            className="px-4 capitalize rounded-full py-0.5 bg-slate-100"
            style={{ backgroundColor: color }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};
