"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { Input } from "pakt-ui";

export const NumericInput = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}): React.JSX.Element => {
	const [inputValue, setInputValue] = useState(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value: v } = e.target;

		if (v.match(/^[0-9]*[.,]?[0-9]*$/)) {
			setInputValue(v);
			onChange(v);
		}
	};

	return (
		<Input
			type="text"
			label="Amount"
			autoCorrect="off"
			autoComplete="off"
			spellCheck="false"
			value={inputValue}
			onChange={handleChange}
		/>
	);
};
