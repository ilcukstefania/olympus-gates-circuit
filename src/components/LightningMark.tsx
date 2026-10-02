import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size: number;
  color: string;
  glow?: string;
}

/**
 * Bolt glyph with a wide low-opacity duplicate underneath — that glow pair is
 * the signature "electricity" treatment used across every screen.
 */
export function LightningMark({ size, color, glow }: Props) {
  const d = 'M13.4 2 L4.6 13.4 H10.6 L9.8 22 L19.4 10.2 H12.6 Z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={d}
        stroke={glow || color}
        strokeWidth={5}
        strokeLinejoin="round"
        opacity={0.25}
        fill="none"
      />
      <Path d={d} fill={color} stroke={color} strokeWidth={1} />
    </Svg>
  );
}

export default LightningMark;
