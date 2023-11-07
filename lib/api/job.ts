import { toast } from '@/components/common/toaster';
import {
  ApiError,
  ApiResponse,
  axios,
} from '@/lib/axios';
import type { Job } from '@/lib/types';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { FEED_TYPES } from '../utils';
import { useCreateFeed } from './feed';

// Create Job
interface CreateJobParams {
  name: string;
  category: string;
  paymentFee: number;
  description: string;
  isPrivate: boolean;
  deliveryDate: string;
  tags?: string[];
  attachments?: string[];
  deliverables: string[];
}

async function postCreateJob(params: CreateJobParams): Promise<Job> {
  const res = await axios.post('/collection', {
    ...params,
    type: 'job',
    deliverables: undefined,
  });
  return res.data.data;
}

export function useCreateJob() {
  const assignJobDeliverables = useAttachDeliverablesToJob();
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: postCreateJob,
    mutationKey: ['create-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: async ({ _id, name, isPrivate, description, creator }, { deliverables = [] }) => {
      await assignJobDeliverables.mutate({
        jobId: _id,
        deliverables,
      });
      // create feed is isPrivate is false
      if (!isPrivate) {
        await createFeed.mutate({
          //@ts-ignore
          owners: [creator],
          title: name,
          description: description,
          data: _id,
          isPublic: true,
          type: FEED_TYPES.PUBLIC_JOB_CREATED,
        });
      }
      toast.success(`Job ${name} posted successfully`);
      return;
    },
  });
}

// Get Jobs
interface GetJobsParams {
  page?: number;
  limit?: number;
  category: 'open' | 'created' | 'assigned';
  status?: 'pending' | 'ongoing' | 'completed' | 'cancelled';
}

interface GetJobsResponse {
  limit: number;
  page: number;
  pages: number;
  total: number;
  data: Job[];
}

async function getJobs(params: GetJobsParams): Promise<GetJobsResponse> {
  const res = await axios.get('/collection', {
    params: {
      type: 'job',
      creator: params.category === 'created' ? true : undefined,
      isPrivate: params.category === 'open' ? false : undefined,
      receiver: params.category === 'assigned' ? true : undefined,
      status: params.status,
    },
  });
  return res.data.data;
}

export function useGetJobs(params: GetJobsParams) {
  return useQuery({
    queryFn: () => getJobs(params),
    queryKey: ['get-jobs', params],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

// Get Job By Id

interface GetJobByIdParams {
  jobId: string;
  extras?: string;
}

interface GetJobByIdResponse extends Job { }

async function getJobById(params: GetJobByIdParams): Promise<GetJobByIdResponse> {
  const res = await axios.get(`/collection/${params.jobId}`);
  return res.data.data;
}

export function useGetJobById(params: GetJobByIdParams) {
  return useQuery({
    queryFn: () => getJobById(params),
    queryKey: ['get-job-by-id', params],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
  });
}

// Update Job
interface UpdateJobParams {
  id: string;
  name: string;
  category: string;
  paymentFee: number;
  description: string;
  tags?: string[];
  isPrivate: boolean;
  deliveryDate: string;
  deliverables: string[];
  attachments?: string[];
}

async function postUpdateJob(params: UpdateJobParams): Promise<Job> {
  const res = await axios.patch(`/collection/${params.id}`, {
    ...params,
    type: 'job',
    id: undefined,
    deliverables: undefined,
  });
  return res.data.data;
}

export function useUpdateJob() {
  const updateJobDeliverables = useAttachDeliverablesToJob();

  return useMutation({
    mutationFn: postUpdateJob,
    mutationKey: ['update-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
    onSuccess: async (_, { deliverables = [], id, name }) => {
      updateJobDeliverables.mutate(
        {
          jobId: id,
          deliverables,
          replace: true,
        },
        {
          onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? 'An error occurred updating deliverables');
          },
        },
      );
      toast.success(`Job ${name} updated successfully`);
    },
  });
}

// Attach Deliverables to Job

interface AttachDeliverablesToJobParams {
  jobId: string;
  replace?: boolean;
  deliverables: string[];
}

async function postAttachDeliverablesToJob(params: AttachDeliverablesToJobParams): Promise<any> {
  const deliverables = params.deliverables.map((deliverable) => ({
    name: deliverable,
    description: deliverable,
  }));

  const res = await axios.post(`/collection/many`, {
    parent: params.jobId,
    type: 'deliverable',
    replace: params.replace,
    collections: deliverables,
  });
  return res.data.data;
}

export function useAttachDeliverablesToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAttachDeliverablesToJob,
    mutationKey: ['assign-job-deliverables'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'Assigning deliverables failed');
    },
    onSuccess: (_, { jobId }) => {
      queryClient.refetchQueries({
        queryKey: ['get-job-by-id', { jobId }],
      });
    },
  });
}

