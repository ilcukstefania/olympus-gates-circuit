import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../constants/theme';

type Variant = 'menu' | 'game' | 'win' | 'lose';

interface Props {
  variant: Variant;
  image?: ImageSourcePropType;
  imageOpacity?: number;
}

const GRADIENTS: Record<Variant, string[]> = {
  menu: theme.gradients.menuArt,
  game: theme.gradients.game,
  win: theme.gradients.resultWin,
  lose: theme.gradients.resultLose,
};

const BLOBS: Record<Variant, ViewStyle[]> = {
  menu: [
    { width: 260, height: 260, left: -40, top: 40, backgroundColor: 'rgba(116,80,200,0.30)' },
    { width: 220, height: 220, right: -50, top: 150, backgroundColor: 'rgba(57,199,255,0.22)' },
  ],
  game: [
    { width: 280, height: 280, right: -70, top: 60, backgroundColor: 'rgba(116,80,200,0.18)' },
    { width: 200, height: 200, left: -60, bottom: 120, backgroundColor: 'rgba(57,199,255,0.10)' },
  ],
  win: [
    { width: 320, height: 320, left: -20, top: -40, backgroundColor: 'rgba(243,197,76,0.22)' },
    { width: 200, height: 200, right: -50, bottom: 80, backgroundColor: 'rgba(57,199,255,0.14)' },
  ],
  lose: [
    { width: 320, height: 320, left: -20, top: -40, backgroundColor: 'rgba(232,74,95,0.16)' },
    { width: 200, height: 200, right: -50, bottom: 80, backgroundColor: 'rgba(116,80,200,0.16)' },
  ],
};

/**
 * Layers 1 and 2 of the four-layer stack: gradient sky, then soft aurora
 * blooms (and an optional art plate behind both).
 */
export function AuroraBackdrop({ variant, image, imageOpacity = 0.5 }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {image ? (
        <Image
          source={image}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { opacity: imageOpacity }]}
        />
      ) : null}
      {BLOBS[variant].map((blob, i) => (
        <View key={i} style={[styles.blob, blob]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
});

export default AuroraBackdrop;
