"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import type * as z from "zod";
import { type UseFormReturn } from "react-hook-form";
import { Mail, MapPin, Verified } from "lucide-react";
import { Select as SelectMain } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UploadAvatar } from "@/components/common/upload-avatar";
import { type editProfileFormSchema } from "@/lib/validations";
import { sentenceCase } from "@/lib/utils";

const ProfileStates = [
    { label: "Private", value: "true" },
    { label: "Public", value: "false" },
];

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface BasicInfoProps {
    form: UseFormReturn<EditProfileFormValues>;
    toggleUserProfile: (e: string) => void;
    refetchUser: () => void;
    userData: {
        firstName: string;
        lastName: string;
        title: string;
        bio: string;
        location: string;
        country: string;
        avatar: string;
        kycVerified: boolean;
        tags: string[];
        isPrivate: boolean;
        email: string;
    };
}

const BasicInfo = ({ userData, form, toggleUserProfile, refetchUser }: BasicInfoProps): ReactElement => {
    return (
        <div className="flex h-fit w-1/4 flex-col items-center rounded-lg bg-white">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex min-h-[27px] justify-end">
                    <span className="rounded-xl bg-success-lighter px-4 py-2 text-xs font-thin capitalize text-success">
                        {form.getValues().isPrivate ? "Private" : "Public"}
                    </span>
                </div>
                <div className="item-center mx-auto flex flex-col justify-center gap-2 text-center">
                    <UploadAvatar size={150} image={userData.avatar} onUploadComplete={refetchUser} />
                </div>
                <div className="flex flex-row items-center justify-center">
                    <p className="text-lg font-bold text-title">
                        {userData?.firstName} {userData?.lastName}
                    </p>
                    {userData?.kycVerified && <Verified className="ml-2" />}
                </div>
                <div className="flex flex-row items-center justify-center text-body">
                    <Mail className="mr-2" />
                    <p className="text-base font-thin text-body">{userData?.email}</p>
                </div>
                <div className="flex flex-row items-center justify-center text-body">
                    <MapPin className="mr-2" />
                    <p className="text-base font-thin text-body">
                        {sentenceCase(userData?.location)}, {sentenceCase(userData?.country)}
                    </p>
                </div>
                <div className="mt-4 flex flex-col">
                    <SelectMain
                        label="Profile Visibility"
                        options={ProfileStates}
                        onChange={(e: string) => {
                            toggleUserProfile(e);
                        }}
                        placeholder={form.getValues().isPrivate ? "Private" : "Public"}
                        className="!border-[#E8E8E8] !bg-[#FCFCFD] capitalize"
                    />
                    {/* <Select defaultValue={form.getValues().isPrivate ? 'Private' : 'Public'} onValueChange={(e: any) => toggleUserProfile(e)} className="!bg-[#FCFCFD] !border-[#E8E8E8] capitalize">
                  <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                    <SelectValue placeholder="Profile Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {ProfileStates.map(({ label, value }) => (
                      <SelectItem key={value} value={value} className="hover:bg-[#ECFCE5] rounded py-2">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                    <p className="my-4 text-sm text-body">
                        Your visibility settings determine if your profile is searchable.
                    </p>
                </div>
            </div>
            {/* <div className='flex flex-row w-full border-t-2 justify-between p-4'>
            <p className='text-title font-thin'>Deactivate Account</p>
            <Switch />
          </div> */}
        </div>
    );
};

export default BasicInfo;
