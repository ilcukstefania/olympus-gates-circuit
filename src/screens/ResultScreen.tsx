import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Rect } from 'react-native-svg';
import { RotateCcw } from 'lucide-react-native';

import AuroraBackdrop from '../components/AuroraBackdrop';
import LightningMark from '../components/LightningMark';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StarRow from '../components/StarRow';
import StatCard from '../components/StatCard';
import { MAX_ISLANDS } from '../constants/config';
import theme, { CHANNEL_COLORS } from '../constants/theme';
import type { RoundResult } from '../game/types';

interface Props {
  island: number;
  result: RoundResult;
  onPlayAgain: () => void;
  onMenu: () => void;
}

const NODES = [
  { x: 48, cKey: 'cyan' as const },
  { x: 150, cKey: 'gold' as const },
  { x: 252, cKey: 'violet' as const },
];

function CircuitPanel({ win, beacons }: { win: boolean; beacons: number }) {
  return (
    <Svg width={300} height={150}>
      <Rect
        x={2}
        y={2}
        width={296}
        height={146}
        rx={18}
        fill="rgba(9,13,36,0.55)"
        stroke="rgba(245,239,229,0.12)"
        strokeWidth={1.5}
      />
      {NODES.map((n, i) => {
        const on = i < beacons;
        const color = CHANNEL_COLORS[n.cKey];
        const next = NODES[i + 1];
        return (
          <G key={n.cKey}>
            {next ? (
              <Line
                x1={n.x}
                y1={96}
                x2={next.x}
                y2={96}
                stroke={on && i + 1 < beacons ? color : 'rgba(245,239,229,0.18)'}
                strokeWidth={5}
                strokeLinecap="round"
              />
            ) : null}
            <Line
              x1={n.x}
              y1={96}
              x2={n.x}
              y2={54}
              stroke={on ? color : 'rgba(245,239,229,0.18)'}
              strokeWidth={5}
              strokeLinecap="round"
            />
            {on ? (
              <Circle cx={n.x} cy={46} r={22} fill={color} opacity={0.2} />
            ) : null}
            <Circle
              cx={n.x}
              cy={46}
              r={13}
              fill={on ? color : '#141A3C'}
              stroke={on ? color : 'rgba(245,239,229,0.3)'}
              strokeWidth={2.5}
            />
            <Circle
              cx={n.x}
              cy={110}
              r={6}
              fill={win ? color : 'rgba(245,239,229,0.25)'}
            />
          </G>
        );
      })}
    </Svg>
  );
}

export function ResultScreen({ island, result, onPlayAgain, onMenu }: Props) {
  const win = result.win;
  const headline = win ? 'CIRCUIT LIVE' : 'CIRCUIT DOWN';
  const accent = win ? theme.colors.secondary : theme.colors.danger;
  const nextIsland = Math.min(MAX_ISLANDS, island + 1);

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant={win ? 'win' : 'lose'} />

      <ScreenHeader
        title="RESULT"
        subtitle={`ISLAND ${island}`}
        subtitleColor={accent}
        onBack={onMenu}
      />

      <View style={styles.body}>
        <View style={styles.headlineRow}>
          <LightningMark size={28} color={accent} />
          <Text style={[styles.headline, { color: accent }]}>{headline}</Text>
          <LightningMark size={28} color={accent} />
        </View>

        <View style={styles.panel}>
          <CircuitPanel win={win} beacons={result.beacons} />
        </View>

        <StarRow earned={result.stars} />

        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatCard
              value={`${result.movesLeft}`}
              label="MOVES LEFT"
              accent={theme.colors.primary}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={`${result.beacons}/3`}
              label="BEACONS"
              accent={theme.colors.secondary}
            />
          </View>
        </View>

        <Text style={[styles.caption, win ? styles.captionWin : null]}>
          {win ? `ISLAND ${nextIsland} UNLOCKED` : 'TRY A DIFFERENT PATH'}
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="PLAY AGAIN"
          colors={theme.gradients.ctaReplay}
          Icon={RotateCcw}
          onPress={onPlayAgain}
          textColor={theme.colors.onAccent}
          shadowColor={theme.colors.primary}
        />
        <View style={styles.gap} />
        <SecondaryButton label="MENU" onPress={onMenu} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  headline: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: 'rgba(243,197,76,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  panel: {
    marginTop: 18,
    marginBottom: 20,
  },
  statsRow: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  statSlot: {
    flex: 1,
  },
  caption: {
    marginTop: 18,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(245,239,229,0.5)',
  },
  captionWin: {
    color: theme.colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  gap: {
    height: 12,
  },
});

export default ResultScreen;
