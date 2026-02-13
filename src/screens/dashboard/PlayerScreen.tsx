import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { wp, hp, isLandscape, isTablet, theme } from '../../utils/responsive';
import PlayerControls from '../../components/PlayerControls';
import Slider from '../../components/Slider';
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  useActiveTrack,
  State,
} from 'react-native-track-player';

// const musicPlaceHolder = require('../../assets/Images/musicPlaceHolderTransparent.png');

import musicPlaceHolder from '../../assets/Images/musicPlaceHolderTransparent.png';

interface MusicImageProps {
  uri: string;
  style: any;
}

interface PlayerScreenProps {
  navigation: any;
  route: any;
}

const MusicImage: FC<MusicImageProps> = ({ uri, style }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      source={hasError || !uri ? musicPlaceHolder : { uri }}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

const PlayerScreen: FC<PlayerScreenProps> = ({ navigation, route }) => {
  const { track } = route.params || {};
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const activeTrack = useActiveTrack();

  const isCurrentTrackActive = activeTrack?.id === track?.id;
  const isPlaying =
    isCurrentTrackActive && playbackState.state === State.Playing;

  const [isLooping, setIsLooping] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (track && activeTrack !== undefined && track.id !== activeTrack?.id) {
      const setup = async () => {
        try {
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: track.id,
            url: track.url,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork || musicPlaceHolder,
          });
          await TrackPlayer.play();
        } catch (err) {
          console.log('Error in PlayerScreen setup:', err);
        }
      };
      setup();
    }
  }, [track?.id, activeTrack?.id]);

  const handlePlayPause = async () => {
    if (isCurrentTrackActive) {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } else {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.url,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork || musicPlaceHolder,
      });
      await TrackPlayer.play();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPosition = isCurrentTrackActive ? progress.position : 0;
  const currentDuration = isCurrentTrackActive
    ? progress.duration
    : track?.duration || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Text style={styles.headerIcon}>∨</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.nowPlaying}>NOW PLAYING</Text>
          <Text style={styles.trackTitle}>
            {track?.title || 'Unknown Track'}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.albumArtContainer}>
            <MusicImage uri={track?.artwork} style={styles.albumArtImage} />

            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={handlePlayPause}
              activeOpacity={0.8}
            >
              {playbackState.state === State.Buffering ||
              playbackState.state === State.Loading ? (
                <ActivityIndicator color={Colors.white} size="large" />
              ) : (
                <Text style={styles.playPauseIcon}>
                  {isPlaying ? '❚❚' : '▶'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.timer}>{formatTime(currentPosition)}</Text>
          <Text style={styles.breathingText}>
            {isPlaying ? 'Breathe with the sound...' : 'Paused'}
          </Text>

          <View style={styles.progressContainer}>
            <Slider
              progress={
                currentDuration > 0 ? currentPosition / currentDuration : 0
              }
              onSeek={() => {}}
              onSlidingComplete={async value => {
                if (isCurrentTrackActive && currentDuration > 0) {
                  await TrackPlayer.seekTo(value * currentDuration);
                }
              }}
              height={4}
            />
            <View style={styles.timeLabels}>
              <Text style={styles.timeLabel}>
                {formatTime(currentPosition)}
              </Text>
              <Text style={styles.timeLabel}>
                {formatTime(currentDuration)}
              </Text>
            </View>
          </View>

          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSkipBackward={() =>
              isCurrentTrackActive && TrackPlayer.seekTo(progress.position - 10)
            }
            onSkipForward={() =>
              isCurrentTrackActive && TrackPlayer.seekTo(progress.position + 10)
            }
            onLoop={() => setIsLooping(!isLooping)}
            onSave={() => setIsSaved(!isSaved)}
            onOffline={() => setIsOffline(!isOffline)}
            isLooping={isLooping}
            isSaved={isSaved}
            isOffline={isOffline}
          />
        </View>
      </ScrollView>
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
    width: isTablet() ? theme.icon.xl : theme.icon.lg,
    height: isTablet() ? theme.icon.xl : theme.icon.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: isTablet() ? theme.font.xxl : theme.font.xl,
    color: Colors.textPrimary,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  nowPlaying: {
    fontFamily: FONTS.Regular,
    fontSize: isTablet() ? theme.font.sm : theme.font.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  trackTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: isTablet() ? theme.font.lg : theme.font.base,
    color: Colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.containerPadding,
    justifyContent: 'space-around',
    paddingVertical:
      isTablet() && isLandscape()
        ? theme.spacing.md
        : isTablet()
        ? theme.spacing.sm * -1.5
        : theme.spacing.xl,
    minHeight: isTablet() && isLandscape() ? hp(85) : undefined,
  },
  albumArtContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  albumArtImage: {
    width: isTablet() && isLandscape() ? wp(30) : isTablet() ? wp(38) : wp(70),
    height: isTablet() && isLandscape() ? wp(30) : isTablet() ? wp(38) : wp(70),
    borderRadius: isTablet() ? theme.radius.xl : theme.radius.lg,
  },
  playPauseButton: {
    position: 'absolute',
    bottom: isTablet() ? -28 : -30,
    width: isTablet() ? theme.icon.xxl * 1.2 : theme.icon.xxl * 1.5,
    height: isTablet() ? theme.icon.xxl * 1.2 : theme.icon.xxl * 1.5,
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
    fontSize: isTablet() ? theme.font.xxl * 1.2 : theme.font.xxl,
    color: Colors.white,
  },
  timer: {
    fontFamily: FONTS.Bold,
    fontSize: isTablet() ? theme.font.xxxl * 1.6 : theme.font.xxxl * 1.5,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: isTablet() ? theme.spacing.md : theme.spacing.xl,
  },
  breathingText: {
    fontFamily: FONTS.Regular,
    fontSize: isTablet() ? theme.font.base : theme.font.base,
    color: Colors.accentPurple,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.md,
    marginTop: isTablet() ? theme.spacing.md : theme.spacing.xl,
    marginBottom: isTablet() ? theme.spacing.sm : theme.spacing.sm * 1.5,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  timeLabel: {
    fontFamily: FONTS.Regular,
    fontSize: isTablet() ? theme.font.sm : theme.font.xs,
    color: Colors.textTertiary,
  },
});

export default PlayerScreen;
