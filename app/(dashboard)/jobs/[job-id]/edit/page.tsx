'use client';
import React from 'react';
// import { cn } from '@/lib/utils';
import { Job, isJobDeliverable } from '@/lib/types';
import { useGetJobById } from '@/lib/api/job';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useRouter } from 'next/navigation';
import { Button } from 'pakt-ui';
// import { useDropzone } from 'react-dropzone';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/common';
import { endOfYesterday, format } from 'date-fns';
import { NumericInput } from '@/components/common/numeric-input';
import { DatePicker } from '@/components/common/date-picker';
import { DeliverablesInput } from '@/components/jobs/deliverables-input';
import { DollarIcon } from '@/components/common/icons';
import { useUpdateJob, useInviteTalentToJob } from '@/lib/api/job';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/common/select';
import { filterEmptyStrings } from '@/lib/utils';
interface Props {
  params: {
    'job-id': string;
  };
}

const CATEGORY_OPTIONS = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Copywriting', value: 'copywriting' },
  { label: 'Others', value: 'others' },
];

import * as z from 'zod';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { StepIndicator } from '@/components/jobs/step-indicator';

const schema = z.object({
  due: z.date({
    required_error: 'Due date is required',
  }),
  visibility: z.string().nonempty({ message: 'Required' }),
  thirdSkill: z.string().optional().default(''),
  secondSkill: z.string().optional().default(''),
  firstSkill: z.string().nonempty({ message: 'At least, one skill is required' }),
  budget: z.coerce.number().min(100, { message: 'Budget must be at least $100' }),
  title: z.string().nonempty({ message: 'Job title is required' }),
  description: z.string().nonempty({ message: 'Job description is required' }),
  category: z.string().nonempty({ message: 'Required' }),
  deliverables: z
    .array(z.string(), {
      required_error: 'At least, one deliverable is required',
    })
    .max(5, {
      message: 'You can add up to 5 deliverables',
    }),
});

type FormValues = z.infer<typeof schema>;

export default function EditJob({ params }: Props) {
  const jobId = params['job-id'];
  const jobQuery = useGetJobById({ jobId });

  if (jobQuery.isError) return <PageError className="absolute inset-0" />;
  if (jobQuery.isLoading) return <PageLoading className="absolute inset-0" />;
  const { data: job } = jobQuery;

  return <JobEditForm job={job} />;
}

type SkillInputProps = React.ComponentPropsWithRef<'input'>;

const SkillInput = React.forwardRef<HTMLInputElement, SkillInputProps>(({ ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      type="text"
      placeholder="Enter skill"
      className="bg-[#F2F4F5] py-3 rounded-full pl-4 h-full text-base focus:outline-none w-fit border border-line"
    />
  );
});

SkillInput.displayName = 'SkillInput';

interface JobEditFormProps {
  job: Job;
}

