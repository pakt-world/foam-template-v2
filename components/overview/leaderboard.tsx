import React from 'react';
import Image from 'next/image';
import { useGetLeaderBoard } from '@/lib/api/dashboard';
import { AfroProfile } from '../common/afro-profile';
import { Spinner } from '../common';
import { truncate } from '@/lib/utils';

export const LeaderBoard = () => {
  const { data: leaderboardData, isFetched, isFetching } = useGetLeaderBoard();
  const leaderboard = (leaderboardData?.data || []).map((leader, i) => ({
    _id: leader?._id,
    name: `${leader?.firstName} ${leader?.lastName}`,
    image: leader?.profileImage?.url,
    score: leader?.score,
    position: i + 1,
  }));
  return (
    <div className="flex flex-col h-fit w-full min-h-[450px] gap-2 bg-gradient-leaderboard rounded-2xl py-4">
      <div className="text-xl font-bold text-center text-white">Leaderboard</div>

      <div className=" text-white px-3 flex flex-col  relative gap-2 overflow-y-auto scrollbar-hide">
        {!isFetched && isFetching && <Spinner />}
        {leaderboard.map((l, i) => {
          if (l.position == 1) return <FirstPlace key={i} _id={l._id} name={l.name} score={l.score} avatar={l.image} />;
          if (l.position == 2) return <SecondPlace key={i} _id={l._id} name={l.name} score={l.score} avatar={l.image} />;
          if (l.position == 3) return <ThirdPlace key={i} _id={l._id} name={l.name} score={l.score} avatar={l.image} />;
          return <RunnerUp key={i} _id={l._id} name={l.name} score={l.score} place={`${l.position}th`} avatar={l.image} />;
        })}
      </div>
    </div>
  );
};

interface LeaderBoardItemProps {
  _id: string;
  name: string;
  score: number;
  avatar?: string;
  place?: string;
}

