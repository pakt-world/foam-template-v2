"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import { Check } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type createJobSchema } from "@/lib/validations";
import { useGetCategory } from "@/lib/api/category";
import { Spinner } from "@/components/common";
import { sentenceCase } from "@/lib/utils";

type FormValues = z.infer<typeof createJobSchema>;

interface SkillInputProps {
	form: UseFormReturn<FormValues>;
	name: "thirdSkill" | "secondSkill" | "firstSkill";
}

export const SkillInput = ({ form, name }: SkillInputProps): JSX.Element => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [skillValue, setSkillValue] = useState<string>("");
	const ref = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const { data, isFetching, isLoading } = useGetCategory(skillValue);
	const categories = data?.data ?? [];

	const CATEGORY_LIST: Array<{ label: string; value: string }> = (
		categories || []
	).map((c) => ({
		label: c.name,
		value: c.name,
	}));

	// Filter with skillValue/inputValue
	const filteredCategoryList = CATEGORY_LIST.filter((category) => {
		return category.label.toLowerCase().includes(skillValue.toLowerCase());
	});

	useEffect(() => {
		// Check if the input element exists
		if (inputRef.current) {
			// Event handler function
			const handleKeyDown = (event: KeyboardEvent): void => {
				if (event.key === "Backspace" && skillValue.length === 1) {
					setIsOpened(true);
				}
			};

			// Add event listener to the input element
			const inputElement = inputRef.current;
			inputElement.addEventListener("keydown", handleKeyDown);

			// Cleanup function
			return () => {
				inputElement.removeEventListener("keydown", handleKeyDown);
			};
		}

		return () => {};
	}, [inputRef, skillValue.length]);

	const handleClickOutside = (): void => {
		setIsOpened(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	useEffect(() => {
		if (filteredCategoryList.length === 0 && !isLoading && !isFetching) {
			setIsOpened(false);
		}
	}, [filteredCategoryList.length, isFetching, isLoading]);

	return (
		<Controller
			name={name}
			control={form?.control}
			render={({ field: { onChange, value } }) => {
				return (
					<div className="relative">
						<input
							type="text"
							placeholder="Enter skill"
							className="z-50 h-full w-fit rounded-full !border !border-line bg-[#F2F4F5] py-3 pl-4 text-base focus:outline-none"
							onChange={(e) => {
								onChange(e.target.value);
								setSkillValue(e.target.value);
							}}
							onClick={() => {
								setIsOpened(true);
							}}
							value={sentenceCase(value ?? "")}
							ref={inputRef}
						/>
						{isOpened && (
							<div
								className="absolute z-50 max-h-[200px] min-w-[271px] translate-x-1 translate-y-2 gap-4 overflow-hidden overflow-y-auto rounded-lg border border-green-300 bg-white p-4 shadow"
								ref={ref}
							>
								{isFetching || isLoading ? (
									<Spinner />
								) : (
									<>
										{filteredCategoryList.map(
											({ label, value: v }) => (
												<div
													key={v}
													className="relative flex w-full cursor-pointer select-none items-center rounded p-2 text-base outline-none hover:bg-[#ECFCE5]"
													onClick={() => {
														onChange(label);
														setIsOpened(false);
													}}
													onKeyDown={(e) => {
														if (
															e.key === "Enter" ||
															e.key === " "
														) {
															onChange(label);
															setIsOpened(false);
														}
													}}
													role="button"
													tabIndex={0}
												>
													{sentenceCase(label)}
													{label === value && (
														<span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
															<Check className="h-4 w-4" />
														</span>
													)}
												</div>
											),
										)}
									</>
								)}
							</div>
						)}
					</div>
				);
			}}
		/>
	);
};
