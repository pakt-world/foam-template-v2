"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import CreateJobForm from "@/components/forms/create-job";
import { createJobSchema } from "@/lib/validations";
import Steps from "@/components/jobs/misc/steps";

type FormValues = z.infer<typeof createJobSchema>;

export default function CreateJobPage(): React.JSX.Element {
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
		reValidateMode: "onChange",
		mode: "all",
		resolver: zodResolver(createJobSchema),
	});

	const jobSteps = {
		details:
			form.watch("title") !== "" &&
			!form.getFieldState("title").invalid &&
			form.watch("due") !== undefined &&
			!form.getFieldState("due").invalid &&
			form.watch("budget") !== 0 &&
			!form.getFieldState("budget").invalid,
		skills:
			form.watch("firstSkill") !== "" &&
			form.watch("firstSkill") !== undefined &&
			!form.getFieldState("firstSkill").invalid,
		description:
			form.watch("description") !== "" &&
			form.watch("description") !== undefined &&
			!form.getFieldState("description").invalid,
		deliverables:
			Array.isArray(form.watch("deliverables")) &&
			form
				.watch("deliverables")
				.filter((r) => r !== undefined && r !== "").length > 0 &&
			!form.getFieldState("deliverables").invalid,
		classification:
			form.watch("visibility") !== undefined &&
			!form.getFieldState("visibility").invalid &&
			form.watch("category") !== undefined &&
			!form.getFieldState("category").invalid,
	};

	return (
		<div className="flex h-full gap-6 overflow-y-auto pb-10">
			<CreateJobForm form={form} />
			<div className="flex shrink-0 grow-0 basis-[300px] flex-col gap-6">
				<Steps jobSteps={jobSteps} />
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
