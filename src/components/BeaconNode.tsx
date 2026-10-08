import React from 'react';
import {Circle, G, Polyline} from 'react-native-svg';

interface Props {
  cx: number;
  cy: number;
  size: number;
  colour: string;
  lit: boolean;
  conflicted: boolean;
}

const ROWS = [0.3, 0.0, -0.3];

/** Celestial beacon: a three-step chevron tower. Never rotates. */
function BeaconNodeBase({cx, cy, size, colour, lit, conflicted}: Props) {
  const s = size * 0.48;
  const stroke = conflicted
    ? '#E84A5F'
    : lit
    ? colour
    : 'rgba(245,239,229,0.30)';

  return (
    <G>
      {lit && !conflicted ? (
        <Circle cx={cx} cy={cy} r={size * 0.42} fill={colour} fillOpacity={0.16} />
      ) : null}
      {ROWS.map((y, i) => {
        const yy = cy + y * s;
        const pts = [
          cx - 0.34 * s + ',' + yy,
          cx + ',' + (yy - 0.24 * s),
          cx + 0.34 * s + ',' + yy,
        ].join(' ');
        return (
          <Polyline
            key={i}
            points={pts}
            stroke={stroke}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeOpacity={lit || conflicted ? 1 : 0.8}
          />
        );
      })}
      <Circle
        cx={cx}
        cy={cy + 0.44 * s}
        r={2.4}
        fill={stroke}
        fillOpacity={lit || conflicted ? 1 : 0.7}
      />
    </G>
  );
}

export const BeaconNode = React.memo(BeaconNodeBase);