// Mark Deliverable as Complete
interface MarkDeliverableAsCompleteParams {
  jobId: string;
  jobCreator: string;
  isComplete: boolean;
  deliverableId: string;
  totalDeliverables: number;
  completedDeliverables: number;
  meta: Record<string, any>;
}

async function postToggleDeliverableCompletion(params: MarkDeliverableAsCompleteParams): Promise<ApiResponse> {
  const res = await axios.patch(`/collection/${params.deliverableId}`, {
    progress: params.isComplete ? 100 : 0,
    meta: params.meta,
  });
  return res.data;
}

export function useToggleDeliverableCompletion({ description }: { description: string }) {
  const createFeed = useCreateFeed();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postToggleDeliverableCompletion,
    mutationKey: ['mark-deliverable-as-complete'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Marking deliverable as complete failed');
    },
    onSuccess: async (_, { completedDeliverables, jobId, jobCreator, totalDeliverables, isComplete }) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['get-jobs', { category: 'assigned' }] }),
        queryClient.refetchQueries({ queryKey: ['get-job-by-id', { jobId }] }),
      ]);
      // if (isComplete) {
      const completedD = isComplete ? completedDeliverables + 1 : completedDeliverables - 1;
      await createFeed.mutate({
        type: FEED_TYPES.JOB_DELIVERABLE_UPDATE,
        owners: [jobCreator],
        title: 'New Job Deliverable Update',
        description: description,
        data: jobId,
        isPublic: false,
        meta: {
          value: (100 * completedD) / totalDeliverables,
          isMarked: isComplete,
        },
      });
      // }
      toast.success(`Deliverable marked as ${isComplete ? 'complete' : 'incomplete'} successfully`);
    },
  });
}

// Update Job Progress
interface UpdateJobProgressParams {
  jobId: string;
  progress: number;
}

async function postUpdateJobProgress(params: UpdateJobProgressParams): Promise<ApiResponse> {
  const res = await axios.patch(`/collection/${params.jobId}`, {
    progress: params.progress,
  });
  return res.data.data;
}

export function useUpdateJobProgress({ creatorId }: { creatorId: string }) {
  const queryClient = useQueryClient();
  const jobsQuery = useGetJobs({ category: 'assigned' });
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: postUpdateJobProgress,
    mutationKey: ['update-job-progress'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Updating job progress failed');
    },
    onSuccess: async (_, { jobId, progress }) => {
      await Promise.all([jobsQuery.refetch(), queryClient.refetchQueries(['get-job-by-id', { jobId }])]);
      if (creatorId && progress == 100) {
        await createFeed.mutate({
          owners: [creatorId],
          title: 'Talent Completed Job',
          description: 'Talent Completed Job',
          isPublic: false,
          type: FEED_TYPES.JOB_COMPLETION,
          data: jobId,
          meta: {
            progress,
          },
        });
      }
    },
  });
}

// Mark Job as Complete
interface MarkJobAsCompleteParams {
  jobId: string;
  talentId?: string;
}

async function postMarkJobAsComplete(params: MarkJobAsCompleteParams): Promise<ApiResponse> {
  const res = await axios.patch(`/collection/${params.jobId}`, {
    status: 'completed',
  });
  return res.data.data;
}

export function useMarkJobAsComplete() {
  const queryClient = useQueryClient();
  const jobsQuery = useGetJobs({ category: 'assigned' });
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: postMarkJobAsComplete,
    mutationKey: ['mark-job-as-complete'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Marking job as complete failed');
    },
    onSuccess: async (_, { jobId }) => {
      jobsQuery.refetch();
      queryClient.refetchQueries(['get-job-by-id', { jobId }]);
      toast.success('Job marked as completed');
    },
  });
}

// Create Job Review
interface CreateJobReviewParams {
  jobId: string;
  rating: number;
  review: string;
  recipientId: string;
}

async function postCreateJobReview(params: CreateJobReviewParams): Promise<ApiResponse> {
  const res = await axios.post(`/reviews`, {
    review: params.review,
    rating: params.rating,
    collectionId: params.jobId,
    receiver: params.recipientId,
  });
  return res.data.data;
}

