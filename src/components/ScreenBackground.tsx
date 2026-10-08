import React from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ART} from '../assets';
import {C, THEME} from '../constants/theme';

export type BgVariant =
  | 'loader'
  | 'menu'
  | 'map'
  | 'tutorial'
  | 'game'
  | 'result-win'
  | 'result-lose';

interface Props {
  variant: BgVariant;
  children?: React.ReactNode;
}

/**
 * DIMENSIONAL_LAYERING signature: art -> gradient -> radial glow blobs ->
 * hex-outline decor -> content. Every screen stacks at least four z-layers.
 */
function ScreenBackgroundBase({variant, children}: Props) {
  const art =
    variant === 'loader'
      ? ART.bgLoader
      : variant === 'menu'
      ? ART.bgMenu
      : variant === 'game' || variant === 'tutorial'
      ? ART.bgGame
      : variant === 'map'
      ? ART.bgGame
      : ART.bgResult;

  const artOpacity =
    variant === 'loader'
      ? 0.35
      : variant === 'menu'
      ? 1
      : variant === 'game'
      ? 0.9
      : variant === 'map'
      ? 0.18
      : variant === 'tutorial'
      ? 0.3
      : 0.22;

  const gradient =
    variant === 'loader'
      ? THEME.gradients.loader
      : variant === 'map'
      ? THEME.gradients.map
      : variant === 'tutorial'
      ? THEME.gradients.tutorial
      : variant === 'game'
      ? THEME.gradients.gameScrim
      : variant === 'result-win'
      ? THEME.gradients.resultWin
      : variant === 'result-lose'
      ? THEME.gradients.resultLose
      : THEME.gradients.menuFade;

  const blobA =
    variant === 'result-lose' ? C.danger : C.accentPrimary;
  const blobB =
    variant === 'result-win' ? C.accentSecondary : C.accentTertiary;

  return (
    <View style={styles.root}>
      {variant === 'menu' ? (
        <ImageBackground source={art} style={styles.fill} resizeMode="cover">
          <LinearGradient
            colors={[...THEME.gradients.menuFade]}
            locations={[0, 0.6, 1]}
            style={styles.fill}
          />
        </ImageBackground>
      ) : (
        <View style={styles.fill}>
          <Image
            source={art}
            style={[styles.fill, {opacity: artOpacity}]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[...gradient]}
            start={{x: 0.1, y: 0}}
            end={{x: 0.9, y: 1}}
            style={styles.fill}
          />
        </View>
      )}

      {/* layer 2 - radial glow blobs */}
      <View
        pointerEvents="none"
        style={[styles.blob, styles.blobTop, {backgroundColor: blobA}]}
      />
      <View
        pointerEvents="none"
        style={[styles.blob, styles.blobBottom, {backgroundColor: blobB}]}
      />

      {/* layer 3 - hex outline decor */}
      <View pointerEvents="none" style={[styles.hexDecor, styles.hexTopLeft]} />
      <View
        pointerEvents="none"
        style={[styles.hexDecor, styles.hexBottomRight]}
      />

      {/* layer 4 - content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.bgBase, overflow: 'hidden'},
  fill: {...StyleSheet.absoluteFillObject},
  content: {flex: 1},
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  blobTop: {
    width: 320,
    height: 320,
    top: -60,
    left: -80,
    opacity: 0.1,
  },
  blobBottom: {
    width: 380,
    height: 380,
    bottom: -100,
    right: -90,
    opacity: 0.12,
  },
  hexDecor: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderWidth: 1,
    borderColor: 'rgba(57,199,255,0.05)',
    borderRadius: 34,
  },
  hexTopLeft: {top: 90, left: -78, transform: [{rotate: '12deg'}]},
  hexBottomRight: {bottom: 60, right: -84, transform: [{rotate: '-18deg'}]},
});

export const ScreenBackground = React.memo(ScreenBackgroundBase);
