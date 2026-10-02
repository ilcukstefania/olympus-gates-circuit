import React from 'react';
import { Circle, G, Path } from 'react-native-svg';

import { CHANNEL_COLORS } from '../constants/theme';
import type { Channel } from '../game/types';

interface Props {
  channel: Channel;
  w: number;
  h: number;
}

/** Emitter core. Drawn inside the rune's own SVG canvas. */
export function SourceGlyph({ channel, w, h }: Props) {
  const color = CHANNEL_COLORS[channel];
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.22;

  return (
    <G>
      <Circle cx={cx} cy={cy} r={r + 6} fill={color} opacity={0.18} />
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#0C1130"
        stroke={color}
        strokeWidth={2.5}
      />
      <Path
        d={`M ${cx + 1.5} ${cy - r * 0.62} L ${cx - r * 0.42} ${cy + 1} L ${cx + 0.5} ${cy + 1} L ${cx - 1.5} ${cy + r * 0.66} L ${cx + r * 0.46} ${cy - 1.5} L ${cx - 0.5} ${cy - 1.5} Z`}
        fill={color}
      />
    </G>
  );
}

export default SourceGlyph;
