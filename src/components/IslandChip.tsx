import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type IslandState = 'done' | 'current' | 'locked';

interface Props {
  index: number;
  state: IslandState;
}

const FACES = {
  done: {
    backgroundColor: 'rgba(57,199,255,0.18)',
    borderColor: '#39C7FF',
    borderWidth: 1,
    color: '#39C7FF',
  },
  current: {
    backgroundColor: 'rgba(243,197,76,0.14)',
    borderColor: '#F3C54C',
    borderWidth: 2,
    color: '#F3C54C',
  },
  locked: {
    backgroundColor: 'rgba(245,239,229,0.05)',
    borderColor: 'rgba(245,239,229,0.10)',
    borderWidth: 1,
    color: 'rgba(245,239,229,0.30)',
  },
};

export function IslandChip({ index, state }: Props) {
  const face = FACES[state];
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: face.backgroundColor,
          borderColor: face.borderColor,
          borderWidth: face.borderWidth,
        },
      ]}>
      <Text style={[styles.num, { color: face.color }]}>{index}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 32,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export default IslandChip;
