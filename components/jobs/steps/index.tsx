"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { StepIndicator } from "./step-indicator";

interface StepsProps {
    jobSteps: {
        details: boolean;
        skills: boolean;
        description: boolean;
        deliverables: boolean;
        classification: boolean;
    };
    isEdit?: boolean;
}

const Steps = ({ jobSteps, isEdit }: StepsProps): ReactElement => {
    return (
        <div className="flex h-fit flex-col gap-3 rounded-xl border border-line bg-white p-6">
            <h3 className="font-bold">Steps</h3>
            <StepIndicator isComplete={jobSteps.details}>Job Details</StepIndicator>
            <StepIndicator isComplete={jobSteps.skills}>Skills</StepIndicator>
            <StepIndicator isComplete={jobSteps.description}>Description</StepIndicator>
            <StepIndicator isComplete={jobSteps.deliverables}>Deliverables</StepIndicator>
            <StepIndicator isComplete={jobSteps.classification}>Classifications</StepIndicator>
            {isEdit && <StepIndicator isComplete={false}>Deposit Payment</StepIndicator>}
        </div>
    );
};

export default Steps;
