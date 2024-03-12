"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as React from "react";
import { format } from "date-fns";
import { DayPicker, type DayPickerSingleProps } from "react-day-picker";
import {
	Calendar as CalendarIcon,
	ChevronRight,
	ChevronLeft,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/common/popover";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	showOutsideDays?: boolean;
	className?: string;
	classNames?: Record<string, string>;
	mode?: "single" | "range";
	selected?: Date | Date[];
	initialFocus?: boolean;
	// ...p
};

const IconLeft = (): React.JSX.Element => <ChevronLeft className="h-4 w-4" />;
const IconRight = (): React.JSX.Element => <ChevronRight className="h-4 w-4" />;

export const Calendar = ({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps): React.JSX.Element => {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "space-x-1 flex items-center",
				nav_button: cn(
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: "w-full border-collapse space-y-1",
				head_row: "flex",
				head_cell:
					"text-muted-foreground rounded-full w-8 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: cn(
					"relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-green-500",
					props.mode === "range"
						? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
						: "[&:has([aria-selected])]:rounded-full",
				),
				day: cn(
					"h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-green-500 hover:text-green-50 rounded-full duration-100",
				),
				day_range_start: "day-range-start",
				day_range_end: "day-range-end",
				day_selected: "bg-green-600 text-green-50",
				day_today: "bg-green-200",
				day_outside: "text-gray-400",
				day_disabled:
					"text-gray-400 hover:bg-transparent hover:text-gray-400",
				day_range_middle:
					"aria-selected:bg-green-100 aria-selected:text-green-600",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft,
				IconRight,
			}}
			{...props}
		/>
	);
};

type DatePickerProps = Omit<DayPickerSingleProps, "mode"> & {
	placeholder?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({
	selected,
	onSelect,
	className,
	placeholder,
	...props
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					className={cn(
						"flex w-full items-center gap-2 rounded-lg border border-line px-4 py-3 text-body outline-none focus-within:border-secondary hover:border-secondary hover:duration-200",
						className,
					)}
					type="button"
				>
					<CalendarIcon className="h-5 w-5" />

					<span className="flex-1 text-left">
						{selected ? (
							<span>{format(selected, "PPP")}</span>
						) : (
							<span className="">
								{placeholder ?? "Select a date"}
							</span>
						)}
					</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-auto border-green-200 p-0">
				<Calendar
					mode="single"
					selected={selected}
					onSelect={onSelect}
					initialFocus
					{...props}
				/>
			</PopoverContent>
		</Popover>
	);
};
