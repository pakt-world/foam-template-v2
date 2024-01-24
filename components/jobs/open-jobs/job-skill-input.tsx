"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import technologyJson from "@/lib/technology.json";

interface SkillInputProps {
    onChange: (value: string) => void;
    value: string;
}

export const JobSkillInput = ({ onChange, value }: SkillInputProps): JSX.Element => {
    const [isOpened, setIsOpened] = useState(false);
    const [skillValue, setSkillValue] = useState("");
    const ref = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const COUNTRY_LIST: Array<{ label: string; value: string }> = (technologyJson || []).map((c) => ({
        label: c.name,
        value: c.name,
    }));

    // Filter with skillValue/inputValue
    const filteredCountryList = COUNTRY_LIST.filter((country) => {
        return country.label.toLowerCase().includes(skillValue.toLowerCase());
    });

    useEffect(() => {
        // Check if the input element exists
        if (inputRef.current) {
            // Event handler function
            const handleKeyDown = (event: KeyboardEvent): void => {
                if (filteredCountryList.length === 0) {
                    setIsOpened(false);
                }
                if (event.key === "Backspace") {
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
    }, [filteredCountryList, inputRef]);

    const handleClickOutside = (): void => {
        setIsOpened(false);
    };

    useOnClickOutside(ref, handleClickOutside);

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Java, Solidity, etc."
                className="h-11 w-full rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                onChange={(e) => {
                    onChange(e.target.value);
                    setSkillValue(e.target.value);
                }}
                onClick={() => {
                    setIsOpened(true);
                }}
                value={value}
                ref={inputRef}
            />
            {isOpened && (
                <div
                    className="absolute z-50 max-h-[200px] min-w-full translate-x-1 translate-y-2 gap-4 overflow-hidden overflow-y-auto rounded-lg border border-green-300 bg-white p-4 shadow"
                    ref={ref}
                >
                    {filteredCountryList.map(({ label, value: v }) => (
                        <div
                            key={v}
                            className="relative flex w-full cursor-pointer select-none items-center rounded p-2 text-base outline-none hover:bg-[#ECFCE5]"
                            onClick={() => {
                                onChange(label);
                                setIsOpened(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    onChange(label);
                                    setIsOpened(false);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                        >
                            {label}
                            {label === value && (
                                <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
