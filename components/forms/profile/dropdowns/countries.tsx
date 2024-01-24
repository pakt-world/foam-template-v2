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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/common/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover";

import { cn, lowerCase } from "@/lib/utils";
import countries from "@/lib/countries.json";

import { type CountryProps } from "@/lib/types";
import { useDropdownStore } from "@/lib/store/dropdown";

interface CountryDropdownProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    value: string;
}

const CountryDropdown = ({ disabled, onChange, value }: CountryDropdownProps): React.JSX.Element => {
    const { openCountryDropdown, setOpenCountryDropdown } = useDropdownStore();
    const C = countries as CountryProps[];
    return (
        <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCountryDropdown}
                    className="h-[48px] w-full justify-between rounded-lg !border-[#E8E8E8] !bg-[#FCFCFD] text-base text-title hover:!text-title"
                    disabled={disabled}
                >
                    <span>
                        {value ? (
                            <div className="flex items-end gap-2">
                                <span>
                                    {countries.find((country) => lowerCase(country.name) === lowerCase(value))?.emoji}
                                </span>
                                <span>
                                    {countries.find((country) => lowerCase(country.name) === lowerCase(value))?.name}
                                </span>
                            </div>
                        ) : (
                            <span>Select Country...</span>
                        )}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="PopoverContent rounded-[6px] border !border-[#E8E8E8] !bg-[#FCFCFD] p-0">
                <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-[300px] w-full">
                            {C.map((country) => (
                                <CommandItem
                                    key={country.id}
                                    value={country.name}
                                    onSelect={(currentValue: string) => {
                                        // setCountryValue(currentValue === lowerCase(country.name) ? currentValue : "");
                                        onChange(currentValue === lowerCase(country.name) ? currentValue : "");
                                        setOpenCountryDropdown(false);
                                    }}
                                    className="flex cursor-pointer items-center justify-between text-sm hover:!bg-primary-brighter"
                                >
                                    <div className="flex items-end gap-2">
                                        <span>{country.emoji}</span>
                                        <span className="">{country.name}</span>
                                    </div>
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === lowerCase(country.name) ? "opacity-100" : "opacity-0",
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

export default CountryDropdown;
