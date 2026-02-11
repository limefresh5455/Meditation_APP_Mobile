import React, { FC } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { theme } from '../utils/responsive';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
  onLoop?: () => void;
  onSave?: () => void;
  onOffline?: () => void;
  isLooping?: boolean;
  isSaved?: boolean;
  isOffline?: boolean;
}

const PlayerControls: FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSkipBackward,
  onSkipForward,
  onLoop,
  onSave,
  onOffline,
  isLooping = false,
  isSaved = false,
  isOffline = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Skip Controls */}
      <View style={styles.skipControls}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkipBackward}
          activeOpacity={0.7}
        >
          <Text style={styles.skipIcon}>↺</Text>
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkipForward}
          activeOpacity={0.7}
        >
          <Text style={styles.skipIcon}>↻</Text>
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onLoop}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>🔁</Text>
          <Text style={[styles.actionLabel, isLooping && styles.activeLabel]}>
            LOOP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onSave}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={[styles.actionLabel, isSaved && styles.activeLabel]}>
            SAVE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onOffline}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📥</Text>
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
    marginBottom: theme.spacing.xl,
  },
  skipButton: {
    marginHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  skipIcon: {
    fontSize: theme.font.xxl,
    color: Colors.textSecondary,
  },
  skipText: {
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    fontFamily: FONTS.Regular,
    marginTop: -8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: theme.font.lg,
    marginBottom: theme.spacing.xs,
  },
  actionLabel: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  activeLabel: {
    color: Colors.primary,
  },
});

export default PlayerControls;
