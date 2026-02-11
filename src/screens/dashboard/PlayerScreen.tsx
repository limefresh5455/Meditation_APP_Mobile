import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { FC, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { theme, isTablet, isLandscape, wp, hp } from '../../utils/responsive';
import PlayerControls from '../../components/PlayerControls';
import ProgressBar from '../../components/ProgressBar';

interface PlayerScreenProps {
  navigation: any;
}

const PlayerScreen: FC<PlayerScreenProps> = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Text style={styles.headerIcon}>∨</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.nowPlaying}>NOW PLAYING</Text>
          <Text style={styles.trackTitle}>Deep Forest Serenity</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.albumArtContainer}>
          <View style={styles.albumArt}>
            <Text style={styles.albumEmoji}>🌲</Text>
          </View>

          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={() => setIsPlaying(!isPlaying)}
            activeOpacity={0.8}
          >
            <Text style={styles.playPauseIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.timer}>10:00</Text>
        <Text style={styles.breathingText}>Breathe in...</Text>

        <View style={styles.progressContainer}>
          <ProgressBar progress={0.33} height={4} />
          <View style={styles.timeLabels}>
            <Text style={styles.timeLabel}>03:24</Text>
            <Text style={styles.timeLabel}>10:00</Text>
          </View>
        </View>

        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSkipBackward={() => {}}
          onSkipForward={() => {}}
          onLoop={() => setIsLooping(!isLooping)}
          onSave={() => setIsSaved(!isSaved)}
          onOffline={() => setIsOffline(!isOffline)}
          isLooping={isLooping}
          isSaved={isSaved}
          isOffline={isOffline}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.containerPadding,
    paddingVertical: theme.spacing.md,
  },
  headerButton: {
    width: theme.icon.lg,
    height: theme.icon.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: theme.font.xl,
    color: Colors.textPrimary,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  nowPlaying: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  trackTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.base,
    color: Colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.containerPadding,
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.xl,
  },
  albumArtContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  albumArt: {
    width: isTablet() ? wp(50) : wp(70),
    height: isTablet() ? wp(50) : wp(70),
    borderRadius: theme.radius.full,
    backgroundColor: '#4A5D3F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 10,
  },
  albumEmoji: {
    fontSize: isTablet() ? wp(25) : wp(35),
  },
  playPauseButton: {
    position: 'absolute',
    bottom: -30,
    width: theme.icon.xxl * 1.5,
    height: theme.icon.xxl * 1.5,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  playPauseIcon: {
    fontSize: theme.font.xxl,
    color: Colors.white,
  },
  timer: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxxl * 1.5,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  breathingText: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.base,
    color: Colors.accentPurple,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xl,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  timeLabel: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textTertiary,
  },
});

export default PlayerScreen;
