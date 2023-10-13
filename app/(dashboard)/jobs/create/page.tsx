'use client';
import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FEED_TYPES, cn } from '@/lib/utils';
import { useCreateJob } from '@/lib/api/job';
import { Checkbox, Button } from 'pakt-ui';
import { useDropzone } from 'react-dropzone';
import { Spinner } from '@/components/common';
import { endOfYesterday, format } from 'date-fns';
import { DollarIcon } from '@/components/common/icons';
import { DatePicker } from '@/components/common/date-picker';
import { NumericInput } from '@/components/common/numeric-input';
import { DeliverablesInput } from '@/components/jobs/deliverables-input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/common/select';

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
import { useCreateFeed } from '@/lib/api/feed';
import { useUserState } from '@/lib/store/account';

const schema = z.object({
  due: z.date({
    required_error: 'Due date is required',
  }),
  jobType: z.string().default("freelance"),
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

export default function CreateJob() {
  const router = useRouter();
  const createJob = useCreateJob();
  // const { _id: userId } = useUserState();
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
    mode: 'all',
    resolver: zodResolver(schema),
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
    createJob.mutate(
      {
        name: title,
        tags: [firstSkill, secondSkill, thirdSkill].filter(Boolean),
        category,
        description,
        deliverables,
        paymentFee: Number(budget),
        isPrivate: visibility === 'private',
        deliveryDate: format(due, 'yyyy-MM-dd'),
      },
      {
        onSuccess: ({ _id }) => {
          router.push(`/jobs/${_id}`);
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
      !!form.watch('jobType') &&
      !form.getFieldState('jobType').invalid &&
      !!form.watch('visibility') &&
      !form.getFieldState('visibility').invalid &&
      !!form.watch('category') &&
      !form.getFieldState('category').invalid,
  };

  return (
    <div className="flex gap-6 overflow-y-auto pb-10 h-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        className="border grow bg-white rounded-2xl flex flex-col h-fit"
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
                <span className="text-sm text-red-200">{form.formState.errors.title?.message}!</span>
              )}
            </span>
          </div>

          <div className="flex gap-4 max-w-lg">
            <div className="relative">
              <div className="bg-[#ECFCE5] border-[#198155] text-primary flex items-center p-2 rounded-lg h-[45px]">
                <DollarIcon />
                <NumericInput
                  type="text"
                  {...form.register('budget')}
                  placeholder="Enter Proposed Price"
                  className="bg-transparent  placeholder:text-[#0065D04D] h-full text-xl focus:outline-none"
                />
              </div>
              <span className="absolute -bottom-5 flex w-full">
                {form.formState.errors.budget?.message && (
                  <span className="text-sm text-red-500">{form.formState.errors.budget?.message}</span>
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
                  <span className="text-sm text-red-500">{form.formState.errors.due?.message}</span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-6 grow">
          <div className="flex flex-col gap-2">
            <h3 className="text-black text-lg font-medium">
              Preferred Skills<span className="ml-4 text-body text-sm font-thin">You can add up to three</span>
            </h3>
            <div className="flex gap-2 items-center justify-start">
              <div className="relative">
                <SkillInput {...form.register('firstSkill')} />
                <span className="absolute -bottom-6 left-2 flex w-full">
                  {form.formState.errors.firstSkill?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.firstSkill?.message}</span>
                  )}
                </span>
              </div>
              <div className="flex flex-col">
                <SkillInput {...form.register('secondSkill')} />
                <span>
                  {form.formState.errors.secondSkill?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.secondSkill?.message}</span>
                  )}
                </span>
              </div>
              <div className="relative">
                <SkillInput {...form.register('thirdSkill')} />
                <span className="absolute bottom-2">
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
                id="description"
                maxLength={400}
                {...form.register('description')}
                className="bg-[#C9F0FF] rounded-lg w-full p-4 focus:outline-none border border-blue-300"
                placeholder="Enter Job Description"
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
            <h3 className="text-black text-lg font-medium">
              Deliverables{' '}
              <span className="ml-4 text-body text-sm font-thin">You can create up to five deliverables</span>
            </h3>

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
            <h3 className="text-black text-lg font-medium">Classifications</h3>
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

              {/* <div className="flex flex-col gap-2">
                <label className="text-sm text-body">Job Type</label>
                <div className="relative">
                  <Controller
                    name="jobType"
                    control={form.control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select defaultValue={value} onValueChange={onChange}>
                          <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                            <SelectValue placeholder="Select Job Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="freelance" className="hover:bg-[#ECFCE5] rounded py-2">
                              Freelance
                            </SelectItem>
                            <SelectItem value="project" className="hover:bg-[#ECFCE5] rounded py-2">
                              Project
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  <span className="absolute -bottom-5 flex w-full">
                    {form.formState.errors.jobType?.message && (
                      <span className="text-sm text-red-500 whitespace-nowrap">
                        {form.formState.errors.jobType?.message}
                      </span>
                    )}
                  </span>
                </div>
              </div> */}
            </div>
          </div>
          <div className="ml-auto max-w-[250px] w-full border border-gray-300 rounded-xl mt-auto">
            <Button disabled={createJob.isLoading || !form.formState.isValid} fullWidth>
              {createJob.isLoading ? <Spinner /> : form.watch('visibility') == 'private' ? 'Create Job' : 'Post Job'}
            </Button>
          </div>
        </div>
      </form>
      <div className="basis-[300px] shrink-0 grow-0 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl h-fit border border-line flex flex-col gap-3">
          <h3 className="font-bold">Steps</h3>
          <StepIndicator isComplete={jobSteps.details}>Job Details</StepIndicator>
          <StepIndicator isComplete={jobSteps.skills}>Skills</StepIndicator>
          <StepIndicator isComplete={jobSteps.description}>Description</StepIndicator>
          <StepIndicator isComplete={jobSteps.deliverables}>Deliverables</StepIndicator>
          <StepIndicator isComplete={jobSteps.classification}>Classification</StepIndicator>
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
}

type SkillInputProps = React.ComponentPropsWithRef<'input'>;

const SkillInput = React.forwardRef<HTMLInputElement, SkillInputProps>(({ ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      type="text"
      placeholder="Enter Skill"
      className="bg-[#F2F4F5] py-3 rounded-full pl-4 h-full text-base focus:outline-none w-fit border border-line"
    />
  );
});

SkillInput.displayName = 'SkillInput';
