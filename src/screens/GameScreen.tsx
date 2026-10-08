import React, {useCallback, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {CircuitBoard} from '../components/CircuitBoard';
import {FloatingControls} from '../components/FloatingControls';
import {IconButton} from '../components/IconButton';
import {MoveCounter} from '../components/MoveCounter';
import {OverloadPips} from '../components/OverloadPips';
import {ScreenBackground} from '../components/ScreenBackground';
import {ScreenHeader} from '../components/ScreenHeader';
import {GAME_AREA_BOTTOM_PAD} from '../constants/config';
import {C} from '../constants/theme';
import {useCircuit} from '../hooks/useCircuit';
import type {Level, Outcome} from '../game/types';

interface Props {
  level: Level;
  onBack: () => void;
  onGameOver: (outcome: Outcome, moves: number, beaconsLit: number, overloads: number) => void;
}

export function GameScreen({level, onBack, onGameOver}: Props) {
  // the round summary is read at game-over time, so it is kept in refs
  const litRef = useRef(0);
  const overRef = useRef(0);

  const handleOver = useCallback(
    (outcome: Outcome, moves: number) => {
      onGameOver(outcome, moves, litRef.current, overRef.current);
    },
    [onGameOver],
  );

  const game = useCircuit(level, handleOver);
  litRef.current = game.beaconsLit;
  overRef.current = game.overloads;

  const locked = game.phase !== 'playing';

  return (
    <ScreenBackground variant="game">
      <View style={styles.root}>
        <ScreenHeader
          title={level.name}
          subtitle={<MoveCounter used={game.movesUsed} limit={level.moveLimit} />}
          leftSlot={<IconButton Icon={ChevronLeft} onPress={onBack} size={40} />}
          rightSlot={<OverloadPips used={game.overloads} />}
        />

        <View style={styles.gameArea}>
          <Text
            style={[
              styles.status,
              game.solved ? styles.statusReady : styles.statusIdle,
            ]}>
            {game.solved
              ? 'CIRCUIT READY . PRESS CHARGE'
              : 'BEACONS ' + game.beaconsLit + ' / ' + game.beaconCount}
          </Text>

          <CircuitBoard
            cells={game.cells}
            energised={game.energised}
            conflicted={game.conflicted}
            litBeacons={game.litBeacons}
            shakeToken={game.shakeToken}
            dimmed={game.phase === 'over'}
            onRotate={game.rotate}
          />
        </View>

        <FloatingControls
          undosLeft={game.undosLeft}
          canUndo={game.movesUsed > 0}
          disabled={locked}
          onUndo={game.undo}
          onCharge={game.charge}
          onReset={game.reset}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: GAME_AREA_BOTTOM_PAD,
  },
  status: {
    marginBottom: 14,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  statusIdle: {color: C.textSecondary},
  statusReady: {color: C.accentSecondary},
});
