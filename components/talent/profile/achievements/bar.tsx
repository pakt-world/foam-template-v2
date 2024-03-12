/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ACHIEVEMENT_STYLES, type AchievementBarProps } from "./types";

export const AchievementBar = ({
	achievement,
}: AchievementBarProps): JSX.Element => {
	const styles = ACHIEVEMENT_STYLES[achievement.type];
	const percentage = (achievement.value / achievement.maxValue) * 100;

	return (
		<div className="flex flex-col items-center gap-2">
			<div
				className="w-[100px] rounded-3xl p-2"
				style={{
					border: `2px solid ${styles.borderColor}`,
					backgroundColor: styles.outerBackgroundColor,
				}}
			>
				<div
					className="flex flex-col items-center justify-between gap-2 rounded-3xl p-3"
					style={{
						color: styles.textColor,
						backgroundColor: styles.innerBackgroundColor,
					}}
				>
					<span className="text-2xl">
						{achievement.value}/{achievement.maxValue}
					</span>

					<div
						className="h-5 w-full overflow-hidden rounded-full"
						style={{ backgroundColor: styles.barColor }}
					>
						<div
							className="h-full rounded-full"
							style={{
								width: `${percentage}%`,
								backgroundColor: styles.barIndicatorColor,
							}}
						/>
					</div>
				</div>
			</div>
			<span className="text-lg text-body">{styles.title}</span>
		</div>
	);
};
