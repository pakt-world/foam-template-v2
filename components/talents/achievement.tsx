type AchievementType = 'review' | 'referral' | 'five-star' | 'squad';

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
    title: 'Reviews',
    textColor: '#198155',
    borderColor: '#198155',

    innerBackgroundColor: '#F0FFF2',
    outerBackgroundColor: '#ECFCE5',

    barColor: '#D2FFBE',
    barIndicatorColor: '#7DDE86',
  },
  referral: {
    title: 'Referrals',
    textColor: '#0065D0',
    borderColor: '#0065D0',

    innerBackgroundColor: '#E1F5FF',
    outerBackgroundColor: '#C9F0FF',

    barColor: '#C0EEFF',
    barIndicatorColor: '#9BDCFD',
  },
  ['five-star']: {
    title: '5 Star Jobs',
    textColor: '#287B7B',
    borderColor: '#287B7B',

    innerBackgroundColor: '#E0F5F5',
    outerBackgroundColor: '#F0FAFA',

    barColor: '#B5E3E3',
    barIndicatorColor: '#487E7E',
  },
  squad: {
    title: 'Squad',
    textColor: '#5538EE',
    borderColor: '#5538EE',

    innerBackgroundColor: '#F0EFFF',
    outerBackgroundColor: '#E7E7FF)',

    barColor: '#E0E0FF',
    barIndicatorColor: '#C6C4FF',
  },
};

interface AchievementBarProps {
  achievement: Achievement;
}

const AchievementBar: React.FC<AchievementBarProps> = ({ achievement }) => {
  const styles = ACHIEVEMENT_STYLES[achievement.type];
  const percentage = (achievement.value / achievement.maxValue) * 100;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className="p-2 rounded-3xl w-[100px]"
        style={{
          border: `2px solid ${styles.borderColor}`,
          backgroundColor: styles.outerBackgroundColor,
        }}
      >
        <div
          className="flex flex-col gap-2 justify-between items-center p-3 rounded-3xl"
          style={{
            color: styles.textColor,
            backgroundColor: styles.innerBackgroundColor,
          }}
        >
          <span className="text-2xl">
            {achievement.value}/{achievement.maxValue}
          </span>

          <div className="w-full h-5 rounded-full overflow-hidden" style={{ backgroundColor: styles.barColor }}>
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
      <span className="text-body text-lg">{styles.title}</span>
    </div>
  );
};

interface AchievementProps {
  achievements?: {
    title: string;
    type: string;
    value: number;
    total: number;
  }[];
}

export const Achievements: React.FC<AchievementProps> = ({ achievements = [] }) => {
  achievements.sort((a, b) => b.total - a.total);
  return (
    <div className="bg-primary-gradient p-[4px] rounded-2xl shrink-0">
      <div className="bg-[#F8FFF4] h-full py-4 px-6 rounded-xl gap-4 flex flex-col w-fit shrink-0 items-center">
        <h3 className="text-center text-title text-lg font-medium">Achievements</h3>
        <div className="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
                  type: 'review',
                  maxValue: 60,
                  minValue: 0,
                  value: 0,
                }}
              />
              <AchievementBar
                achievement={{
                  type: 'referral',
                  maxValue: 20,
                  minValue: 0,
                  value: 0,
                }}
              />
              <AchievementBar
                achievement={{
                  type: 'five-star',
                  maxValue: 10,
                  minValue: 0,
                  value: 0,
                }}
              />
              <AchievementBar
                achievement={{
                  type: 'squad',
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
