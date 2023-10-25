'use client';

import React from 'react';
import Rating from 'react-rating';
import { ArrowLeftCircle, ArrowRightCircle, Star } from 'lucide-react';
import { Spinner } from '@/components/common/';
import { AfroProfile } from '../common/afro-profile';
import { BlazeCarousel, useBlazeSlider } from '../common/blazeCarousel';
import { useUserState } from '@/lib/store/account';

interface ReviewProps {
  body: string;
  title: string;
  rating: number;
  user: {
    _id: string;
    name: string;
    title: string;
    afroScore: number;
    avatar: string;
  };
}

const Review: React.FC<ReviewProps> = ({ body, title, rating, user }) => {
  const { _id: loggedInUser } = useUserState();
  const MAX_LEN = 150;
  const navigateUrl = loggedInUser == user._id ? '/profile' : `/talents/${user?._id}`;
  return (
    <div
      className="bg-white min-h-full rounded-2xl p-4 flex flex-col gap-4 select-none cursor-grab w-full"
      style={{ maxWidth: '50%' }}
    >
      <div className="flex flex-col flex-1 max-w-[100%] gap-4 break-all" style={{ wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-word" }}>
        <h3 className="text-xl font-medium text-title">{title}</h3>
        <p className="text-base font-thin text-body max-w-fit">
          {body.length > MAX_LEN ? `${body.slice(0, 150)}...` : body}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex relative">
            <AfroProfile size="sm" score={user.afroScore} src={user?.avatar} url={navigateUrl} />
          </div>
          <div className="flex flex-col col-span-2 my-auto">
            <span className="text-sm text-title font-medium">{user.name}</span>
            <span className="text-sm text-body">{user.title}</span>
          </div>
        </div>
        {/* @ts-ignore */}
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

export const Reviews = ({ reviews, loading }: { reviews: ReviewProps[]; loading: boolean }) => {
  const sliderInstance = useBlazeSlider();

  const currentSlide = sliderInstance.currentSlide;
  const totalSlides = sliderInstance.totalSlides;

  return (
    <div className="bg-primary-gradient p-4 rounded-4 gap-1 w-full rounded-2xl basis-0">
      <div className="flex flex-row justify-between mb-4 w-full">
        <h3 className="text-white font-medium text-2xl">Reviews</h3>
        <div className="flex flex-row gap-2">
          <ArrowLeftCircle
            size={32}
            className={`cursor-pointer ${currentSlide === 0 ? 'text-body' : 'text-white'}`}
            onClick={() => sliderInstance.nextSlide()}
          />
          <ArrowRightCircle
            size={32}
            className={`cursor-pointer ${currentSlide === totalSlides ? 'text-body' : 'text-white'}`}
            onClick={() => sliderInstance.prevSlide()}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[307px] w-full text-white my-auto items-center justify-center z-20">
          <Spinner />
        </div>
      ) : (
        <div className="basis-0 relative h-full">
          {/* @ts-ignore */}
          <BlazeCarousel elRef={sliderInstance?.ref}>
            {reviews &&
              reviews.length > 0 &&
              reviews.map((_review, i) => (
                <Review key={i} title={_review.title} body={_review.body} rating={_review.rating} user={_review.user} />
              ))}
          </BlazeCarousel>

          {!reviews ||
            (reviews.length === 0 && (
              <div className="flex w-full text-white min-h-[207px] m-auto items-center">
                <p className="mx-auto">No Reviews</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
