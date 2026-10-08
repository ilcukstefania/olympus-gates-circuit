import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Circle, Line, Polygon} from 'react-native-svg';
import {ChevronLeft, ChevronRight, Zap} from 'lucide-react-native';
import {IconButton} from '../components/IconButton';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenBackground} from '../components/ScreenBackground';
import {ScreenHeader} from '../components/ScreenHeader';
import {SecondaryButton} from '../components/SecondaryButton';
import {ROTATE_SPRING} from '../constants/config';
import {C, THEME} from '../constants/theme';
import {hexPoints, portPoint} from '../game/hexGrid';

interface Props {
  onBack: () => void;
  onStart: () => void;
}

const STEPS = [
  'TAP A RUNE TO ROTATE IT 60 DEGREES. EVERY TAP COSTS ONE MOVE.',
  'LINK EACH TITAN SOURCE TO A BEACON OF THE SAME COLOUR. TWO COLOURS IN ONE CONDUIT MEANS AN OVERLOAD.',
  'PRESS CHARGE WHEN THE CIRCUIT IS READY. THREE OVERLOADS AND THE GATES CLOSE.',
];

const SIZE = 72;
const H = Math.round(SIZE * 1.1547);
const HEX = hexPoints(SIZE, H, 2);
const CX = SIZE / 2;
const CY = H / 2;
const CYAN = THEME.conduit.cyan;

/** The live demo rune: the player really rotates it and sees the conduit swing. */
function DemoRune({
  rotation,
  live,
  onPress,
}: {
  rotation: number;
  live: boolean;
  onPress: () => void;
}) {
  const deg = useRef(new Animated.Value(0)).current;
  const total = useRef(0);
  const last = useRef(rotation);

  useEffect(() => {
    if (rotation === last.current) {
      return;
    }
    total.current += 60;
    last.current = rotation;
    Animated.spring(deg, {
      toValue: total.current,
      ...ROTATE_SPRING,
      useNativeDriver: true,
    }).start();
  }, [rotation, deg]);

  const ports = [4, 1];

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{top: 8, bottom: 8, left: 4, right: 4}}
      style={[styles.demoCell, {width: SIZE, height: H}]}>
      <Animated.View
        pointerEvents="box-none"
        style={{
          width: SIZE,
          height: H,
          transform: [
            {
              rotate: deg.interpolate({
                inputRange: [-3600, 3600],
                outputRange: ['-3600deg', '3600deg'],
              }),
            },
          ],
        }}>
        <Svg width={SIZE} height={H}>
          <Polygon
            points={HEX}
            fill="rgba(28,36,80,0.92)"
            stroke={live ? CYAN : 'rgba(245,239,229,0.14)'}
            strokeWidth={live ? 1.8 : 1}
          />
          {ports.map(p => {
            const pt = portPoint(p, SIZE, H, 5);
            return (
              <Line
                key={p}
                x1={CX}
                y1={CY}
                x2={pt.x}
                y2={pt.y}
                stroke={CYAN}
                strokeOpacity={live ? 1 : 0.34}
                strokeWidth={6}
                strokeLinecap="round"
              />
            );
          })}
          <Circle cx={CX} cy={CY} r={live ? 6 : 4.5} fill={CYAN} fillOpacity={live ? 1 : 0.45} />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

function DemoEndpoint({kind, live}: {kind: 'source' | 'beacon'; live: boolean}) {
  const port = kind === 'source' ? 1 : 4;
  const pt = portPoint(port, SIZE, H, 5);
  return (
    <View style={[styles.demoCell, {width: SIZE, height: H}]}>
      <Svg width={SIZE} height={H}>
        <Polygon
          points={HEX}
          fill="rgba(28,36,80,0.92)"
          stroke={live ? CYAN : 'rgba(245,239,229,0.14)'}
          strokeWidth={live ? 1.8 : 1}
        />
        <Line
          x1={CX}
          y1={CY}
          x2={pt.x}
          y2={pt.y}
          stroke={CYAN}
          strokeOpacity={live ? 1 : 0.34}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {kind === 'source' ? (
          <Circle cx={CX} cy={CY} r={13} fill={CYAN} fillOpacity={0.9} />
        ) : (
          <Circle
            cx={CX}
            cy={CY}
            r={13}
            fill={live ? CYAN : 'transparent'}
            fillOpacity={live ? 0.9 : 0}
            stroke={live ? CYAN : 'rgba(245,239,229,0.4)'}
            strokeWidth={2.6}
          />
        )}
      </Svg>
    </View>
  );
}

export function TutorialScreen({onBack, onStart}: Props) {
  const [step, setStep] = useState(0);
  const [rotation, setRotation] = useState(1);
  const fade = useRef(new Animated.Value(1)).current;

  // base ports [4,1] are symmetric under +3, so rotation 0 and 3 both connect
  const connected = useMemo(() => rotation % 3 === 0, [rotation]);

  const rotate = useCallback(() => setRotation(r => (r + 1) % 6), []);

  const next = useCallback(() => {
    Animated.sequence([
      Animated.timing(fade, {toValue: 0, duration: 110, useNativeDriver: true}),
      Animated.timing(fade, {toValue: 1, duration: 220, useNativeDriver: true}),
    ]).start();
    setStep(s => (s + 1) % STEPS.length);
  }, [fade]);

  return (
    <ScreenBackground variant="tutorial">
      <View style={styles.root}>
        <ScreenHeader
          title="HOW TO PLAY"
          leftSlot={<IconButton Icon={ChevronLeft} onPress={onBack} size={40} />}
          rightSlot={
            <Text style={styles.counter}>{step + 1 + ' / ' + STEPS.length}</Text>
          }
        />

        <View style={styles.demoArea}>
          <View style={styles.demoRow}>
            <DemoEndpoint kind="source" live />
            <DemoRune rotation={rotation} live={connected} onPress={rotate} />
            <DemoEndpoint kind="beacon" live={connected} />
          </View>
          <Text style={styles.demoHint}>
            {connected ? 'CIRCUIT LINKED . BEACON LIT' : 'TAP THE MIDDLE RUNE'}
          </Text>
        </View>

        <Animated.View pointerEvents="box-none" style={[styles.card, {opacity: fade}]}>
          <Text style={styles.cardText}>{STEPS[step]}</Text>
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.nextRow}>
            <SecondaryButton label="NEXT STEP" Icon={ChevronRight} onPress={next} />
          </View>
          <PrimaryButton
            label="START CIRCUIT"
            Icon={Zap}
            onPress={onStart}
            height={56}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  counter: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: C.accentPrimary,
    fontVariant: ['tabular-nums'],
  },
  demoArea: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  demoRow: {flexDirection: 'row', alignItems: 'center'},
  demoCell: {alignItems: 'center', justifyContent: 'center'},
  demoHint: {
    marginTop: 22,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: C.accentPrimary,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(28,36,80,0.86)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.lineAccent,
    padding: 18,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: C.textPrimary,
  },
  footer: {marginTop: 16, marginHorizontal: 20, marginBottom: 26},
  nextRow: {marginBottom: 10, flexDirection: 'row'},
});
