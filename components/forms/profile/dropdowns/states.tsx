"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { ScrollArea, ScrollBar } from "@/components/common/scroll-area";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/common/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/common/popover";

import { cn, lowerCase, titleCase } from "@/lib/utils";
import states from "@/lib/states.json";
import { useDropdownStore } from "@/lib/store/dropdown";

import { type StateProps } from "@/lib/types";

interface StateDropdownProps {
	onChange: (value: string) => void;
	value: string;
	countryValue: string;
}

const StateDropdown = ({
	onChange,
	value,
	countryValue,
}: StateDropdownProps): React.JSX.Element => {
	const { openStateDropdown, setOpenStateDropdown } = useDropdownStore();

	const SD = states as StateProps[];
	const S = SD.filter(
		(state) => state.country_name === titleCase(countryValue),
	);

	return (
		<Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={openStateDropdown}
					className="h-[48px] w-full justify-between rounded-lg !border-[#E8E8E8] !bg-[#FCFCFD] text-base text-title hover:!text-title"
					disabled={!countryValue || S.length === 0}
				>
					{value ? (
						<div className="flex items-end gap-2">
							<span>
								{
									S.find(
										(state) =>
											lowerCase(state.name) ===
											lowerCase(value),
									)?.name
								}
							</span>
						</div>
					) : (
						<span>Select State...</span>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="PopoverContent rounded-[6px] border !border-[#E8E8E8] !bg-[#FCFCFD] p-0">
				<Command>
					<CommandInput placeholder="Search state..." />
					<CommandEmpty>No state found.</CommandEmpty>
					<CommandGroup>
						<ScrollArea className="h-[300px] w-full">
							{S.map((state) => (
								<CommandItem
									key={state.id}
									value={state.name}
									onSelect={(currentValue: string) => {
										// setStateValue(currentValue === lowerCase(state.name) ? currentValue : "");
										onChange(
											currentValue ===
												lowerCase(state.name)
												? currentValue
												: "",
										);
										setOpenStateDropdown(false);
									}}
									className="flex cursor-pointer items-center justify-between  text-sm hover:!bg-primary-brighter"
								>
									<div className="flex items-end gap-2">
										<span className="">{state.name}</span>
									</div>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === lowerCase(state.name)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default StateDropdown;
