/**
 * OlympusGatesCircuit — hex-rotation circuit puzzle.
 * App.tsx is the state machine only; all gameplay lives in src/.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';

import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import ResultScreen from './src/screens/ResultScreen';
import { MAX_ISLANDS } from './src/constants/config';
import theme from './src/constants/theme';
import type { RoundResult } from './src/game/types';

type Screen = 'loader' | 'menu' | 'game' | 'result';

const EMPTY_RESULT: RoundResult = {
  win: false,
  stars: 0,
  movesLeft: 0,
  movesTotal: 20,
  beacons: 0,
  reason: 'OVERLOAD',
};

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [island, setIsland] = useState(1);
  const [roundKey, setRoundKey] = useState(0);
  const [islandsDone, setIslandsDone] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [bestStars, setBestStars] = useState(0);
  const [coachSeen, setCoachSeen] = useState(false);
  const [result, setResult] = useState<RoundResult>(EMPTY_RESULT);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setScreen(prev => (prev === 'game' || prev === 'result' ? 'menu' : prev));
      return true;
    });
    return () => sub.remove();
  }, []);

  const handleLoaderDone = useCallback(() => {
    setScreen('menu');
  }, []);

  const handlePlay = useCallback(() => {
    setRoundKey(k => k + 1);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback((r: RoundResult) => {
    setResult(r);
    if (r.win) {
      setIslandsDone(d => d + 1);
      setTotalStars(s => s + r.stars);
      setBestStars(b => (r.stars > b ? r.stars : b));
    }
    setScreen('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setIsland(cur => (result.win ? Math.min(MAX_ISLANDS, cur + 1) : cur));
    setRoundKey(k => k + 1);
    setScreen('game');
  }, [result.win]);

  const handleMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleCoachSeen = useCallback(() => {
    setCoachSeen(true);
  }, []);

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
          island={island}
          islandsDone={islandsDone}
          totalStars={totalStars}
          bestStars={bestStars}
          onPlay={handlePlay}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={`island-${island}-${roundKey}`}
          island={island}
          showCoach={!coachSeen}
          onCoachSeen={handleCoachSeen}
          onGameOver={handleGameOver}
          onMenu={handleMenu}
        />
      ) : null}

      {screen === 'result' ? (
        <ResultScreen
          island={island}
          result={result}
          onPlayAgain={handlePlayAgain}
          onMenu={handleMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});

export default App;
