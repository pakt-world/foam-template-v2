"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import { CopyIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "pakt-ui";
import Lottie from "lottie-react";
import dayjs from "dayjs";
import { type z } from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import email from "@/lottiefiles/email.json";
import { TagInput2 } from "../../common/tag-input";
import { useGetReferral, useSendReferralInvite } from "@/lib/api/referral";
import { SideModal } from "../../common/side-modal";
import { Spinner } from "../../common";
import { CopyText } from "@/lib/utils";
import { referralSchema } from "@/lib/validations";
import RecentReferral from "./recent-referrals";

interface ReferralModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ReferralDataProps {
    referral: {
        _id: string;
        firstName: string;
        lastName: string;
        profile: { bio: { title: string } };
        score: number;
        profileImage: { url: string };
    };
    createdAt: string | number | Date | dayjs.Dayjs | null | undefined;
}

type LoginFormValues = z.infer<typeof referralSchema>;

export function ReferralSideModal({ isOpen, onOpenChange }: ReferralModalProps): React.ReactElement {
    const [isSentEmail, setIsSentEmail] = useState(false);
    const { data } = useGetReferral({ page: 1, limit: 5, filter: {} });
    const sendInvite = useSendReferralInvite();

    const referralLink = data?.stats.referralLink;
    const remainingInvites = (data?.stats?.totalAllowedInvites ?? 0) - (data?.stats?.inviteSent ?? 0);
    const inviteDuration = data?.stats?.duration ?? "week";

    const recentReferrals = useMemo(
        () =>
            (data?.referrals?.data ?? []).map((u: ReferralDataProps) => ({
                _id: u?.referral?._id ?? "",
                name: `${u?.referral?.firstName} ${u?.referral?.lastName}` ?? "",
                title: u?.referral?.profile?.bio?.title ?? "",
                score: u?.referral?.score,
                image: u?.referral?.profileImage?.url,
                dated: dayjs(u?.createdAt).format("DD/MM/YYYY"),
            })),
        [data],
    );

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(referralSchema),
    });

    const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
        const d = await sendInvite.mutateAsync(values);
        if (d) {
            setIsSentEmail(true);
        }
        form.resetField("emails");
    };

    const copyLink = async (): Promise<void> => CopyText(String(referralLink));

    return (
        <SideModal isOpen={isOpen} onOpenChange={onOpenChange} className="flex flex-col">
            <div className="flex flex-row gap-4 bg-primary-gradient p-6 text-2xl font-bold text-white">
                {/* <ChevronLeft
          size={32}
          className="cursor-pointer"
          onClick={() => (isSentEmail ? setIsSentEmail(false) : onOpenChange(false))}
        />{' '} */}
                Refer User
            </div>
            {!isSentEmail ? (
                <div className="flex flex-col gap-2 p-6">
                    <h3 className="text-2xl font-semibold">Invite your friends, increase your Afroscore</h3>
                    <p className="text-base">
                        You can invite up to {remainingInvites} people per {inviteDuration}.
                    </p>
                    <div className="my-4 w-full rounded-2xl border border-primary-darker bg-primary-brighter p-4">
                        <h3 className="text-lg font-bold">Email Invite</h3>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="relative my-4 flex w-full flex-col">
                            <div className="rounded-2xl border bg-input-bg p-1">
                                <Controller
                                    name="emails"
                                    control={form.control}
                                    render={({ field: { onChange, value = [] } }) => (
                                        <TagInput2
                                            tags={value}
                                            setTags={onChange}
                                            className="items-start border border-none"
                                            placeholder="Send invite email to friends"
                                        />
                                    )}
                                />
                            </div>
                            <div className="mr-0 mt-4 flex w-full ">
                                <Button
                                    className="min-h-[50px]"
                                    variant="primary"
                                    disabled={!form.formState.isValid || sendInvite.isLoading}
                                    fullWidth
                                >
                                    {sendInvite.isLoading ? <Spinner /> : "Send"}
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute top-2 -z-10 w-full border" />
                        <div className="z-20 mx-auto w-24 bg-white text-center font-bold text-body">OR</div>
                    </div>
                    <div className="my-4">
                        <h3 className="text-lg font-bold">Referral Link</h3>
                        <div className="relative my-4 w-full">
                            <div className="my-auto min-h-[51px] items-center rounded-xl border p-4 text-sm">
                                {referralLink}
                            </div>
                            <div className="absolute -right-1 top-0 h-full">
                                <Button
                                    size="sm"
                                    className="min-h-full items-center !border-primary-darker text-sm"
                                    variant="secondary"
                                    onClick={copyLink}
                                >
                                    <span className="flex flex-row gap-2">
                                        <CopyIcon size={15} /> Copy
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-bold">Recently Referred</h3>
                        <p className="text-base font-thin">Your referrals that joined the Platform</p>
                        <div className="my-4 flex flex-col gap-2">
                            {recentReferrals.length > 0 &&
                                recentReferrals.map(
                                    (
                                        r: {
                                            _id: string;
                                            name: string;
                                            title: string;
                                            score: number;
                                            image: string;
                                            dated: string;
                                        },
                                        i: number,
                                    ) => <RecentReferral key={i} referral={r} />,
                                )}
                            {recentReferrals.length === 0 && (
                                <div className="flex min-h-[139px] items-center rounded-2xl bg-sky-lighter p-4">
                                    <p className="m-auto text-base text-body">Talents you refer will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full flex-col p-10 text-center">
                    <Lottie animationData={email} loop={false} />
                    <p className="mb-8 text-base text-body">
                        Your Invite has been sent. You’ll be notified when a user signs up with your referral link
                    </p>
                    <div className="mx-auto w-1/2">
                        <Button
                            variant="primary"
                            onClick={() => {
                                setIsSentEmail(false);
                            }}
                            fullWidth
                        >
                            Done
                        </Button>
                    </div>
                </div>
            )}
        </SideModal>
    );
}
