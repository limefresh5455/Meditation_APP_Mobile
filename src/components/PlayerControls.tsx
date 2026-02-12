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
});

export default PlayerControls;
