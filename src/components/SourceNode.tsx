import React from 'react';
import {Circle, G, Path} from 'react-native-svg';

interface Props {
  cx: number;
  cy: number;
  size: number;
  colour: string;
  live: boolean;
}

/** Titan source: filled core, outer ring and a lightning glyph. Never rotates. */
function SourceNodeBase({cx, cy, size, colour, live}: Props) {
  const r = size * 0.3;
  const s = size * 0.42;
  const d =
    'M ' +
    (cx + 0.18 * s) +
    ',' +
    (cy - 0.52 * s) +
    ' L ' +
    (cx - 0.26 * s) +
    ',' +
    (cy + 0.06 * s) +
    ' L ' +
    cx +
    ',' +
    (cy + 0.06 * s) +
    ' L ' +
    (cx - 0.16 * s) +
    ',' +
    (cy + 0.52 * s) +
    ' L ' +
    (cx + 0.3 * s) +
    ',' +
    (cy - 0.08 * s) +
    ' L ' +
    (cx + 0.04 * s) +
    ',' +
    (cy - 0.08 * s) +
    ' Z';

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill={colour}
        fillOpacity={live ? 0.95 : 0.6}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={r + 3}
        stroke={colour}
        strokeWidth={2.5}
        strokeOpacity={live ? 0.9 : 0.45}
        fill="none"
      />
      <Path d={d} fill="#04060F" fillOpacity={0.85} />
    </G>
  );
}

export const SourceNode = React.memo(SourceNodeBase);
