'use client';
import React from 'react';
import { format } from 'date-fns';
import type { Job, UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { isJobApplicant, JobApplicant } from '@/lib/types';
import { Calendar, Tag } from 'lucide-react';
import { useGetJobById } from '@/lib/api/job';
import { useGetAccount } from '@/lib/api/account';
import { Button, Select, Checkbox } from 'pakt-ui';
import { paginate } from '@/lib/utils';
import { PageError } from '@/components/common/page-error';
import { PageEmpty } from '@/components/common/page-empty';
import { Pagination } from '@/components/common/pagination';
import { PageLoading } from '@/components/common/page-loading';
import { AfroProfile } from '@/components/common/afro-profile';
interface Props {
  params: {
    'job-id': string;
  };
}

const SORT_BY = [
  {
    label: 'Highest to lowest',
    value: 'highest-to-lowest',
  },
  {
    label: 'Lowest to highest',
    value: 'lowest-to-highest',
  },
];

type SortBy = 'highest-to-lowest' | 'lowest-to-highest';

export default function JobApplications({ params }: Props) {
  const router = useRouter();
  const jobId = params['job-id'];
  const accountData = useGetAccount();
  const jobData = useGetJobById({ jobId });
  const [skillFilters, setSkillFilters] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<'score' | 'bid'>('score');
  const [bidSort, setBidSort] = React.useState<SortBy>('highest-to-lowest');
  const [scoreSort, setScoreSort] = React.useState<SortBy>('highest-to-lowest');
  const [currentPage, setCurrentPage] = React.useState(1);

  if (jobData.isError) return <PageError className="absolute inset-0" />;
  if (jobData.isLoading) return <PageLoading className="absolute inset-0" />;

  const { data: job } = jobData;
  const { data: account } = accountData;

  const isClient = account?._id === job.creator._id;

  if (!isClient) return <PageError className="absolute inset-0" />;

  const applicants = job.collections.filter(isJobApplicant);

  const sortFunction = (a: JobApplicant, b: JobApplicant, key: (obj: JobApplicant) => number, order: SortBy) => {
    if (order === 'highest-to-lowest') {
      return key(b) - key(a);
    }

    if (order === 'lowest-to-highest') {
      return key(a) - key(b);
    }

    return 0;
  };

  const filteredApplicants = applicants
    .filter((applicant) => {
      if (skillFilters.length === 0) return true;
      return applicant.creator.profile.talent.tags
        .map((skill) => skill.toLowerCase())
        .some((skill) => skillFilters.includes(skill.toLowerCase()));
    })
    .sort((a, b) => {
      const bidSortResult = sortFunction(a, b, (value) => value.paymentFee, bidSort);
      const scoreSortResult = sortFunction(a, b, (value) => value.creator.score, scoreSort);

      if (sortBy === 'bid') return bidSortResult;
      if (sortBy === 'score') return scoreSortResult;
      return 0;
    });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

  const paginatedApplicants = paginate(filteredApplicants, itemsPerPage, currentPage);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-primary-gradient rounded-xl justify-between flex p-4 py-6 gap-4">
        <div className="grow max-w-3xl flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-white max-w-[750px]">{job.name}</h2>
          <p className="text-white max-w-[750px]">{job.description}</p>
          <div className="flex gap-4 items-center mt-auto">
            <span className="bg-[#C9F0FF] text-[#0065D0] gap-2 flex items-center px-3 rounded-full py-1">
              <Tag size={20} />
              <span>$ {job.paymentFee}</span>
            </span>

            <span className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-3 rounded-full py-1">
              <Calendar size={20} />
              <span>Due {format(new Date(job.deliveryDate), 'MMM dd, yyyy')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full grow  flex gap-6 overflow-hidden">
        <div className="shrink-0 basis-[300px] grow-0 bg-white rounded-2xl border p-4 border-[#7DDE86] h-fit flex flex-col gap-4">
          <div>
            <label htmlFor="score">Afroscore</label>
            <Select
              placeholder="Highest to lowest"
              options={SORT_BY}
              onChange={(value) => {
                setSortBy('score');
                setScoreSort(value as SortBy);
              }}
            />
          </div>
          <div>
            <label htmlFor="bid">Bid</label>
            <Select
              placeholder="Highest to lowest"
              options={SORT_BY}
              onChange={(value) => {
                setSortBy('bid');
                setBidSort(value as SortBy);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span>Preferred Skills</span>

            <div className="flex flex-col gap-2">
              {job.tagsData
                .map((tag) => tag.toLowerCase())
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (skillFilters.includes(tag)) {
                        setSkillFilters(skillFilters.filter((skill) => skill !== tag));
                      } else {
                        setSkillFilters([...skillFilters, tag]);
                      }
                    }}
                    className="border bg-gray-50 py-3 rounded-lg gap-2 flex items-center px-3 w-full justify-between hover:border-[#7DDE86] duration-300"
                  >
                    <span className="text-body capitalize">{tag}</span>
                    <Checkbox checked={skillFilters.includes(tag)} />
                  </button>
                ))}
            </div>
          </div>
        </div>

        {applicants.length === 0 && (
          <PageEmpty className="h-[60vh] rounded-2xl" label="No applicants yet">
            <div className="mt-4 w-full">
              <Button
                className="w-full"
                fullWidth
                onClick={() => {
                  router.push(`/talents`);
                }}
              >
                Find Talent
              </Button>
            </div>
          </PageEmpty>
        )}

        {paginatedApplicants.length === 0 && applicants.length > 0 && (
          <PageEmpty
            className="h-[60vh] rounded-2xl"
            label="No talent matches the criteria, try changing your filter"
          />
        )}

        {paginatedApplicants.length > 0 && (
          <div className="grow h-full flex flex-col gap-4 overflow-y-auto">
            <div className="overflow-y-auto flex flex-col gap-4 ">
              {paginatedApplicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.creator._id}
                  talent={applicant.creator}
                  bid={applicant.paymentFee}
                  message={applicant.description}
                  inviteReceiverId={job.invite?.receiver._id}
                />
              ))}
            </div>
            <div className="pb-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ApplicantCardProps {
  bid: number;
  message?: string;
  talent: UserProfile;
  inviteReceiverId?: string;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ bid, talent, message, inviteReceiverId }) => {
  const router = useRouter();
  const { firstName, lastName, score, profileImage, profile } = talent;
  const hasBeenInvited = inviteReceiverId === talent._id;

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-line flex flex-col gap-3">
      <div className="w-full flex gap-4">
        {/* {
          <AfroScore score={score} size="md">
            <div className="h-full w-full rounded-full relative">
              {profileImage?.url ? (
                <Image src={profileImage.url} alt="profile" layout="fill" className="rounded-full" />
              ) : (
                <DefaultAvatar />
              )}
            </div>
          </AfroScore>
        } */}
        <AfroProfile score={score} size="md" src={profileImage?.url} />
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {<span className="text-title text-lg font-bold">{`${firstName} ${lastName}`}</span>}

              {hasBeenInvited && (
                <span className="px-3 text-green-900 inline-flex text-sm rounded-full bg-green-50 border border-green-400">
                  Invited
                </span>
              )}
            </div>

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">Bid ${bid}</span>
          </div>
          <div className="grow text-body text-lg">{message}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {profile.talent.tagsIds &&
            profile.talent.tagsIds.length > 0 &&
            profile.talent.tagsIds.slice(0, 3).map((s, index) => (
              <span
                key={index}
                style={{ background: s.color }}
                className={`bg-green-100 grow whitespace-nowrap text-[#090A0A] rounded-full px-4 py-0.5`}
              >
                {s.name}
              </span>
            ))}
        </div>
        <div className="gap-2 flex items-center">
          <Button size="xs" variant="secondary" onClick={() => router.push(`/messages?userId=${talent._id}`)}>
            Message
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push(`/talents/${talent._id}`);
            }}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
