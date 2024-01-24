"use client";

type AchievementType = "review" | "referral" | "five-star" | "squad";

interface Achievement {
    value: number;
    maxValue: number;
    minValue: number;
    type: AchievementType;
}

type AchievementTypeMap = {
    [key in AchievementType]: {
        title: string;
        textColor: string;
        borderColor: string;
        barColor: string;
        barIndicatorColor: string;
        outerBackgroundColor: string;
        innerBackgroundColor: string;
    };
};

const ACHIEVEMENT_STYLES: AchievementTypeMap = {
    review: {
        title: "Reviews",
        textColor: "#198155",
        borderColor: "#198155",

        innerBackgroundColor: "#F0FFF2",
        outerBackgroundColor: "#ECFCE5",

        barColor: "#D2FFBE",
        barIndicatorColor: "#7DDE86",
    },
    referral: {
        title: "Referrals",
        textColor: "#0065D0",
        borderColor: "#0065D0",

        innerBackgroundColor: "#E1F5FF",
        outerBackgroundColor: "#C9F0FF",

        barColor: "#C0EEFF",
        barIndicatorColor: "#9BDCFD",
    },
    "five-star": {
        title: "5 Star Jobs",
        textColor: "#287B7B",
        borderColor: "#287B7B",

        innerBackgroundColor: "#E0F5F5",
        outerBackgroundColor: "#F0FAFA",

        barColor: "#B5E3E3",
        barIndicatorColor: "#487E7E",
    },
    squad: {
        title: "Squad",
        textColor: "#5538EE",
        borderColor: "#5538EE",

        innerBackgroundColor: "#F0EFFF",
        outerBackgroundColor: "#E7E7FF)",

        barColor: "#E0E0FF",
        barIndicatorColor: "#C6C4FF",
    },
};

interface AchievementBarProps {
    achievement: Achievement;
}

const AchievementBar = ({ achievement }: AchievementBarProps): JSX.Element => {
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

interface AchievementProps {
    achievements?: Array<{
        title: string;
        type: string;
        value: number;
        total: number;
    }>;
}

export const Achievements = ({ achievements = [] }: AchievementProps): JSX.Element => {
    achievements.sort((a, b) => b.total - a.total);
    return (
        <div className="shrink-0 rounded-2xl bg-primary-gradient p-[4px]">
            <div className="flex h-full w-fit shrink-0 flex-col items-center gap-4 rounded-xl bg-[#F8FFF4] px-6 py-4">
                <h3 className="text-center text-2xl font-medium text-title">Achievements</h3>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {achievements.length > 0 &&
                        achievements.map(({ total, type, value }) => {
                            return (
                                <AchievementBar
                                    key={type}
                                    achievement={{
                                        minValue: 0,
                                        value: Math.floor(value),
                                        maxValue: total,
                                        type: type as AchievementType,
                                    }}
                                />
                            );
                        })}
                    {achievements.length === 0 && (
                        <>
                            <AchievementBar
                                achievement={{
                                    type: "review",
                                    maxValue: 60,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                            <AchievementBar
                                achievement={{
                                    type: "referral",
                                    maxValue: 20,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                            <AchievementBar
                                achievement={{
                                    type: "five-star",
                                    maxValue: 10,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                            <AchievementBar
                                achievement={{
                                    type: "squad",
                                    maxValue: 10,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