const FirstPlace: React.FC<LeaderBoardItemProps> = ({ _id, name, score, avatar }) => {
  return (
    <div className="relative">
      <svg fill="none" preserveAspectRatio="xMaxYMid meet" viewBox="0 0 247 68">
        <path
          fill="url(#paint0_linear_4642_135011)"
          d="M246.5 18.755v31.49c0 7.796-5.8 14.238-13.556 14.738C216.244 66.06 182.83 67.5 123.5 67.5c-59.33 0-92.744-1.44-109.444-2.517C6.3 64.483.5 58.04.5 50.245v-31.49C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465z"
        ></path>
        <path
          fill="#000"
          fillOpacity="0.2"
          d="M246.5 18.755v31.49c0 7.796-5.8 14.238-13.556 14.738C216.244 66.06 182.83 67.5 123.5 67.5c-59.33 0-92.744-1.44-109.444-2.517C6.3 64.483.5 58.04.5 50.245v-31.49C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465z"
        ></path>
        <path
          stroke="url(#paint1_linear_4642_135011)"
          d="M246.5 18.755v31.49c0 7.796-5.8 14.238-13.556 14.738C216.244 66.06 182.83 67.5 123.5 67.5c-59.33 0-92.744-1.44-109.444-2.517C6.3 64.483.5 58.04.5 50.245v-31.49C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465z"
        ></path>
        <defs>
          <linearGradient
            id="paint0_linear_4642_135011"
            x1="0"
            x2="33.857"
            y1="0"
            y2="124.816"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFC462"></stop>
            <stop offset="1" stopColor="#A05E03"></stop>
          </linearGradient>
          <linearGradient
            id="paint1_linear_4642_135011"
            x1="0"
            x2="34.803"
            y1="0"
            y2="126.418"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFC462"></stop>
            <stop offset="1" stopColor="#A05E03"></stop>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 gap-2 flex items-center p-3 pl-1">
        <AfroProfile src={avatar} score={Math.round(score)} size="sm" url={`talents/${_id}`} />
        <div className="grow">
          <span className="text-[#ECFCE5] text-base">{truncate(name, 15)}</span>
          <div className="flex gap-2 justify-between items-center">
            <span className="text-sm text-[#F2F4F5]">Afroscore: {Math.round(score)}</span>
            <Image src="/icons/medal-1.png" width={28} height={28} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SecondPlace: React.FC<LeaderBoardItemProps> = ({ _id, name, score, avatar }) => {
  return (
    <div className="relative">
      <svg preserveAspectRatio="xMaxYMid meet" viewBox="0 0 247 67" fill="none">
        <path
          d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
          fill="url(#paint0_linear_4642_135026)"
        />
        <path
          d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
          fill="black"
          fillOpacity="0.2"
        />
        <path
          d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
          fill="black"
          fillOpacity="0.2"
        />
        <path
          d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
          stroke="url(#paint1_linear_4642_135026)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_4642_135026"
            x1="9.04763"
            y1="65.319"
            x2="22.8825"
            y2="-19.2415"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BBD2C5" />
            <stop offset="1" stopColor="#536976" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_4642_135026"
            x1="9.04763"
            y1="65.319"
            x2="22.8825"
            y2="-19.2415"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BBD2C5" />
            <stop offset="1" stopColor="#536976" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 gap-2 flex items-center p-3 pl-1">
        <AfroProfile src={avatar} score={Math.round(score)} size="sm" url={`talents/${_id}`} />
        <div className="grow">
          <span className="text-[#ECFCE5] text-base">{truncate(name, 15)}</span>
          <div className="flex gap-2 justify-between items-center">
            <span className="text-sm text-[#F2F4F5]">Afroscore: {Math.round(score)}</span>
            <Image src="/icons/medal-2.png" width={28} height={28} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ThirdPlace: React.FC<LeaderBoardItemProps> = ({ _id, name, score, avatar }) => {
  return (
    <div className="relative">
      <svg fill="none" preserveAspectRatio="xMaxYMid meet" viewBox="0 0 247 67">
        <path
          fill="url(#paint0_linear_4642_135039)"
          d="M.5 18.755C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465v30.993c0 8-6.076 14.572-14.05 14.942-16.867.782-50.207 1.81-108.95 1.81s-92.083-1.028-108.95-1.81C6.576 64.32.5 57.75.5 49.748V18.755z"
        ></path>
        <path
          fill="#000"
          fillOpacity="0.2"
          d="M.5 18.755C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465v30.993c0 8-6.076 14.572-14.05 14.942-16.867.782-50.207 1.81-108.95 1.81s-92.083-1.028-108.95-1.81C6.576 64.32.5 57.75.5 49.748V18.755z"
        ></path>
        <path
          stroke="url(#paint1_linear_4642_135039)"
          d="M.5 18.755C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465v30.993c0 8-6.076 14.572-14.05 14.942-16.867.782-50.207 1.81-108.95 1.81s-92.083-1.028-108.95-1.81C6.576 64.32.5 57.75.5 49.748V18.755z"
        ></path>
        <defs>
          <linearGradient
            id="paint0_linear_4642_135039"
            x1="9.048"
            x2="174"
            y1="65.319"
            y2="-76"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#055A60"></stop>
            <stop offset="1" stopColor="#1F3439"></stop>
          </linearGradient>
          <linearGradient
            id="paint1_linear_4642_135039"
            x1="9.048"
            x2="22.883"
            y1="65.319"
            y2="-19.241"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1F3439"></stop>
            <stop offset="1" stopColor="#066066"></stop>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 gap-2 flex items-center p-3 pl-1">
        <AfroProfile src={avatar} score={Math.round(score)} size="sm" url={`talents/${_id}`} />
        <div className="grow">
          <span className="text-[#ECFCE5] text-base">{truncate(name, 15)}</span>
          <div className="flex gap-2 justify-between items-center">
            <span className="text-sm text-[#F2F4F5]">Afroscore: {Math.round(score)}</span>
            <Image src="/icons/medal-3.png" width={28} height={28} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RunnerUp: React.FC<LeaderBoardItemProps> = ({ _id, name, score, avatar, place }) => {
  return (
    <div className="relative">
      <svg fill="none" preserveAspectRatio="xMaxYMid meet" viewBox="0 0 247 62">
        <path
          fill="#007C5B"
          d="M0 16.468C0 7.585 7.198.402 16.08.463 43.22.65 97.673 1 123.5 1c25.828 0 80.281-.35 107.419-.537C239.802.403 247 7.585 247 16.468V45.42c0 8.797-7.076 15.936-15.873 15.962-17.277.052-50.402.118-107.627.118-57.225 0-90.35-.066-107.627-.118C7.076 61.356 0 54.217 0 45.42V16.468z"
        ></path>
      </svg>
      <div className="absolute inset-0 gap-2 flex items-center p-3 pl-1">
        <AfroProfile src={avatar} score={Math.round(score)} size="sm" url={`talents/${_id}`} />
        <div className="grow">
          <span className="text-[#ECFCE5] text-base ">{truncate(name, 15)}</span>
          <div className="flex gap-2 justify-between items-center">
            <span className="text-sm text-[#F2F4F5]">Afroscore: {Math.round(score)}</span>
            <span className="text-sm text-[#CDCFD0]">{place}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
