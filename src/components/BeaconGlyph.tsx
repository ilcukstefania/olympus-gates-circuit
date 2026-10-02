import React from 'react';
import { Circle, G, Path, Rect } from 'react-native-svg';

import { CHANNEL_COLORS } from '../constants/theme';
import type { Channel } from '../game/types';

interface Props {
  channel: Channel;
  lit: boolean;
  w: number;
  h: number;
}

/** Receiver column with a bowl on top. Drawn inside the rune's SVG canvas. */
export function BeaconGlyph({ channel, lit, w, h }: Props) {
  const color = CHANNEL_COLORS[channel];
  const idle = 'rgba(245,239,229,0.35)';
  const stroke = lit ? color : idle;
  const cx = w / 2;
  const cy = h / 2;
  const bowlW = Math.min(w, h) * 0.46;

  return (
    <G>
      {lit ? (
        <Circle cx={cx} cy={cy - 2} r={bowlW * 0.9} fill={color} opacity={0.2} />
      ) : null}
      <Rect
        x={cx - bowlW * 0.22}
        y={cy - 1}
        width={bowlW * 0.44}
        height={bowlW * 0.72}
        rx={2}
        fill="#0C1130"
        stroke={stroke}
        strokeWidth={2}
      />
      <Path
        d={`M ${cx - bowlW / 2} ${cy - bowlW * 0.42} L ${cx + bowlW / 2} ${cy - bowlW * 0.42} L ${cx + bowlW * 0.3} ${cy} L ${cx - bowlW * 0.3} ${cy} Z`}
        fill={lit ? color : '#141A3C'}
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {lit ? (
        <Circle cx={cx} cy={cy - bowlW * 0.46} r={3.5} fill="#F5EFE5" />
      ) : null}
    </G>
  );
}

export default BeaconGlyph;
