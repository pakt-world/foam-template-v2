"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import Rating from "react-rating";
import { ArrowLeftCircle, ArrowRightCircle, Star } from "lucide-react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/";
import { AfroProfile } from "../common/afro-profile";
import { BlazeCarousel, useBlazeSlider } from "../common/blazeCarousel";
import { useUserState } from "@/lib/store/account";
import { sentenceCase } from "@/lib/utils";

interface ReviewProps {
    body: string;
    title: string;
    rating: number;
    date: string | undefined;
    user: {
        _id: string | undefined;
        name: string;
        title: string;
        afroScore: number | undefined;
        avatar: string;
    };
}

const Review = ({ body, title, rating, user, date }: ReviewProps): ReactElement => {
    const { _id: loggedInUser } = useUserState();
    const MAX_LEN = 150;
    const navigateUrl = loggedInUser === user._id ? "/profile" : `/talents/${user?._id}`;
    return (
        <div
            className="flex min-h-full w-full cursor-grab select-none flex-col gap-4 rounded-2xl bg-white p-6"
            style={{ maxWidth: "50%" }}
        >
            <div
                className="flex max-w-[100%] flex-1 flex-col gap-4 break-all"
                style={{ wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-word" }}
            >
                <p className="text-xs leading-[18px] tracking-wide text-neutral-400">
                    {date && format(new Date(date), "dd MMM, yyyy")}
                </p>
                <h3 className="text-xl font-medium text-title">{title}</h3>
                <p className="max-w-fit text-base font-thin text-body">
                    {body.length > MAX_LEN ? `${body.slice(0, 150)}...` : body}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="grid grid-cols-3 gap-2">
                    <div className="relative flex">
                        <AfroProfile size="sm" score={user.afroScore as number} src={user?.avatar} url={navigateUrl} />
                    </div>
                    <div className="col-span-2 my-auto flex flex-col">
                        <span className="text-sm font-medium text-title">{user.name}</span>
                        <span className="text-sm text-body">{sentenceCase(user.title)}</span>
                    </div>
                </div>
                {/* @ts-expect-error --- Types Error */}
                <Rating
                    initialRating={rating}
                    fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
                    emptySymbol={<Star fill="transparent" color="#15D28E" />}
                    readonly
                />
            </div>
        </div>
    );
};

export const Reviews = ({ reviews, loading }: { reviews: ReviewProps[]; loading: boolean }): ReactElement => {
    const sliderInstance = useBlazeSlider();

    const { currentSlide } = sliderInstance;
    const { totalSlides } = sliderInstance;

    return (
        <div className="rounded-4 w-full basis-0 gap-1 rounded-2xl bg-primary-gradient p-6">
            <div className="mb-4 flex w-full flex-row justify-between">
                <h3 className="text-2xl font-medium text-white">Reviews</h3>
                <div className="flex flex-row gap-2">
                    <ArrowLeftCircle
                        size={32}
                        className={`cursor-pointer ${currentSlide === 0 ? "text-body" : "text-white"}`}
                        onClick={() => {
                            sliderInstance.nextSlide();
                        }}
                    />
                    <ArrowRightCircle
                        size={32}
                        className={`cursor-pointer ${currentSlide === totalSlides ? "text-body" : "text-white"}`}
                        onClick={() => {
                            sliderInstance.prevSlide();
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="z-20 my-auto flex min-h-[307px] w-full items-center justify-center text-white">
                    <Spinner />
                </div>
            ) : (
                <div className="relative h-full basis-0">
                    <BlazeCarousel elRef={sliderInstance?.ref}>
                        {reviews &&
                            reviews.length > 0 &&
                            reviews.map((_review, i) => (
                                <Review
                                    key={i}
                                    title={_review.title}
                                    body={_review.body}
                                    rating={_review.rating}
                                    user={_review.user}
                                    date={_review.date}
                                />
                            ))}
                    </BlazeCarousel>

                    {!reviews ||
                        (reviews.length === 0 && (
                            <div className="m-auto flex min-h-[207px] w-full items-center text-white">
                                <p className="mx-auto">No Reviews</p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};