export function useCreateJobReview() {
  const queryClient = useQueryClient();
  const createFeed = useCreateFeed();
  return useMutation({
    mutationFn: postCreateJobReview,
    mutationKey: ['create-job-review'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (_, { jobId, recipientId, review, rating }) => {
      queryClient.refetchQueries(['get-job-by-id', { jobId }]);
      createFeed.mutate({
        title: 'Job Review',
        description: review,
        isPublic: false,
        data: jobId,
        owners: [recipientId],
        type: FEED_TYPES.JOB_REVIEW,
        meta: {
          rating: rating,
        },
      });
      toast.success('Your review has been submitted successfully');
    },
  });
}

// Release Job Payment
interface ReleaseJobPaymentParams {
  jobId: string;
  amount?: number;
  owner?: string;
}

async function postReleaseJobPayment(params: ReleaseJobPaymentParams): Promise<ApiResponse> {
  const res = await axios.post(`/payment/release`, {
    collection: params.jobId,
    amount: params.amount,
  });
  return res.data.data;
}

export function useReleaseJobPayment() {
  const queryClient = useQueryClient();
  const jobsQuery = useGetJobs({ category: 'assigned' });
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: postReleaseJobPayment,
    mutationKey: ['release-job-payment'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (_, { jobId, owner }) => {
      jobsQuery.refetch();
      queryClient.refetchQueries(['get-job-by-id', { jobId }]);
      if (owner) {
        createFeed.mutate({
          title: 'Job Payment',
          description: 'Job Payment Released',
          isPublic: false,
          data: jobId,
          owners: [owner],
          type: FEED_TYPES.JOB_PAYMENT_RELEASED,
        });
      }
      toast.success('Payment released successfully');
    },
  });
}

// Invite talent to a job
interface InviteTalentToJobParams {
  jobId: string;
  talentId: string;
}

async function postInviteTalentToJob(params: InviteTalentToJobParams): Promise<ApiResponse> {
  const res = await axios.post(`/invite`, {
    collection: params.jobId,
    recipient: params.talentId,
  });
  return res.data.data;
}

export function useInviteTalentToJob({ talentId, job }: { talentId: string; job: Job }) {
  const createFeed = useCreateFeed();
  return useMutation({
    mutationFn: postInviteTalentToJob,
    mutationKey: ['invite-talent-to-private-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred inviting talent');
    },
    onSuccess: () => {
      if (!job.isPrivate) {
        // create job filled notification for public job applicants
        const applicants = job.collections
          .filter((a) => a.type == 'application')
          .map((a) => a.creator._id)
          .filter((a) => a != talentId);
        if (applicants.length > 0) {
          createFeed.mutate({
            owners: [...applicants],
            title: 'Job Filled',
            type: FEED_TYPES.PUBLIC_JOB_FILLED,
            data: job._id,
            description: 'Job Filled',
            isPublic: false,
          });
        }
      }
      toast.success('Talent invited successfully');
    },
  });
}

// Cancel a job invite

interface CancelJobInviteParams {
  inviteId: string;
}

async function postCancelJobInvite(params: CancelJobInviteParams): Promise<ApiResponse> {
  const res = await axios.post(`/invite/${params.inviteId}/cancel`);
  return res.data.data;
}

export function useCancelJobInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCancelJobInvite,
    mutationKey: ['cancel-job-invite'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      queryClient.refetchQueries(['get-job-by-id']);
      toast.success('Invite cancelled successfully');
    },
  });
}

// Accept a private job invite
interface AcceptPrivateJobInviteParams {
  inviteId: string;
}

async function postAcceptPrivateJobInvite(params: AcceptPrivateJobInviteParams): Promise<ApiResponse> {
  const res = await axios.post(`/invite/${params.inviteId}/accept`);
  return res.data.data;
}

export function useAcceptPrivateJobInvite() {
  return useMutation({
    mutationFn: postAcceptPrivateJobInvite,
    mutationKey: ['accept-private-job-invite'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Invite accepted successfully');
    },
  });
}

// Decline a private job invite
interface DeclinePrivateJobInviteParams {
  inviteId: string;
}

async function postDeclinePrivateJobInvite(params: DeclinePrivateJobInviteParams): Promise<ApiResponse> {
  const res = await axios.post(`/invite/${params.inviteId}/decline`);
  return res.data.data;
}

export function useDeclinePrivateJobInvite() {
  return useMutation({
    mutationFn: postDeclinePrivateJobInvite,
    mutationKey: ['decline-private-job-invite'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Invite declined successfully');
    },
  });
}

