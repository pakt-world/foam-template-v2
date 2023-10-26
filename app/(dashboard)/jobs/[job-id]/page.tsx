'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { isJobDeliverable, isJobApplicant } from '@/lib/types';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useApplyToOpenJob } from '@/lib/api/job';
import { useDeclineInvite, useAcceptInvite } from '@/lib/api/invites';
import type { Job } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useDeleteJob, useGetJobById } from '@/lib/api/job';
import { useSearchParams } from 'next/navigation';
import { useGetAccount } from '@/lib/api/account';
import Lottie from 'lottie-react';
import success from '@/lottiefiles/success.json';
import { Modal } from '@/components/common/headless-modal';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { JobHeader, JobDescription, JobSkills, JobDeliverables } from '@/components/jobs/job-details';
import { useCancelJobInvite } from '@/lib/api/job';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DollarIcon } from '@/components/common/icons';
import { NumericInput } from '@/components/common/numeric-input';

const jobApplicationSchema = z.object({
  message: z.string().nonempty('Message is required'),
  amount: z.coerce.number().min(100, { message: 'Amount must be at least $100' }).nonnegative(),
});

type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

interface Props {
  params: {
    'job-id': string;
  };
}

export default function JobDetails({ params }: Props) {
  const jobId = params['job-id'];
  const accountQuery = useGetAccount();
  const jobQuery = useGetJobById({ jobId });
  if (jobQuery.isError || accountQuery.isError) return <PageError className="absolute inset-0" />;
  if (jobQuery.isLoading || accountQuery.isLoading) return <PageLoading className="absolute inset-0" />;

  const { data: job } = jobQuery;
  const { data: account } = accountQuery;
  const USER_ROLE: 'client' | 'talent' = account?._id === job.creator._id ? 'client' : 'talent';

  const VIEWS = {
    client: ClientJobDetails,
    talent: TalentJobDetails,
  };

  const CurrentView = VIEWS[USER_ROLE];

  return (
    <div className="h-full">
      <CurrentView job={job} userId={account._id} />
    </div>
  );
}

// CLIENT JOB DETAILS
interface ClientJobDetailsProps {
  job: Job;
}

