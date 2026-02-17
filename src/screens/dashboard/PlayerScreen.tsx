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
import React, { FC, useEffect, useState, useRef } from 'react';
import Sound from 'react-native-sound';
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
import {
  setLastPlayedTrack,
  updatePlaybackPosition,
  selectSavedTrackIds,
  selectOfflineTrackIds,
  selectIsRepeatOne,
  toggleSaveTrack,
  toggleOfflineTrack,
  toggleRepeatMode,
} from '../../redux/reducers/musicSlice';

import musicPlaceHolder from '../../assets/Images/musicPlaceHolderTransparent.png';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook';
import { RepeatMode } from 'react-native-track-player';
import {
  downloadTrack,
  deleteTrackFile,
  verifyLocalFile,
} from '../../services/DownloadService';

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
  const dispatch = useAppDispatch();

  const [panValue, setPanValue] = useState(0);
  const soundRef = useRef<Sound | null>(null);

  const isCurrentTrackActive = activeTrack?.id === track?.id;
  const isPlaying =
    isCurrentTrackActive && playbackState.state === State.Playing;

  const savedTrackIds = useAppSelector(selectSavedTrackIds);
  const offlineTrackIds = useAppSelector(selectOfflineTrackIds);
  const isRepeatOne = useAppSelector(selectIsRepeatOne);

  const isSaved = track ? savedTrackIds.includes(track.id) : false;
  const isOffline = track ? offlineTrackIds.includes(track.id) : false;

  useEffect(() => {
    const updateRepeatMode = async () => {
      await TrackPlayer.setRepeatMode(
        isRepeatOne ? RepeatMode.Track : RepeatMode.Off,
      );
    };
    updateRepeatMode();
  }, [isRepeatOne]);

  useEffect(() => {
    let isMounted = true;
    if (track && activeTrack !== undefined && track.id !== activeTrack?.id) {
      const setup = async () => {
        try {
          const verifiedPath = await verifyLocalFile(track.id);
          const playbackUrl = verifiedPath || track.url;
          console.log('Player: Setting up track with URL:', playbackUrl);

          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: track.id,
            url: playbackUrl,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork || musicPlaceHolder,
          });

          if (soundRef.current) {
            soundRef.current.release();
            soundRef.current = null;
          }

          const sound = new Sound(playbackUrl, '', error => {
            if (!isMounted) {
              sound.release();
              return;
            }
            if (error) {
              console.log('failed to load panning sound', error);
              return;
            }
            soundRef.current = sound;
            sound.setPan(panValue);
            TrackPlayer.setVolume(0);
            sound.setVolume(1);

            if (isPlaying) {
              sound.play();
              sound.setCurrentTime(progress.position);
            }
          });

          await TrackPlayer.play();
          dispatch(setLastPlayedTrack(track));
        } catch (err) {
          console.log('Error in PlayerScreen setup:', err);
        }
      };
      setup();
    } else if (track && isCurrentTrackActive) {
      dispatch(setLastPlayedTrack(track));
      if (!soundRef.current && track.url) {
        const playbackUrl = track.url;
        const sound = new Sound(playbackUrl, '', error => {
          if (!isMounted) {
            sound.release();
            return;
          }
          if (error) return;
          soundRef.current = sound;
          sound.setPan(panValue);
          TrackPlayer.setVolume(0);
          sound.setVolume(1);
          if (isPlaying) {
            sound.play();
            sound.setCurrentTime(progress.position);
          }
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [track?.id, activeTrack?.id, isCurrentTrackActive]);

  useEffect(() => {
    if (isCurrentTrackActive && progress.position > 0) {
      dispatch(updatePlaybackPosition(progress.position));
    }
  }, [progress.position, isCurrentTrackActive]);

  const handlePlayPause = async () => {
    if (!track) return;
    if (isCurrentTrackActive) {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } else {
      const verifiedPath = await verifyLocalFile(track.id);
      const playbackUrl = verifiedPath || track.url;
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: playbackUrl,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork || musicPlaceHolder,
      });
      await TrackPlayer.play();
    }
  };

  const handleOfflineToggle = async () => {
    if (!track) return;

    if (isOffline) {
      dispatch(toggleOfflineTrack(track.id));
      await deleteTrackFile(track.id);
    } else {
      dispatch(toggleOfflineTrack(track.id));
      const path = await downloadTrack(track.id, track.url);
      if (!path) {
        dispatch(toggleOfflineTrack(track.id));
      }
    }
  };

  const handleBack = () => {
    if (soundRef.current) {
      soundRef.current.stop().release();
      soundRef.current = null;
    }
    TrackPlayer.setVolume(1);
    navigation.goBack();
  };

  const syncPanning = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.play();
      soundRef.current.getCurrentTime(sec => {
        if (Math.abs(sec - progress.position) > 1.0) {
          soundRef.current?.setCurrentTime(progress.position);
        }
      });
    } else {
      soundRef.current.pause();
    }
  };

  useEffect(() => {
    syncPanning();
  }, [isPlaying, progress.position]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop().release();
        soundRef.current = null;
      }
      TrackPlayer.setVolume(1);
    };
  }, []);

  const handlePanChange = (value: number) => {
    setPanValue(value);
    if (soundRef.current) {
      soundRef.current.setPan(value);
    }
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
                  const targetTime = value * currentDuration;
                  await TrackPlayer.seekTo(targetTime);
                  if (soundRef.current) {
                    soundRef.current.setCurrentTime(targetTime);
                  }
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

          <View style={styles.panningContainer}>
            <View style={styles.panningLabels}>
              <Text style={styles.panningLabel}>LEFT</Text>
              <Text style={styles.panningTitle}>AUDIO BALANCE</Text>
              <Text style={styles.panningLabel}>RIGHT</Text>
            </View>
            <Slider
              progress={(panValue + 1) / 2}
              onSeek={value => handlePanChange(value * 2 - 1)}
              height={6}
              backgroundColor={Colors.storageBackground}
              thumbColor={Colors.primary}
            />
          </View>

          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSkipBackward={() =>
              isCurrentTrackActive && TrackPlayer.seekTo(progress.position - 15)
            }
            onSkipForward={() =>
              isCurrentTrackActive && TrackPlayer.seekTo(progress.position + 15)
            }
            onLoop={() => dispatch(toggleRepeatMode())}
            onSave={() => track && dispatch(toggleSaveTrack(track.id))}
            onOffline={handleOfflineToggle}
            isLooping={isRepeatOne}
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
    marginTop: isTablet() ? theme.spacing.md : theme.spacing.sm * 1.2,
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
  panningContainer: {
    width: '100%',
    marginTop: isTablet() ? theme.spacing.lg : theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  panningLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  panningLabel: {
    fontFamily: FONTS.Bold,
    fontSize: 10,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  panningTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
});

export default PlayerScreen;