// OPEN JOBS

// Apply to an open job

interface ApplyToOpenJobParams {
  jobId: string;
  amount: number;
  message: string;
}

async function postApplyToOpenJob(params: ApplyToOpenJobParams): Promise<Job> {
  const res = await axios.post(`/collection`, {
    type: 'application',
    name: 'Application',
    description: params.message,
    parent: params.jobId,
    paymentFee: params.amount,
  });
  return res.data.data;
}

export function useApplyToOpenJob({ jobCreator, jobId }: { jobCreator: string; jobId: string }) {
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: postApplyToOpenJob,
    mutationKey: ['apply-to-open-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data) => {
      // create new job application feed for job owner
      createFeed.mutate({
        owners: [jobCreator],
        title: 'New Job application',
        description: 'New Job application',
        data: data._id,
        isPublic: false,
        type: FEED_TYPES.JOB_APPLICATION_SUBMITTED,
      });
      toast.success('Applied to job successfully');
    },
  });
}

// Post Job Payment Details

interface PostJobPaymentDetailsParams {
  jobId: string;
  coin: 'AVAX' | 'USDC';
}

export interface PostJobPaymentDetailsResponse {
  rate: number;
  usdFee: number;
  address: string;
  usdAmount: number;
  amountToPay: number;
  expectedFee: number;
  feePercentage: number;
  collectionAmount: number;
  chainId: number;
}

async function postJobPaymentDetails(params: PostJobPaymentDetailsParams): Promise<PostJobPaymentDetailsResponse> {
  const res = await axios.post(`/payment`, {
    coin: params.coin,
    collection: params.jobId,
  });
  return res.data.data;
}

export function usePostJobPaymentDetails() {
  return useMutation({
    mutationFn: postJobPaymentDetails,
    mutationKey: ['get-job-payment-details'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
  });
}

// Confirm Job Payment

interface ConfirmJobPaymentParams {
  jobId: string;
  delay?: number;
}

async function postConfirmJobPayment(params: ConfirmJobPaymentParams): Promise<ApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, params.delay ?? 0));
  const res = await axios.post(`/payment/validate`, {
    collection: params.jobId,
  });
  return res.data.data;
}

export function useConfirmJobPayment() {
  return useMutation({
    mutationFn: postConfirmJobPayment,
    mutationKey: ['confirm-job-payment'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Payment confirmed successfully');
    },
  });
}
interface DeleteJobParams {
  id: string;
}

async function postDeleteJob(params: DeleteJobParams): Promise<Job> {
  const res = await axios.delete(`/collection/${params.id}`);
  return res.data.data;
}

export function useDeleteJob() {
  return useMutation({
    mutationFn: postDeleteJob,
    mutationKey: ['delete-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
    onSuccess: () => {
      toast.success(`Job deleted successfully`);
    },
  });
}

// Request Job Cancellation

interface RequestJobCancellationParams {
  jobId: string;
  reason: string;
  explanation?: string;
}

async function requestJobCancellation(params: RequestJobCancellationParams): Promise<ApiResponse> {
  const res = await axios.post(`/collection`, {
    type: 'cancellation',
    name: params.reason,
    parent: params.jobId,
    description: params.explanation,
  });

  return res.data.data;
}

export function useRequestJobCancellation({ talentId }: { talentId: string }) {
  const queryClient = useQueryClient();
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: requestJobCancellation,
    mutationKey: ['request-job-cancellation'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Error requesting job cancellation');
    },
    onSuccess: (_, { jobId }) => {
      queryClient.refetchQueries({ queryKey: ['get-job-by-id', { jobId }] });
      createFeed.mutate({
        title: 'Job Cancel Request',
        description: 'Job Cancel Request',
        owners: [talentId],
        data: jobId,
        type: FEED_TYPES.JOB_CANCELLED_REQUEST,
        isPublic: false,
      });
      toast.success(`Job cancellation requested successfully`);
    },
  });
}

// Accept Job Cancellation

interface AcceptJobCancellationParams {
  jobId: string;
  amount: number;
  rating: number;
  review: string;
  recipientId: string;
}

async function acceptJobCancellation(params: AcceptJobCancellationParams): Promise<ApiResponse> {
  let res;

  res = await axios.post(`/reviews`, {
    review: params.review,
    rating: params.rating,
    collectionId: params.jobId,
    receiver: params.recipientId,
  });

  res = await axios.post(`/payment/release`, {
    collection: params.jobId,
    amount: params.amount.toString(),
  });

  res = await axios.patch(`/collection/${params.jobId}`, {
    status: 'cancelled',
  });

  return res.data.data;
}