const ClientJobDetails: React.FC<ClientJobDetailsProps> = ({ job }) => {
  const cancelInvite = useCancelJobInvite();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const JOB_TYPE: 'private' | 'open' = job.isPrivate ? 'private' : 'open';

  const CTAS = {
    open: ClientOpenJobCtas,
    private: ClientPrivateJobCtas,
  };

  const JobCtas = CTAS[JOB_TYPE];

  return (
    <div className="flex gap-6 h-full">
      <div className="grow overflow-y-auto scrollbar-hide h-full flex flex-col pb-20">
        <JobHeader
          title={job.name}
          price={job.paymentFee}
          dueDate={job.deliveryDate}
          creator={{
            _id: job?.owner?._id || '',
            score: job?.owner?.score || 0,
            avatar: job?.owner?.profileImage?.url,
            name: `${job?.owner?.firstName} ${job?.owner?.lastName.slice(0, 1)}.`,
          }}
        />
        <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
          <JobSkills skills={job.tags || []} />
          <JobDescription description={job.description} />

          <JobDeliverables
            deliverables={job.collections.filter(isJobDeliverable).map((collection) => collection.name)}
          />

          {!job.invite && (
            <JobCtas jobId={job._id} skills={job.tagsData} openDeleteModal={() => setIsDeleteModalOpen(true)} />
          )}

          {job.invite && (
            <div className="p-4 bg-blue-50 justify-between border border-blue-300 text-blue-500 rounded-2xl my-3 flex items-center gap-2 w-full">
              <div className="flex items-center gap-2">
                <Info size={20} />
                <span>Awaiting Talent Response</span>
              </div>

              <button
                className="bg-red-50 border border-red-500 text-red-500 flex items-center justify-center text-sm rounded-lg w-[130px] h-[35px]"
                onClick={() => {
                  cancelInvite.mutate({ inviteId: job.invite?._id ?? '' }, {});
                }}
              >
                {cancelInvite.isLoading ? <Spinner size={16} /> : 'Cancel Invite'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="basis-[270px]  h-full gap-7 w-fit flex flex-col items-center"></div>
      <Modal
        isOpen={isDeleteModalOpen}
        closeModal={() => {
          setIsDeleteModalOpen(false);
        }}
      >
        <DeleteJobModal jobId={job._id} title={job.name} setModalOpen={setIsDeleteModalOpen} />
      </Modal>
    </div>
  );
};

interface ClientPrivateJobCtasProps {
  jobId: string;
  openDeleteModal: () => void;
  skills?: string[];
}

const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({ jobId, skills, openDeleteModal }) => {
  const router = useRouter();

  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[160px] border border-red-400 rounded-xl">
        <Button fullWidth variant="danger" onClick={openDeleteModal} size={'sm'}>
          Delete Job
        </Button>
      </div>

      <div className="w-full flex gap-2 items-center max-w-sm">
        <Button
          fullWidth
          variant="outline"
          onClick={() => {
            router.push(`/jobs/${jobId}/edit`);
          }}
        >
          Edit Job
        </Button>
        <Button
          fullWidth
          onClick={() => {
            router.push(`/talents${skills && skills?.length > 0 ? `?skills=${skills?.join(',')}` : ''}`);
          }}
        >
          Find Talent
        </Button>
      </div>
    </div>
  );
};

interface ClientOpenJobCtasProps {
  jobId: string;
  openDeleteModal: () => void;
}

const ClientOpenJobCtas: React.FC<ClientOpenJobCtasProps> = ({ jobId, openDeleteModal }) => {
  const router = useRouter();

  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[160px] border border-red-400 rounded-xl">
        <Button fullWidth variant="danger" onClick={openDeleteModal}>
          Delete Job
        </Button>
      </div>

      <div className="w-full flex gap-2 items-center max-w-sm">
        <Button
          fullWidth
          variant="outline"
          onClick={() => {
            router.push(`/jobs/${jobId}/edit`);
          }}
        >
          Edit Job
        </Button>
        <Button
          fullWidth
          onClick={() => {
            router.push(`/jobs/${jobId}/applicants`);
          }}
        >
          View Applicants
        </Button>
      </div>
    </div>
  );
};

interface ClientDeleteJobModalProps {
  jobId: string;
  title: string;
  setModalOpen: (state: boolean) => void;
}

const DeleteJobModal: React.FC<ClientDeleteJobModalProps> = ({ jobId, title, setModalOpen }) => {
  const deleteJobMutation = useDeleteJob();
  const router = useRouter();

  return (
    <div className="border w-full max-w-xl flex flex-col gap-4 bg-white p-6 rounded-2xl">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="font-medium text-2xl">Delete Job</h2>
        <span className="text-body text-center">
          This action is irreversible. Once you delete the Job, all of its content and data will be permanently erased.
        </span>
        <span className="text-body font-bold">Are you sure you want to proceed with the deletion?</span>
      </div>
      <div className="mt-auto w-full flex flex-row items-center justify-between gap-2">
        <Button fullWidth variant="secondary" onClick={() => setModalOpen(false)}>
          No, Cancel
        </Button>
        <div className="border rounded-xl border-red-400 w-full">
          <Button
            fullWidth
            variant="danger"
            onClick={() => {
              deleteJobMutation.mutate(
                { id: jobId },

                {
                  onSuccess: () => {
                    router.push('/jobs');
                  },
                },
              );
            }}
            disabled={deleteJobMutation.isLoading}
          >
            {deleteJobMutation.isLoading ? <Spinner /> : 'Yes, Proceed'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface TalentJobDetailsProps {
  job: Job;
  userId: string;
}

// TALENT JOB DETAILS
const TalentJobDetails: React.FC<TalentJobDetailsProps> = ({ job, userId }) => {
  const searchParams = useSearchParams();
  const inviteId = job?.invite?._id || searchParams.get('invite-id');
  const JOB_TYPE: 'private' | 'open' = job.isPrivate ? 'private' : 'open';

  const jobApplicants = job.collections.filter(isJobApplicant);

  const hasAlreadyApplied = jobApplicants.some((applicant) => applicant.creator._id === userId);
  const hasBeenInvited = Boolean(String(job?.invite?.receiver._id) == String(userId));
  const CTAS = {
    open: TalentOpenJobCtas,
    private: TalentPrivateJobCtas,
  };

  const jobIsAssignedToAnotherTalent = job?.owner && job?.owner._id !== userId;

  console.log('owner', job?.owner?._id);

  const JobCtas = CTAS[JOB_TYPE];

  return (
    <div className="flex gap-6 h-full">
      <div className="grow overflow-y-auto scrollbar-hide h-full flex flex-col pb-20">
        <JobHeader
          title={job.name}
          price={job.paymentFee}
          dueDate={job.deliveryDate}
          creator={{
            _id: job?.creator?._id || '',
            score: job?.creator?.score || 0,
            avatar: job?.creator?.profileImage?.url,
            name: `${job?.creator?.firstName} ${job?.creator?.lastName.slice(0, 1)}.`,
          }}
        />

        <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
          <JobSkills skills={job.tags || []} />
          <JobDescription description={job.description} />
          <JobDeliverables
            deliverables={job.collections.filter(isJobDeliverable).map((collection) => collection.name)}
          />

          {hasAlreadyApplied && (
            <div className="p-4 bg-blue-50 border border-blue-300 text-blue-500 rounded-lg my-3 flex items-center gap-2 w-full">
              <Info size={20} />
              <span className="text-body text-center">You have already applied to this job</span>
            </div>
          )}

          {!job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
            <JobCtas
              jobId={job._id}
              inviteId={inviteId}
              hasBeenInvited={hasBeenInvited}
              hasAlreadyApplied={hasAlreadyApplied}
              jobCreator={job.creator._id}
            />
          )}

          {job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
            <div className="p-4 bg-green-50 border border-green-300 text-green-500 rounded-lg my-3 flex items-center gap-2 w-full">
              <Info size={20} />
              <span className="text-green-500 text-center">You have already accepted this Job invite.</span>
            </div>
          )}

          {jobIsAssignedToAnotherTalent && (
            <div className="p-4 bg-red-50 border border-red-300 text-red-500 rounded-lg my-3 flex items-center gap-2 w-full">
              <Info size={20} />
              <span className="text-red-500 text-center">
                This job is already assigned to another talent. You can apply to other jobs.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="basis-[270px] h-full gap-7 w-fit flex flex-col items-center"></div>
    </div>
  );
};

interface TalentPrivateJobCtasProps {
  inviteId: string | null;
  hasBeenInvited: boolean;
  jobId: string;
  jobCreator: string;
}

const TalentPrivateJobCtas: React.FC<TalentPrivateJobCtasProps> = ({ inviteId, hasBeenInvited, jobId, jobCreator }) => {
  const router = useRouter();
  const acceptInvite = useAcceptInvite({ jobCreator, jobId });
  const declineInvite = useDeclineInvite({ jobCreator, jobId });

  if (!inviteId || !hasBeenInvited) return null;

  return (
    <div className="mt-auto w-full flex items-center justify-end">
      <div className="w-full flex items-center max-w-sm gap-4">
        <Button
          fullWidth
          size="sm"
          variant="secondary"
          onClick={() => {
            declineInvite.mutate(
              { id: inviteId },
              {
                onSuccess: () => {
                  router.push('/overview');
                },
              },
            );
          }}
        >
          {declineInvite.isLoading ? <Spinner /> : 'Decline'}
        </Button>

        <Button
          fullWidth
          size="sm"
          onClick={() => {
            acceptInvite.mutate(
              { id: inviteId },
              {
                onSuccess: () => {
                  router.push('/jobs?jobs-type=accepted');
                },
              },
            );
          }}
        >
          {acceptInvite.isLoading ? <Spinner /> : 'Accept Invite'}
        </Button>
      </div>
    </div>
  );
};

interface TalentOpenJobCtasProps {
  jobId: string;
  jobCreator: string;
  inviteId: string | null;
  hasAlreadyApplied: boolean;
  hasBeenInvited: boolean;
}

const TalentOpenJobCtas: React.FC<TalentOpenJobCtasProps> = ({
  jobId,
  jobCreator,
  hasBeenInvited,
  inviteId,
  hasAlreadyApplied,
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  if (hasBeenInvited)
    return (
      <TalentPrivateJobCtas inviteId={inviteId} hasBeenInvited={hasBeenInvited} jobId={jobId} jobCreator={jobCreator} />
    );

  return (
    <React.Fragment>
      <div className="max-w-[200px] w-full ml-auto">
        {!hasAlreadyApplied && (
          <Button fullWidth onClick={() => setIsApplyModalOpen(true)}>
            Apply
          </Button>
        )}

        <Modal
          isOpen={isApplyModalOpen}
          closeModal={() => {
            setIsApplyModalOpen(false);
          }}
        >
          <TalentJobApplyModal jobId={jobId} jobCreator={jobCreator} />
        </Modal>
      </div>
    </React.Fragment>
  );
};

interface TalentJobApplyModalProps {
  jobId: string;
  jobCreator: string;
}

const TalentJobApplyModal: React.FC<TalentJobApplyModalProps> = ({ jobId, jobCreator }) => {
  const jobQuery = useGetJobById({ jobId });
  const applyToOpenJob = useApplyToOpenJob({ jobCreator, jobId });
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const form = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<JobApplicationFormValues> = ({ amount, message = '' }) => {
    applyToOpenJob.mutate(
      {
        jobId,
        amount,
        message,
      },
      {
        onSuccess: () => {
          setShowSuccessMessage(true);
          jobQuery.refetch();
        },
      },
    );
  };

  if (showSuccessMessage) {
    return (
      <div className="border w-full max-w-xl flex flex-col gap-4 bg-white p-6 rounded-2xl">
        <div className="flex flex-col gap-1 items-center">
          <div className="max-w-[200px] -mt-[4]">
            <Lottie animationData={success} loop={false} />
          </div>

          <h2 className="font-medium text-2xl">Application Sent</h2>
          <span className="text-body">You will get a notification if the client sends you a message</span>
        </div>
      </div>
    );
  }
  return (
    <div className="border w-full max-w-xl flex flex-col gap-4 bg-white p-6 rounded-2xl">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="font-medium text-2xl">Propose Price</h2>
      </div>

      <form className="flex flex-col gap-6 items-center" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="due" className="text-title">
            Enter Bid
          </label>

          <div className="flex items-center border bg-[#FCFCFD] border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200h-[45px] gap-2">
            {/* <DollarIcon /> */}
            <span className="text-body ">$</span>
            <NumericInput
              type="text"
              {...form.register('amount')}
              placeholder="e.g 1000"
              className="bg-transparent  h-full text-sm text-body focus:outline-none"
            />
          </div>

          {form.formState.errors.amount && (
            <span className="text-red-500 text-sm">{form.formState.errors.amount.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="due" className="text-title">
            Message
          </label>
          <textarea
            rows={3}
            maxLength={150}
            id="due"
            {...form.register('message')}
            placeholder="Describe why you're a good candidate"
            className="w-full resize-none bg-[#FCFCFD] border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
          />
          <div className="text-sm ml-auto w-fit text-body -mt-1">{form.watch('message')?.length} / 150 characters</div>

          {form.formState.errors.message && (
            <span className="text-red-500 text-sm">{form.formState.errors.message.message}</span>
          )}
        </div>

        <Button fullWidth>{applyToOpenJob.isLoading ? <Spinner /> : 'Send Application'}</Button>
      </form>
    </div>
  );
};
