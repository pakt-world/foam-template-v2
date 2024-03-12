"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/";
import { BlazeCarousel, useBlazeSlider } from "../../../common/blazeCarousel";
import { type ReviewProps } from "./types";
import { Review } from "./item";

export const Reviews = ({
	reviews,
	loading,
}: {
	reviews: ReviewProps[];
	loading: boolean;
}): ReactElement => {
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
