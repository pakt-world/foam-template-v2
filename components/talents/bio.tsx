"use client";

export const Bio = ({ body }: { body: string }): JSX.Element => {
    return (
        <div className="rounded-4 flex w-[60%] grow flex-col gap-3 rounded-2xl border border-yellow-dark bg-[#FFEFD7] p-4">
            <h3 className="text-left text-2xl font-medium text-title">Bio</h3>
            <div>{body}</div>
        </div>
    );
};
