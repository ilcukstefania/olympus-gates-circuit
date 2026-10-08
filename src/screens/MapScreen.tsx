import React, {useCallback, useMemo} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import type {ListRenderItemInfo} from 'react-native';
import {ChevronLeft, Star} from 'lucide-react-native';
import {IconButton} from '../components/IconButton';
import {IslandCard} from '../components/IslandCard';
import {ScreenBackground} from '../components/ScreenBackground';
import {ScreenHeader} from '../components/ScreenHeader';
import {C} from '../constants/theme';
import {LEVELS} from '../game/levels';
import {getProgress, menuStats} from '../game/scoring';
import type {Level} from '../game/types';

interface Props {
  onBack: () => void;
  onStartIsland: (index: number) => void;
}

const Separator = () => <View style={styles.sep} />;
const keyExtractor = (lv: Level) => String(lv.id);

export function MapScreen({onBack, onStartIsland}: Props) {
  const progress = useMemo(() => getProgress(), []);
  const stats = useMemo(() => menuStats(), []);

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<Level>) => (
      <IslandCard
        level={item}
        index={index}
        progress={progress[index]}
        onPress={onStartIsland}
      />
    ),
    [progress, onStartIsland],
  );

  return (
    <ScreenBackground variant="map">
      <View style={styles.root}>
        <ScreenHeader
          title="ISLAND MAP"
          leftSlot={
            <IconButton Icon={ChevronLeft} onPress={onBack} size={40} />
          }
          rightSlot={
            <View style={styles.starCount}>
              <Star
                size={18}
                color={C.accentSecondary}
                fill={C.accentSecondary}
                strokeWidth={2}
              />
              <Text style={styles.starText}>{stats.totalStars}</Text>
            </View>
          }
        />

        <View style={styles.body}>
          <View pointerEvents="none" style={styles.leyLine} />
          <FlatList
            data={LEVELS}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={5}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  body: {flex: 1},
  leyLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(57,199,255,0.14)',
  },
  listContent: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28},
  sep: {height: 12},
  starCount: {flexDirection: 'row', alignItems: 'center', gap: 6},
  starText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: C.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});