const JobEditForm: React.FC<JobEditFormProps> = ({ job }) => {
  const router = useRouter();
  const params = useSearchParams();

  const updateJob = useUpdateJob();
  const talentId = params.get('talent-id') ?? '';
  const inviteTalent = useInviteTalentToJob({ talentId, job });

  // const [files, setFiles] = React.useState<File[]>([]);
  // const [uploadProgress, setUploadProgress] = React.useState(0);

  // const onDrop = React.useCallback(async (acceptedFiles: File[]) => {}, []);

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop,
  //   maxFiles: 5,
  //   accept: {},
  // });

  const form = useForm<FormValues>({
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      budget: job.paymentFee,
      deliverables: job.collections.filter(isJobDeliverable).map((collection) => collection.name),
      title: job?.name,
      category: job?.category,
      description: job?.description,
      due: new Date(job?.deliveryDate),
      firstSkill: job?.tagsData[0] || '',
      thirdSkill: job?.tagsData[2] || '',
      secondSkill: job?.tagsData[1] || '',
      visibility: job?.isPrivate ? 'private' : 'public',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async ({
    budget,
    category,
    deliverables,
    description,
    due,
    firstSkill,
    title,
    visibility,
    secondSkill,
    thirdSkill,
  }) => {
    updateJob.mutate(
      {
        id: job._id,
        name: title,
        tags: filterEmptyStrings([firstSkill, secondSkill, thirdSkill]),
        category,
        description,
        deliverables,
        paymentFee: Number(budget),
        isPrivate: visibility === 'private',
        deliveryDate: format(due, 'yyyy-MM-dd'),
      },
      {
        onSuccess(_data, { id }) {
          if (talentId && job.escrowPaid) {
            inviteTalent.mutate(
              {
                talentId,
                jobId: id,
              },
              {
                onSuccess() {
                  router.push(`/jobs/${id}`);
                },
              },
            );
          }
          if (talentId) {
            router.push(`/jobs/${id}/make-deposit/?talent-id=${talentId}`);
          } else {
            router.push(`/jobs/${id}`);
          }
        },
      },
    );
  };

  const jobSteps = {
    details:
      !!form.watch('title') &&
      !form.getFieldState('title').invalid &&
      !!form.watch('due') &&
      !form.getFieldState('due').invalid &&
      !!form.watch('budget') &&
      !form.getFieldState('budget').invalid,
    skills: !!form.watch('firstSkill') && !form.getFieldState('firstSkill').invalid,
    description: !!form.watch('description') && !form.getFieldState('description').invalid,
    deliverables:
      Array.isArray(form.watch('deliverables')) &&
      form.watch('deliverables').filter((r) => r != '').length > 0 &&
      !form.getFieldState('deliverables').invalid,
    classification:
      !!form.watch('visibility') &&
      !form.getFieldState('visibility').invalid &&
      !!form.watch('category') &&
      !form.getFieldState('category').invalid,
  };

  return (
    <div className="flex gap-6 pb-10 h-full">
      <div className="w-full overflow-y-auto rounded-2xl overflow-hidden border border-line">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className="grow bg-white rounded-2xl flex flex-col h-fit"
        >
          <div className="bg-primary-gradient p-6 pb-8 rounded-t-2xl flex flex-col gap-10">
            <div className="relative">
              <input
                type="text"
                autoFocus
                maxLength={60}
                {...form.register('title')}
                placeholder="Enter Job Title"
                className="text-3xl w-full placeholder:text-white placeholder:text-opacity-60 bg-transparent focus:outline-none text-white caret-white"
              />
              <div className="text-sm text-white ml-auto text-right">{form.watch('title')?.length}/ 60</div>
              <span className="absolute -bottom-5 flex w-full">
                {form.formState.errors.title?.message && (
                  <span className="text-sm text-red-200">{form.formState.errors.title?.message}</span>
                )}
              </span>
            </div>

            <div className="w-full flex items-center gap-8">
              <div className="flex w-fit gap-4 max-w-xl">
                <div className="relative">
                  <div className="bg-[#ECFCE5] border-[#198155] text-primary flex items-center p-2 rounded-lg h-[45px]">
                    <DollarIcon />
                    <NumericInput
                      type="text"
                      {...form.register('budget')}
                      placeholder="Enter Proposed Price"
                      className="bg-transparent  placeholder:text-primary h-full text-base focus:outline-none"
                    />
                  </div>
                  <span className="absolute -bottom-5 flex w-full">
                    {form.formState.errors.budget?.message && (
                      <span className="text-sm text-red-200">{form.formState.errors.budget?.message}</span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <Controller
                    name="due"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        className="bg-[#C9F0FF] border-[#0065D0CC] text-[#0065D0CC] h-[45px] w-[250px]"
                        placeholder="Select Due Date"
                        selected={value}
                        onSelect={(date) => onChange(date)}
                        disabled={(date) => date < endOfYesterday()}
                      />
                    )}
                  />
                  <span className="absolute -bottom-5 flex w-full">
                    {form.formState.errors.due?.message && (
                      <span className="text-sm text-red-200">{form.formState.errors.due?.message}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-6 grow">
            <div className="flex flex-col gap-2">
              <h3 className="text-black text-lg font-medium">Preferred Skills</h3>
              <div className="flex gap-2 items-center justify-start">
                <div className="relative">
                  <SkillInput {...form.register('firstSkill')} />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.firstSkill?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.firstSkill?.message}</span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <SkillInput {...form.register('secondSkill')} />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.secondSkill?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.secondSkill?.message}</span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <SkillInput {...form.register('thirdSkill')} />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.thirdSkill?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.thirdSkill?.message}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-black text-lg font-medium">Job Description</h3>
              <div className="relative">
                <textarea
                  maxLength={400}
                  id="description"
                  {...form.register('description')}
                  className="bg-[#C9F0FF] rounded-lg w-full p-4 focus:outline-none border border-blue-300"
                  placeholder="Enter job description"
                  rows={3}
                />
                <div className="text-sm ml-auto w-fit text-body -mt-1">
                  {form.watch('description')?.length} / 400 characters
                </div>
                <span className="absolute -bottom-4 flex w-full">
                  {form.formState.errors.description?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.description?.message}</span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-black text-lg font-medium">Deliverables</h3>

              <div className="relative">
                <Controller
                  name="deliverables"
                  control={form.control}
                  render={({ field: { onChange, value = [] } }) => (
                    <DeliverablesInput deliverables={value} setDeliverables={onChange} />
                  )}
                />
                <span className="absolute -bottom-6 flex w-full">
                  {form.formState.errors.deliverables?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.deliverables?.message}</span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-black text-lg font-medium">Classification</h3>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-body">Job Category</label>
                  <div className="relative">
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Select defaultValue={value} onValueChange={onChange}>
                            <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_OPTIONS.map(({ label, value }) => (
                                <SelectItem key={value} value={value} className="hover:bg-[#ECFCE5] rounded py-2">
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                    <span className="absolute -bottom-5 flex w-full">
                      {form.formState.errors.category?.message && (
                        <span className="text-sm text-red-500">{form.formState.errors.category?.message}</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-body">Visibility</label>
                  <div className="relative">
                    <Controller
                      name="visibility"
                      control={form.control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Select defaultValue={value} onValueChange={onChange}>
                            <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                              <SelectValue placeholder="Select Visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private" className="hover:bg-[#ECFCE5] rounded py-2">
                                Private
                              </SelectItem>
                              <SelectItem value="open" className="hover:bg-[#ECFCE5] rounded py-2">
                                Public
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                    <span className="absolute -bottom-5 flex w-full">
                      {form.formState.errors.visibility?.message && (
                        <span className="text-sm text-red-500 whitespace-nowrap">
                          {form.formState.errors.visibility?.message}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="basis-[300px] shrink-0 grow-0 flex flex-col gap-6 ">
        <div className="bg-white p-6 rounded-xl h-fit border border-line flex flex-col gap-3">
          <h3 className="font-bold">Steps</h3>
          <StepIndicator isComplete={jobSteps.details}>Job Details</StepIndicator>
          <StepIndicator isComplete={jobSteps.skills}>Skills</StepIndicator>
          <StepIndicator isComplete={jobSteps.description}>Description</StepIndicator>
          <StepIndicator isComplete={jobSteps.deliverables}>Deliverables</StepIndicator>
          <StepIndicator isComplete={jobSteps.classification}>Classifications</StepIndicator>
          <StepIndicator isComplete={false}>Deposit Payment</StepIndicator>
        </div>

        <div className="flex gap-4 w-full">
          {!talentId && !job.escrowPaid && (
            <div className="w-full">
              <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                {updateJob.isLoading ? <Spinner /> : 'Update Job'}
              </Button>
            </div>
          )}

          {!talentId && job.escrowPaid && (
            <div className="w-full">
              <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                {updateJob.isLoading ? <Spinner /> : 'Update Job'}
              </Button>
            </div>
          )}

          {talentId && !job.escrowPaid && (
            <div className="w-full">
              <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                {updateJob.isLoading ? <Spinner /> : 'Make Deposit'}
              </Button>
            </div>
          )}

          {talentId && job.escrowPaid && (
            <div className="w-full">
              <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                {inviteTalent.isLoading || updateJob.isLoading ? <Spinner /> : 'Invite Talent'}
              </Button>
            </div>
          )}
        </div>
        {/* <div className="bg-white p-6 rounded-xl min-h-[250px] border border-line flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Attachments</span>{' '}
            <span className="text-body text-sm font-normal">(optional)</span>
          </div>

          <div
            className="border border-dashed rounded-3xl p-4 text-center grow flex items-center justify-center hover:bg-gray-50 duration-200 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <span className="flex text-body">Click to browse or drag and drop your files</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};
