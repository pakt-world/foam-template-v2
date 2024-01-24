"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "pakt-ui";
import { format } from "date-fns";
import type * as z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job, isJobDeliverable } from "@/lib/types";
import { useUpdateJob, useInviteTalentToJob } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { filterEmptyStrings } from "@/lib/utils";
import Steps from "@/components/jobs/steps";
import JobTitle from "@/components/forms/create-job/job-title";
import JobProposedPrice from "@/components/forms/create-job/job-proposed-price";
import JobDueDate from "@/components/forms/create-job/job-due-date";
import PreferredSkills from "@/components/forms/create-job/preferred-skills";
import JobDescription from "@/components/forms/create-job/job-description";
import JobDeliverables from "@/components/forms/create-job/job-deliverables";
import JobCategory from "@/components/forms/create-job/job-category";
import JobVisibility from "@/components/forms/create-job/job-visibility";
import { createJobSchema } from "@/lib/validations";

type FormValues = z.infer<typeof createJobSchema>;

interface JobEditFormProps {
    job: Job;
}

export const EditJobForm: FC<JobEditFormProps> = ({ job }) => {
    const router = useRouter();
    const params = useSearchParams();

    const updateJob = useUpdateJob();
    const talentId = params.get("talent-id") ?? "";
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
        reValidateMode: "onChange",
        resolver: zodResolver(createJobSchema),
        defaultValues: {
            budget: job.paymentFee,
            deliverables: job.collections.filter(isJobDeliverable).map((collection) => collection.name),
            title: job?.name,
            category: job?.category,
            description: job?.description,
            due: new Date(job?.deliveryDate),
            firstSkill: job?.tagsData[0] ?? "",
            thirdSkill: job?.tagsData[2] ?? "",
            secondSkill: job?.tagsData[1] ?? "",
            visibility: job?.isPrivate ? "private" : "public",
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
                isPrivate: visibility === "private",
                deliveryDate: format(due, "yyyy-MM-dd"),
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
            !!form.watch("title") &&
            !form.getFieldState("title").invalid &&
            !!form.watch("due") &&
            !form.getFieldState("due").invalid &&
            !!form.watch("budget") &&
            !form.getFieldState("budget").invalid,
        skills: !!form.watch("firstSkill") && !form.getFieldState("firstSkill").invalid,
        description: !!form.watch("description") && !form.getFieldState("description").invalid,
        deliverables:
            Array.isArray(form.watch("deliverables")) &&
            form.watch("deliverables").filter((r) => r !== "").length > 0 &&
            !form.getFieldState("deliverables").invalid,
        classification:
            !!form.watch("visibility") &&
            !form.getFieldState("visibility").invalid &&
            !!form.watch("category") &&
            !form.getFieldState("category").invalid,
    };

    return (
        <div className="flex h-full gap-6 pb-10">
            <div className="w-full overflow-hidden overflow-y-auto rounded-2xl border border-line">
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Error Triggered due to the addition of `onKeyDown` attribute */}
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }
                    }}
                    className="flex h-fit grow flex-col rounded-2xl bg-white"
                >
                    <div className="flex flex-col gap-10 rounded-t-2xl bg-primary-gradient p-6 pb-8">
                        <JobTitle form={form} />

                        <div className="flex w-fit max-w-lg gap-4">
                            <JobProposedPrice form={form} />
                            <JobDueDate form={form} />
                        </div>
                    </div>
                    <div className="flex grow flex-col gap-6 p-6">
                        <PreferredSkills form={form} isEdit />
                        <JobDescription form={form} />
                        <JobDeliverables form={form} isEdit />

                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-medium text-black">Classification</h3>
                            <div className="flex items-center gap-4">
                                <JobCategory form={form} />
                                <JobVisibility form={form} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex shrink-0 grow-0 basis-[300px] flex-col gap-6 ">
                <Steps jobSteps={jobSteps} isEdit />

                <div className="flex w-full gap-4">
                    {!talentId && !job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {updateJob.isLoading ? <Spinner /> : "Update Job"}
                            </Button>
                        </div>
                    )}

                    {!talentId && job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {updateJob.isLoading ? <Spinner /> : "Update Job"}
                            </Button>
                        </div>
                    )}

                    {talentId && !job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {updateJob.isLoading ? <Spinner /> : "Make Deposit"}
                            </Button>
                        </div>
                    )}

                    {talentId && job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {inviteTalent.isLoading || updateJob.isLoading ? <Spinner /> : "Invite Talent"}
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
