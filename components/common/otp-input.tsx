/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import ReactOtpInput from "react-otp-input";

interface OtpInputProps {
    value: string;
    numInputs: number;
    onChange: (otp: string) => void;
}

export const OtpInput: FC<OtpInputProps> = ({ numInputs, onChange, value, ...props }) => {
    return (
        <ReactOtpInput
            numInputs={numInputs}
            onChange={onChange}
            value={value}
            containerStyle="gap-4 flex"
            inputStyle={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid #D0DDD5",
            }}
            renderInput={(inputProps) => {
                return (
                    <input
                        {...inputProps}
                        className="text-center text-base outline-none"
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "10px",
                            border: "1px solid #E0E0E0",
                            background: "#F5F5F5",
                        }}
                    />
                );
            }}
            {...props}
        />
    );
};

OtpInput.displayName = "OtpInput";