export function useAcceptJobCancellation() {
  const queryClient = useQueryClient();
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: acceptJobCancellation,
    mutationKey: ['accept-job-cancellation'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Error accepting job cancellation');
    },
    onSuccess: async (_, { jobId, recipientId, rating, review }) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['get-job-by-id', { jobId }] }),
        // create feeds
        createFeed.mutate({
          title: 'Job Cancel Accepted',
          description: 'Job Cancel Accepted',
          owners: [recipientId],
          data: jobId,
          type: FEED_TYPES.JOB_CANCELLED_ACCEPTED,
          isPublic: false,
          meta: {
            value: rating,
            review: review,
          },
        }),
      ]);
      toast.success(`Job cancellation accepted successfully`);
    },
  });
}

// Request Review Change

interface RequestReviewChangeParams {
  jobId: string;
  reason: string;
}

async function requestReviewChange(params: RequestReviewChangeParams): Promise<ApiResponse> {
  const res = await axios.post(`/collection`, {
    status: 'pending',
    parent: params.jobId,
    description: params.reason,
    type: 'review_change_request',
    name: 'Review Change Request',
  });

  return res.data.data;
}

export function useRequestReviewChange({ recipientId }: { recipientId: string }) {
  const queryClient = useQueryClient();
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: requestReviewChange,
    mutationKey: ['request-review-change'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Error requesting review change');
    },
    onSuccess: (_, { jobId }) => {
      queryClient.refetchQueries({ queryKey: ['get-job-by-id', { jobId }] });
      // create feeds
      createFeed.mutate({
        title: 'Request Review Change',
        description: 'New Review Change Request',
        owners: [recipientId],
        data: jobId,
        type: FEED_TYPES.JOB_REVIEW_CHANGE,
        isPublic: false,
      });
      toast.success(`Review change requested successfully`);
    },
  });
}

// Accept Review Change: client review is deleted, all deliverables status as 0;
interface AcceptReviewChangeParams {
  jobId: string;
  reviewId: string;
  requestId: string;
  deliverableIds: string[];
}

// this basically deletes the review, sets all deliverables to 0
async function acceptReviewChange(params: AcceptReviewChangeParams): Promise<ApiResponse> {
  let res;

  res = await axios.delete(`/reviews/${params.reviewId}`);

  res = await axios.patch(`/collection/many/update`, {
    collections: params.deliverableIds.map((id) => ({
      id,
      progress: 0,
    })),
  });

  res = await axios.patch(`/collection/${params.requestId}`, {
    status: 'completed',
  });

  res = await axios.patch(`/collection/${params.jobId}`, {
    status: 'ongoing',
  });

  return res.data.data;
}

export function useAcceptReviewChange({ jobId, recipientId }: { jobId: string; recipientId: string }) {
  const queryClient = useQueryClient();
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: acceptReviewChange,
    mutationKey: ['accept-review-change'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Error accepting review change');
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['get-job-by-id', { jobId }] });
      // create feeds
      createFeed.mutate({
        title: 'Review Change Accepted',
        description: 'New Review Change Request Accepted',
        owners: [recipientId],
        data: jobId,
        type: FEED_TYPES.JOB_REVIEW_CHANGE_ACCEPTED,
        isPublic: false,
      });
      toast.success(`Review change accepted successfully`);
    },
  });
}

// Decline Review Change: review_request status is set to cancelled,

interface DeclineReviewChangeParams {
  reviewChangeRequestId: string;
}

async function declineReviewChange(params: DeclineReviewChangeParams): Promise<ApiResponse> {
  const res = await axios.patch(`/collection/${params.reviewChangeRequestId}`, {
    status: 'completed',
  });

  return res.data.data;
}

export function useDeclineReviewChange({ jobId, recipientId }: { jobId: string; recipientId: string }) {
  const queryClient = useQueryClient();
  const createFeed = useCreateFeed();

  return useMutation({
    mutationFn: declineReviewChange,
    mutationKey: ['decline-review-change'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Error declining review change');
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['get-job-by-id', { jobId }] });
      // create feeds
      createFeed.mutate({
        title: 'Review Change Accepted',
        description: 'New Review Change Request Accepted',
        owners: [recipientId],
        data: jobId,
        type: FEED_TYPES.JOB_REVIEW_CHANGE_ACCEPTED,
        isPublic: false,
      });
      toast.success(`Review change declined successfully`);
    },
  });
}
