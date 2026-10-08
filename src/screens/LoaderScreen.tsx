import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Polygon} from 'react-native-svg';
import {Zap} from 'lucide-react-native';
import {FADE_MS, LOADER_DURATION_MS} from '../constants/config';
import {C, THEME} from '../constants/theme';
import {hexPoints} from '../game/hexGrid';
import {useLoaderProgress} from '../hooks/useLoaderProgress';
import {ScreenBackground} from '../components/ScreenBackground';

interface Props {
  onDone: () => void;
}

const OUTER = 132;
const INNER = 76;
const BAR_W = 180;
const OUTER_HEX = hexPoints(OUTER, OUTER, 2);
const INNER_HEX = hexPoints(INNER, INNER, 2);

/**
 * Rule #14: the darkest screen in the app - no stat pills, no call-to-action
 * button and no photo sheet, so the pHash gate always sees Loader != Menu.
 */
export function LoaderScreen({onDone}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const subIn = useRef(new Animated.Value(0)).current;
  const emblem = useRef(new Animated.Value(0)).current;
  const spinOuter = useRef(new Animated.Value(0)).current;
  const spinInner = useRef(new Animated.Value(0)).current;
  const boltPulse = useRef(new Animated.Value(0)).current;
  const exiting = useRef(false);

  const finish = useCallback(() => {
    if (exiting.current) {
      return;
    }
    exiting.current = true;
    Animated.timing(fade, {
      toValue: 0,
      duration: FADE_MS,
      useNativeDriver: true,
    }).start(() => onDone());
  }, [fade, onDone]);

  const progress = useLoaderProgress(LOADER_DURATION_MS, BAR_W, finish);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {toValue: 1, duration: 420, useNativeDriver: true}),
      Animated.spring(emblem, {
        toValue: 1,
        tension: 46,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(350),
        Animated.timing(titleIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(650),
        Animated.timing(subIn, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fade, emblem, titleIn, subIn]);

  useEffect(() => {
    const a = Animated.loop(
      Animated.timing(spinOuter, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const b = Animated.loop(
      Animated.timing(spinInner, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const c = Animated.loop(
      Animated.sequence([
        Animated.timing(boltPulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(boltPulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    a.start();
    b.start();
    c.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, [spinOuter, spinInner, boltPulse]);

  return (
    <ScreenBackground variant="loader">
      {/* extra dark overlay so Loader is unmistakably darker than Menu */}
      <View pointerEvents="none" style={styles.dim} />
      <Animated.View pointerEvents="box-none" style={[styles.root, {opacity: fade}]}>
        <Animated.View
          pointerEvents="none"
          style={{
            transform: [
              {
                scale: emblem.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ],
          }}>
          <View style={styles.emblem}>
            <Animated.View
              pointerEvents="none"
              style={{
                transform: [
                  {
                    rotate: spinOuter.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}>
              <Svg width={OUTER} height={OUTER}>
                <Polygon
                  points={OUTER_HEX}
                  fill="rgba(57,199,255,0.06)"
                  stroke={C.accentPrimary}
                  strokeWidth={2}
                />
              </Svg>
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                styles.innerHex,
                {
                  transform: [
                    {
                      rotate: spinInner.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['360deg', '0deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <Svg width={INNER} height={INNER}>
                <Polygon
                  points={INNER_HEX}
                  fill="transparent"
                  stroke={C.accentSecondary}
                  strokeWidth={1.5}
                />
              </Svg>
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                styles.bolt,
                {
                  opacity: boltPulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.55, 1],
                  }),
                },
              ]}>
              <Zap size={38} color={C.accentSecondary} strokeWidth={2.4} />
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleIn,
              transform: [
                {
                  translateY: titleIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}>
          OLYMPUS GATES
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, {opacity: subIn}]}>
          C I R C U I T
        </Animated.Text>

        <View style={styles.track}>
          <Animated.View
            pointerEvents="none"
            style={[styles.fillWrap, {width: progress}]}>
            <LinearGradient
              colors={[...THEME.gradients.progress]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.fill}
            />
          </Animated.View>
        </View>

        <Text style={styles.caption}>CHARGING THE GATES</Text>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  dim: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,6,15,0.86)'},
  root: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emblem: {
    width: OUTER,
    height: OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerHex: {
    position: 'absolute',
    left: (OUTER - INNER) / 2,
    top: (OUTER - INNER) / 2,
  },
  bolt: {position: 'absolute', alignItems: 'center', justifyContent: 'center'},
  title: {
    marginTop: 34,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 5,
    color: C.textPrimary,
    textShadowColor: 'rgba(57,199,255,0.55)',
    textShadowRadius: 18,
    textShadowOffset: {width: 0, height: 0},
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 9,
    color: C.accentPrimary,
  },
  track: {
    marginTop: 22,
    width: BAR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(245,239,229,0.10)',
    overflow: 'hidden',
  },
  fillWrap: {height: 3, borderRadius: 2, overflow: 'hidden'},
  fill: {flex: 1},
  caption: {
    marginTop: 14,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 3,
    color: 'rgba(245,239,229,0.45)',
  },
});
