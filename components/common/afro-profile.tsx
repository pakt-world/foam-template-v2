import React from 'react';
import { arc } from 'd3-shape';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_TO_PX: Record<Size, number> = {
  sm: 60,
  md: 110,
  lg: 150,
  xl: 180,
};

interface AfroProfileProps {
  size: Size;
  score: number;
  children?: React.ReactNode;
}

const progressToColor = (progress: number) => {
  if (progress <= 24) {
    return '#fa0832';
  } else if (progress <= 49) {
    return '#ffbf04';
  } else if (progress <= 74) {
    return '#649ff9';
  } else {
    return '#17a753';
  }
};

export const AfroProfile: React.FC<AfroProfileProps> = ({ size, score = 63, children }) => {
  const id = React.useId();
  const sizeInPx = SIZE_TO_PX[size];
  const thickness = sizeInPx / 11;
  const knobRadius = thickness * 1.2;
  const radius = (sizeInPx - thickness) / 2;
  const progressAngle = (score / 100) * 2 * Math.PI;

  const bgArcGenerator = arc()
    .startAngle(0)
    .outerRadius(radius)
    .endAngle(2 * Math.PI)
    .innerRadius(radius - thickness);

  const progressArcGenerator = arc()
    .startAngle(0)
    .outerRadius(radius)
    .endAngle(progressAngle)
    .innerRadius(radius - thickness)
    .cornerRadius(666);

  // @ts-ignore
  const bgArcPath = bgArcGenerator();
  // @ts-ignore
  const progressArcPath = progressArcGenerator();

  // Add a knob to the progress arc
  const knobX = (radius - thickness / 2) * Math.cos(progressAngle - Math.PI / 2);
  const knobY = (radius - thickness / 2) * Math.sin(progressAngle - Math.PI / 2);
  return (
    <div className="relative flex items-center justify-center ">
      <div
        style={{
          inset: knobRadius,
          borderRadius: 999,
          position: 'absolute',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            borderRadius: '999px',
            overflow: 'hidden',
            backgroundColor: 'transparent',
          }}
        >
          {children}
        </div>
      </div>
      <svg
        width={sizeInPx + knobRadius}
        height={sizeInPx + knobRadius}
        viewBox={`0 0 ${sizeInPx + knobRadius} ${sizeInPx + knobRadius}`}
        style={{
          transform: 'rotate(180deg)',
        }}
      >
        <style type="text/css">
          {`
            .progress-gradient {
              background-image: conic-gradient(
                from 0deg at 50% 50%,
                #fc2533,
                #fc2533,
                #ffc005,
                #ffc005,
                #ffc005,
                #649ff9,
                #649ff9,
                #649ff9,
                #04a82a,
                #04a82a
              );
            }
          `}
        </style>

        <g transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}>
          <clipPath id={id}>
            <path
              d={progressArcPath}
              transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
            />
          </clipPath>
          <path d={bgArcPath} fill="#e3e5e5" />
        </g>
        <foreignObject
          x="0"
          y="0"
          width={sizeInPx + knobRadius}
          height={sizeInPx + knobRadius}
          clipPath={`url(#${id})`}
        >
          <div
            className="progress-gradient"
            style={{
              width: sizeInPx + knobRadius,
              height: sizeInPx + knobRadius,
              borderRadius: 999,
            }}
          />
        </foreignObject>
        <circle
          cx={knobX}
          cy={knobY}
          r={knobRadius}
          fill={progressToColor(score)}
          transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
        ></circle>

        <text
          x={knobX + (sizeInPx + knobRadius) / 2}
          y={knobY + (sizeInPx + knobRadius) / 2}
          dy=".3em"
          textAnchor="middle"
          fill="white"
          fontWeight={700}
          transform={`rotate(180, ${knobX + (sizeInPx + knobRadius) / 2}, ${knobY + (sizeInPx + knobRadius) / 2})`}
          fontSize={Math.round(sizeInPx / 10)}
        >
          {`${Math.round(score)}`}
        </text>
      </svg>
    </div>
  );
};