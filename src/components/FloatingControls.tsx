import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RotateCcw, Undo2, Zap} from 'lucide-react-native';
import {CONTROL_BAR_H} from '../constants/config';
import {C} from '../constants/theme';
import {IconButton} from './IconButton';
import {PrimaryButton} from './PrimaryButton';

interface Props {
  undosLeft: number;
  canUndo: boolean;
  disabled: boolean;
  onUndo: () => void;
  onCharge: () => void;
  onReset: () => void;
}

/** G2 archetype: floats over the bottom of the game area. */
function FloatingControlsBase({
  undosLeft,
  canUndo,
  disabled,
  onUndo,
  onCharge,
  onReset,
}: Props) {
  return (
    <View style={styles.bar}>
      <IconButton
        Icon={Undo2}
        onPress={onUndo}
        size={48}
        badge={undosLeft}
        disabled={disabled || !canUndo || undosLeft <= 0}
      />
      <View style={styles.chargeSlot}>
        <PrimaryButton
          label="CHARGE"
          Icon={Zap}
          onPress={onCharge}
          height={56}
          variant="charge"
          disabled={disabled}
        />
      </View>
      <IconButton
        Icon={RotateCcw}
        onPress={onReset}
        size={48}
        disabled={disabled || undosLeft <= 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    right: 16,
    height: CONTROL_BAR_H,
    borderRadius: 20,
    backgroundColor: 'rgba(10,14,38,0.92)',
    borderWidth: 1,
    borderColor: C.lineAccent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 10,
    shadowColor: '#050510',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 16,
  },
  chargeSlot: {flex: 1, justifyContent: 'center'},
});

export const FloatingControls = React.memo(FloatingControlsBase);
