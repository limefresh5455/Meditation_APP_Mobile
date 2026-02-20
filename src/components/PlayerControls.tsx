import React, { FC } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { isTablet, theme } from '../utils/responsive';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
  onLoop?: () => void;
  onSave?: () => void;
  onOffline?: () => void;
  onFocus?: () => void;
  isLooping?: boolean;
  isSaved?: boolean;
  isOffline?: boolean;
  isFocusVisible?: boolean;
}

const PlayerControls: FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSkipBackward,
  onSkipForward,
  onLoop,
  onSave,
  onOffline,
  onFocus,
  isLooping = false,
  isSaved = false,
  isOffline = false,
  isFocusVisible = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.skipControls}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkipBackward}
          activeOpacity={0.7}
        >
          <Text style={styles.skipIcon}>↺</Text>
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>

        {isFocusVisible && (
          <TouchableOpacity
            style={styles.focusButton}
            onPress={onFocus}
            activeOpacity={0.7}
          >
            <Text style={styles.focusButtonText}>Focus</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkipForward}
          activeOpacity={0.7}
        >
          <Text style={styles.skipIcon}>↻</Text>
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onLoop}
          activeOpacity={0.7}
        >
          <Icon
            name="repeat"
            size={theme.font.xxl}
            color={isLooping ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[styles.actionLabel, isLooping && styles.activeLabel]}>
            LOOP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onSave}
          activeOpacity={0.7}
        >
          <Icon
            name={isSaved ? 'heart' : 'heart-outline'}
            size={theme.font.xxl}
            color={isSaved ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[styles.actionLabel, isSaved && styles.activeLabel]}>
            SAVE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onOffline}
          activeOpacity={0.7}
        >
          <Icon
            name="download-outline"
            size={theme.font.xxl}
            color={isOffline ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[styles.actionLabel, isOffline && styles.activeLabel]}>
            OFFLINE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  skipControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet() ? theme.spacing.lg : theme.spacing.xl,
  },
  skipButton: {
    marginHorizontal: isTablet() ? theme.spacing.xl : theme.spacing.xl,
    alignItems: 'center',
  },
  skipIcon: {
    fontSize: theme.font.xxl * 1.2,
    color: Colors.textSecondary,
  },
  skipText: {
    fontSize: isTablet() ? theme.font.xs : theme.font.xs,
    color: Colors.textSecondary,
    fontFamily: FONTS.Regular,
    marginTop: isTablet() ? -8 : -8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionLabel: {
    fontFamily: FONTS.Regular,
    fontSize: isTablet() ? theme.font.xs : theme.font.xs,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  activeLabel: {
    color: Colors.primary,
  },
  focusButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: theme.spacing.sm,
  },
  focusButtonText: {
    color: Colors.white,
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.sm,
  },
});

export default PlayerControls;
