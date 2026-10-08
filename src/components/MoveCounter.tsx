import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {C} from '../constants/theme';

interface Props {
  used: number;
  limit: number;
}

function MoveCounterBase({used, limit}: Props) {
  const left = Math.max(0, limit - used);
  const colour =
    left <= 2 ? C.danger : left <= 5 ? C.accentSecondary : C.accentPrimary;
  return (
    <Text style={[styles.text, {color: colour}]}>
      {'MOVES ' + used + ' / ' + limit}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    fontVariant: ['tabular-nums'],
  },
});

export const MoveCounter = React.memo(MoveCounterBase);
