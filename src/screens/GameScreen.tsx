import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { bgGame } from '../assets';
import AuroraBackdrop from '../components/AuroraBackdrop';
import CoachOverlay from '../components/CoachOverlay';
import ControlBar from '../components/ControlBar';
import HexBoard from '../components/HexBoard';
import ScreenHeader from '../components/ScreenHeader';
import { GAME_AREA_BOTTOM_PAD, MAX_OVERLOADS } from '../constants/config';
import theme from '../constants/theme';
import type { RoundResult } from '../game/types';
import useIdleBackstop from '../hooks/useIdleBackstop';
import useRound from '../hooks/useRound';

interface Props {
  island: number;
  showCoach: boolean;
  onCoachSeen: () => void;
  onGameOver: (result: RoundResult) => void;
  onMenu: () => void;
}

const DOTS = [0, 1, 2];

export function GameScreen({
  island,
  showCoach,
  onCoachSeen,
  onGameOver,
  onMenu,
}: Props) {
  const round = useRound(island, onGameOver);
  const [coachOpen, setCoachOpen] = useState(showCoach);

  const { registerInput } = useIdleBackstop({
    active: true,
    onExpire: round.forceEnd,
    onSurge: round.surge,
  });

  const handleRotate = useCallback(
    (id: number) => {
      registerInput();
      round.rotate(id);
    },
    [registerInput, round],
  );

  const handleUndo = useCallback(() => {
    registerInput();
    round.undo();
  }, [registerInput, round]);

  const handleCharge = useCallback(() => {
    registerInput();
    round.charge();
  }, [registerInput, round]);

  const closeCoach = useCallback(() => {
    setCoachOpen(false);
    onCoachSeen();
  }, [onCoachSeen]);

  const lowMoves = round.moves <= 3;

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="game" image={bgGame} imageOpacity={0.3} />

      <ScreenHeader
        title={`ISLAND ${island}`}
        subtitle={`MOVES ${round.moves}`}
        subtitleColor={lowMoves ? theme.colors.danger : theme.colors.secondary}
        onBack={onMenu}
        rightSlot={
          <View style={styles.dots}>
            {DOTS.map(i => {
              const spent = i < Math.min(round.overloads, MAX_OVERLOADS);
              return (
                <View
                  key={i}
                  style={[styles.dot, spent ? styles.dotSpent : null]}
                />
              );
            })}
          </View>
        }
      />

      <View style={styles.area}>
        <HexBoard
          grid={round.grid}
          energized={round.energized}
          conflicts={round.conflicts}
          surgeId={round.surgeId}
          dimmed={round.phase === 'lose'}
          onRotate={handleRotate}
        />
      </View>

      <ControlBar
        undoLeft={round.undoLeft}
        lit={round.lit}
        onUndo={handleUndo}
        onCharge={handleCharge}
      />

      {coachOpen ? <CoachOverlay onDone={closeCoach} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: GAME_AREA_BOTTOM_PAD,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(245,239,229,0.18)',
  },
  dotSpent: {
    backgroundColor: theme.colors.danger,
    shadowColor: theme.colors.danger,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
});

export default GameScreen;
