/**
 * OlympusGatesCircuit - state machine only (rule #2).
 * Plain useState + conditional render, no react-navigation.
 */
import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {GameScreen} from './src/screens/GameScreen';
import {LoaderScreen} from './src/screens/LoaderScreen';
import {MapScreen} from './src/screens/MapScreen';
import {MenuScreen} from './src/screens/MenuScreen';
import {ResultScreen} from './src/screens/ResultScreen';
import type {RoundSummary} from './src/screens/ResultScreen';
import {TutorialScreen} from './src/screens/TutorialScreen';
import {C} from './src/constants/theme';
import {ISLAND_COUNT, beaconCountOf, getLevel} from './src/game/levels';
import {firstPlayableIsland, recordWin, starsFor} from './src/game/scoring';
import type {Outcome} from './src/game/types';

type Screen = 'loader' | 'menu' | 'map' | 'tutorial' | 'game' | 'result';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [islandIndex, setIslandIndex] = useState(0);
  const [runToken, setRunToken] = useState(0);
  const [summary, setSummary] = useState<RoundSummary | null>(null);

  const startIsland = useCallback((index: number) => {
    setIslandIndex(Math.max(0, Math.min(ISLAND_COUNT - 1, index)));
    setRunToken(t => t + 1);
    setScreen('game');
  }, []);

  const handleLoaderDone = useCallback(() => setScreen('menu'), []);
  const goMenu = useCallback(() => setScreen('menu'), []);
  const goMap = useCallback(() => setScreen('map'), []);
  const goTutorial = useCallback(() => setScreen('tutorial'), []);

  // Menu CTA goes straight into the game with the first playable island.
  const handlePlay = useCallback(
    () => startIsland(firstPlayableIsland()),
    [startIsland],
  );

  const handleTutorialStart = useCallback(
    () => startIsland(firstPlayableIsland()),
    [startIsland],
  );

  const handleGameOver = useCallback(
    (outcome: Outcome, moves: number, beaconsLit: number, overloads: number) => {
      const level = getLevel(islandIndex);
      const stars = outcome === 'win' ? starsFor(moves, level.moveLimit) : 0;
      if (outcome === 'win') {
        recordWin(islandIndex, moves, stars);
      }
      setSummary({
        outcome,
        islandIndex,
        islandName: level.name,
        moves,
        moveLimit: level.moveLimit,
        beaconsLit,
        beaconCount: beaconCountOf(level),
        overloads,
        stars,
      });
      setScreen('result');
    },
    [islandIndex],
  );

  const handlePlayAgain = useCallback(
    () => startIsland(islandIndex),
    [startIsland, islandIndex],
  );

  const handleNextIsland = useCallback(
    () => startIsland(islandIndex + 1),
    [startIsland, islandIndex],
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {screen === 'loader' ? <LoaderScreen onDone={handleLoaderDone} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          onPlay={handlePlay}
          onMap={goMap}
          onTutorial={goTutorial}
        />
      ) : null}

      {screen === 'map' ? (
        <MapScreen onBack={goMenu} onStartIsland={startIsland} />
      ) : null}

      {screen === 'tutorial' ? (
        <TutorialScreen onBack={goMenu} onStart={handleTutorialStart} />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={islandIndex + '-' + runToken}
          level={getLevel(islandIndex)}
          onBack={goMenu}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'result' && summary ? (
        <ResultScreen
          summary={summary}
          onPlayAgain={handlePlayAgain}
          onNextIsland={handleNextIsland}
          onMap={goMap}
          onMenu={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.bgDeep},
});

export default App;
