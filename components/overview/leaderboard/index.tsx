"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetLeaderBoard } from "@/lib/api/dashboard";
import { Spinner } from "../../common";
import { RunnerUp } from "./runner-up";
import { FirstPlace } from "./first-place";
import { SecondPlace } from "./second-place";
import { ThirdPlace } from "./third-place";

export const LeaderBoard = (): ReactElement => {
	const {
		data: leaderboardData,
		isFetched,
		isFetching,
	} = useGetLeaderBoard();
	const leaderboard = (leaderboardData?.data ?? []).map((leader, i) => ({
		_id: leader?._id,
		name: `${leader?.firstName} ${leader?.lastName}`,
		image: leader?.profileImage?.url,
		score: leader?.score,
		position: i + 1,
	}));
	return (
		<div className="flex h-fit w-full shrink-0 flex-col gap-2 rounded-2xl bg-gradient-leaderboard py-2">
			<div className="text-center text-xl font-bold text-white">
				Leaderboard
			</div>

			<div className=" scrollbar-hide relative flex flex-col  gap-2 px-3 text-white">
				{!isFetched && isFetching && <Spinner />}
				{leaderboard.map((l, i) => {
					if (l.position === 1)
						return (
							<FirstPlace
								key={i}
								_id={l._id}
								name={l.name}
								score={l.score}
								avatar={l.image}
							/>
						);
					if (l.position === 2)
						return (
							<SecondPlace
								key={i}
								_id={l._id}
								name={l.name}
								score={l.score}
								avatar={l.image}
							/>
						);
					if (l.position === 3)
						return (
							<ThirdPlace
								key={i}
								_id={l._id}
								name={l.name}
								score={l.score}
								avatar={l.image}
							/>
						);
					return (
						<RunnerUp
							key={i}
							_id={l._id}
							name={l.name}
							score={l.score}
							place={`${l.position}th`}
							avatar={l.image}
						/>
					);
				})}
			</div>
		</div>
	);
};
