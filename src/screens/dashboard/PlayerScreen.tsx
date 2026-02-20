import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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
import Toast from 'react-native-simple-toast';
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
import { resolveSessionTrack } from '../../constants/musicData';
import MusicImage from '../../components/MusicImage';

interface PlayerScreenProps {
  navigation: any;
  route: any;
}

const PlayerScreen: FC<PlayerScreenProps> = ({ navigation, route }) => {
  const { track: rawTrack } = route.params || {};
  const track = rawTrack ? resolveSessionTrack(rawTrack) : null;
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const activeTrack = useActiveTrack();
  const dispatch = useAppDispatch();

  const [panValue, setPanValue] = useState(0);
  const [isPanningVisible, setIsPanningVisible] = useState(false);
  const soundRef = useRef<Sound | null>(null);
  const soundUrlRef = useRef<string | null>(null);

  const isCurrentTrackActive = !!(
    activeTrack?.id === track?.id ||
    (track?.isComposite &&
      track?.blocks?.some((b: any) => b.id === activeTrack?.id))
  );
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
        isRepeatOne ? RepeatMode.Queue : RepeatMode.Off,
      );
    };
    updateRepeatMode();
  }, [isRepeatOne]);

  const setupIdRef = useRef(0);

  useEffect(() => {
    Sound.setCategory('Playback', true);
    let isMounted = true;
    const currentSetupId = ++setupIdRef.current;

    const cleanupSound = () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
        soundRef.current = null;
        soundUrlRef.current = null;
      }
    };

    if (track && activeTrack !== undefined && !isCurrentTrackActive) {
      const setup = async () => {
        try {
          const verifiedPath = await verifyLocalFile(track.id);
          const playbackUrl = verifiedPath || track.url;
          if (currentSetupId !== setupIdRef.current) return;

          console.log('Player: Setting up track:', track.title);

          await TrackPlayer.reset();
          if (currentSetupId !== setupIdRef.current) return;

          await TrackPlayer.add({
            id: track.id,
            url: playbackUrl,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork || musicPlaceHolder,
          });

          cleanupSound();

          if (!playbackUrl || currentSetupId !== setupIdRef.current) return;

          const finalUrl =
            typeof playbackUrl === 'number' ? playbackUrl : String(playbackUrl);

          const callback = (error: any) => {
            if (!isMounted || currentSetupId !== setupIdRef.current) {
              sound?.release();
              return;
            }
            if (error) {
              console.log('failed to load panning sound', error);
              return;
            }
            soundRef.current = sound;
            soundUrlRef.current = String(finalUrl);
            sound.setPan(panValue);
            TrackPlayer.setVolume(0);
            sound.setVolume(1);

            if (isPlaying) {
              sound.play();
              sound.setCurrentTime(progress.position);
            }
          };

          const sound: Sound =
            typeof finalUrl === 'number'
              ? new Sound(finalUrl, callback)
              : new Sound(finalUrl, '', callback);

          await TrackPlayer.play();
        } catch (err) {
          console.log('Error in PlayerScreen setup:', err);
        }
      };
      setup();
    } else if (track && isCurrentTrackActive) {
      if (
        activeTrack &&
        (!soundRef.current || soundUrlRef.current !== activeTrack.url)
      ) {
        cleanupSound();
        const playbackUrl = activeTrack.url;
        if (!playbackUrl) return;

        const finalUrl =
          typeof playbackUrl === 'number' ? playbackUrl : String(playbackUrl);

        const callback = (error: any) => {
          if (!isMounted || currentSetupId !== setupIdRef.current) {
            sound?.release();
            return;
          }
          if (error) {
            console.log('failed to load panning sound', error);
            return;
          }
          soundRef.current = sound;
          soundUrlRef.current = String(finalUrl);
          sound.setPan(panValue);
          TrackPlayer.setVolume(0);
          sound.setVolume(1);
          if (isPlaying) {
            sound.play();
            sound.setCurrentTime(progress.position);
          }
        };

        const sound: Sound =
          typeof finalUrl === 'number'
            ? new Sound(finalUrl, callback)
            : new Sound(finalUrl, '', callback);
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
        if (currentDuration > 0 && currentPosition >= currentDuration - 1) {
          if (track?.isComposite && track.blocks) {
            await TrackPlayer.skip(0);
          }
          await TrackPlayer.seekTo(0);
          if (soundRef.current) {
            soundRef.current.setCurrentTime(0);
          }
        }
        await TrackPlayer.play();
      }
    } else {
      await TrackPlayer.reset();
      if (track.isComposite && track.blocks) {
        const trackList = await Promise.all(
          track.blocks.map(async (block: any) => {
            const verifiedPath = await verifyLocalFile(block.id);
            return {
              id: block.id,
              url: verifiedPath || block.url,
              title: block.title,
              artist: block.artist,
              artwork: block.artwork || musicPlaceHolder,
            };
          }),
        );
        await TrackPlayer.add(trackList);
      } else {
        const verifiedPath = await verifyLocalFile(track.id);
        const playbackUrl = verifiedPath || track.url;
        await TrackPlayer.add({
          id: track.id,
          url: playbackUrl,
          title: track.title,
          artist: track.artist,
          artwork: track.artwork || musicPlaceHolder,
        });
      }
      await TrackPlayer.play();
    }
  };

  const handleOfflineToggle = async () => {
    if (!track) return;

    if (isOffline) {
      dispatch(toggleOfflineTrack(track.id));
      if (track.isComposite && track.blocks) {
        await Promise.all(track.blocks.map(block => deleteTrackFile(block.id)));
      } else {
        await deleteTrackFile(track.id);
      }
      Toast.show('Removed from offline', Toast.SHORT);
    } else {
      dispatch(toggleOfflineTrack(track.id));

      let success = true;
      if (track.isComposite && track.blocks) {
        const results = await Promise.all(
          track.blocks.map(block => downloadTrack(block.id, block.url)),
        );
        success = results.every(path => path !== null);
      } else {
        const path = await downloadTrack(track.id, track.url);
        success = path !== null;
      }

      if (!success) {
        dispatch(toggleOfflineTrack(track.id));
        Toast.show('Download failed', Toast.SHORT);
      } else {
        Toast.show('Downloaded successfully', Toast.SHORT);
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

  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const updateIndex = async () => {
      const index = await TrackPlayer.getActiveTrackIndex();
      setCurrentIndex(index);
    };
    updateIndex();
  }, [activeTrack?.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCumulativeSessionData = () => {
    if (!track?.isComposite || !track.blocks) {
      return {
        position: progress.position,
        duration: progress.duration || track?.duration || 0,
      };
    }

    let cumulativePosition = progress.position;
    const totalDuration = track.blocks.reduce(
      (acc: number, b: any) => acc + b.duration,
      0,
    );

    if (currentIndex !== undefined) {
      for (let i = 0; i < currentIndex; i++) {
        cumulativePosition += track.blocks[i].duration;
      }
    }

    return {
      position: cumulativePosition,
      duration: totalDuration,
    };
  };

  const sessionData = getCumulativeSessionData();
  const currentPosition = isCurrentTrackActive ? sessionData.position : 0;
  const currentDuration = isCurrentTrackActive
    ? sessionData.duration
    : track?.duration || 0;

  const handleFocusPress = async () => {
    if (track?.isComposite && isCurrentTrackActive) {
      await TrackPlayer.skipToNext();
    }
  };

  const seekByDelta = async (delta: number) => {
    if (!isCurrentTrackActive || currentDuration <= 0) return;

    const targetSessionTime = Math.max(
      0,
      Math.min(currentDuration, currentPosition + delta),
    );

    if (!track?.isComposite || !track.blocks) {
      await TrackPlayer.seekTo(targetSessionTime);
      if (soundRef.current) {
        soundRef.current.setCurrentTime(targetSessionTime);
      }
      return;
    }

    let accumulatedTime = 0;
    let targetBlockIndex = 0;
    let targetBlockTime = 0;

    for (let i = 0; i < track.blocks.length; i++) {
      const blockDuration = track.blocks[i].duration;
      if (targetSessionTime < accumulatedTime + blockDuration) {
        targetBlockIndex = i;
        targetBlockTime = targetSessionTime - accumulatedTime;
        break;
      }
      accumulatedTime += blockDuration;
      if (i === track.blocks.length - 1) {
        targetBlockIndex = i;
        targetBlockTime = blockDuration;
      }
    }

    if (targetBlockIndex === currentIndex) {
      await TrackPlayer.seekTo(targetBlockTime);
      if (soundRef.current) {
        soundRef.current.setCurrentTime(targetBlockTime);
      }
    } else {
      await TrackPlayer.skip(targetBlockIndex);
      await TrackPlayer.seekTo(targetBlockTime);
    }
  };

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
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsPanningVisible(!isPanningVisible)}
        >
          <Text
            style={[
              styles.headerIcon,
              isPanningVisible && { color: Colors.primary },
            ]}
          >
            ⋯
          </Text>
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
              <Text style={styles.playPauseIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.timer}>{formatTime(currentPosition)}</Text>

          <View style={styles.statusRow}>
            <Text style={styles.breathingText}>
              {isPlaying ? 'Breathe with the sound...' : 'Paused'}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <Slider
              progress={
                currentDuration > 0 ? currentPosition / currentDuration : 0
              }
              onSlidingComplete={async value => {
                if (isCurrentTrackActive && currentDuration > 0) {
                  const targetSessionTime = value * currentDuration;

                  if (!track?.isComposite || !track.blocks) {
                    await TrackPlayer.seekTo(targetSessionTime);
                    if (soundRef.current) {
                      soundRef.current.setCurrentTime(targetSessionTime);
                    }
                    return;
                  }

                  let accumulatedTime = 0;
                  let targetBlockIndex = 0;
                  let targetBlockTime = 0;

                  for (let i = 0; i < track.blocks.length; i++) {
                    const blockDuration = track.blocks[i].duration;
                    if (targetSessionTime < accumulatedTime + blockDuration) {
                      targetBlockIndex = i;
                      targetBlockTime = targetSessionTime - accumulatedTime;
                      break;
                    }
                    accumulatedTime += blockDuration;
                  }

                  if (targetBlockIndex === currentIndex) {
                    await TrackPlayer.seekTo(targetBlockTime);
                    if (soundRef.current) {
                      soundRef.current.setCurrentTime(targetBlockTime);
                    }
                  } else {
                    await TrackPlayer.skip(targetBlockIndex);
                    await TrackPlayer.seekTo(targetBlockTime);
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

          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSkipBackward={() => seekByDelta(-15)}
            onSkipForward={() => seekByDelta(15)}
            onFocus={handleFocusPress}
            isFocusVisible={!!(track?.isComposite && isCurrentTrackActive)}
            onLoop={() => dispatch(toggleRepeatMode())}
            onSave={() => track && dispatch(toggleSaveTrack(track.id))}
            onOffline={handleOfflineToggle}
            isLooping={isRepeatOne}
            isSaved={isSaved}
            isOffline={isOffline}
          />
        </View>
      </ScrollView>

      {isPanningVisible && (
        <View style={styles.verticalPanningOverlay}>
          <TouchableOpacity
            style={styles.overlayCloseArea}
            onPress={() => setIsPanningVisible(false)}
          />
          <View style={styles.verticalPanningCard}>
            <Text style={styles.verticalPanningLabel}>R</Text>
            <View style={styles.verticalSliderContainer}>
              <Slider
                progress={(panValue + 1) / 2}
                onSeek={v => handlePanChange(v * 2 - 1)}
                onSlidingComplete={v => handlePanChange(v * 2 - 1)}
                height={4}
                orientation="vertical"
                backgroundColor={Colors.storageBackground}
                thumbColor={Colors.primary}
              />
            </View>
            <Text style={styles.verticalPanningLabel}>L</Text>
          </View>
        </View>
      )}
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
  verticalPanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  overlayCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  verticalPanningCard: {
    position: 'absolute',
    right: theme.spacing.md,
    top: hp(15),
    backgroundColor: 'rgba(30, 30, 45, 0.95)',
    borderRadius: theme.radius.xl,

    width: isTablet() ? 70 : 28,
    height: isTablet() ? hp(38) : hp(40),

    paddingVertical: isTablet() ? theme.spacing.xl : theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  verticalSliderContainer: {
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  verticalPanningLabel: {
    color: Colors.textTertiary,
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xs,
  },
  modeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  modeButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 80,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: Colors.white,
  },
  modeButtonText: {
    color: Colors.white,
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.sm,
  },
  focusFloatingButton: {
    position: 'absolute',
    top: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  focusFloatingText: {
    color: Colors.white,
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    width: '100%',
    position: 'relative',
  },
  focusInlineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    right: 0,
  },
  focusInlineText: {
    color: Colors.white,
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.sm,
  },
});

export default PlayerScreen;
