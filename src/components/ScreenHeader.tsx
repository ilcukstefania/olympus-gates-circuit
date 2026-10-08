import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {HEADER_H, HEADER_PAD_TOP} from '../constants/config';
import {C} from '../constants/theme';

interface Props {
  title: string;
  subtitle?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  transparent?: boolean;
}

/**
 * One header for every screen (self-verification #12). paddingTop 44 keeps the
 * content clear of the status bar - rule #6.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  transparent = false,
}: Props) {
  return (
    <View style={[styles.header, transparent ? styles.plain : styles.scrim]}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.centre}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <View style={styles.subtitle}>{subtitle}</View> : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_H + HEADER_PAD_TOP,
    paddingTop: HEADER_PAD_TOP,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrim: {
    backgroundColor: 'rgba(4,6,15,0.38)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(57,199,255,0.16)',
  },
  plain: {backgroundColor: 'transparent'},
  side: {width: 72, alignItems: 'flex-start', justifyContent: 'center'},
  sideRight: {alignItems: 'flex-end'},
  centre: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: C.textPrimary,
  },
  subtitle: {marginTop: 3, alignItems: 'center'},
});

export const ScreenHeader = React.memo(ScreenHeaderBase);
