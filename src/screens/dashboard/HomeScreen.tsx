import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { isTablet, theme, wp } from '../../utils/responsive';
import FocusAreaIcon from '../../components/FocusAreaIcon';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
  State,
} from 'react-native-track-player';
import musicData from '../../constants/musicData';
import Icon from 'react-native-vector-icons/Ionicons';
import MusicImage from '../../components/MusicImage';
import {
  selectLastPlayedTrack,
  selectPlaybackPosition,
  setLastPlayedTrack,
  updatePlaybackPosition,
} from '../../redux/reducers/musicSlice';
import { useAppSelector, useAppDispatch } from '../../redux/reduxHook';
import { verifyLocalFile } from '../../services/DownloadService';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const { position: realTimePosition } = useProgress();
  const lastPlayedTrack = useAppSelector(selectLastPlayedTrack);
  const playbackPosition = useAppSelector(selectPlaybackPosition);
  const dispatch = useAppDispatch();

  const isPlaying = playbackState.state === State.Playing;
  const isBuffering =
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading;
  const musicPlaceHolder = require('../../assets/Images/musicPlaceHolderTransparent.png');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const isProcessingSelect = React.useRef(false);

  const handleTrackSelect = async (
    item: any,
    resumePosition?: number,
    skipSaveLastPlayed?: boolean,
  ) => {
    if (isProcessingSelect.current) return;
    isProcessingSelect.current = true;

    try {
      const isSameTrack = activeTrack?.id === item.id;
      const shouldNavigate = !activeTrack;

      if (isSameTrack) {
        if (isPlaying) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
        }
        if (shouldNavigate) {
          navigation.navigate('PlayerScreen', { track: item });
        }
        return;
      }

      if (shouldNavigate) {
        navigation.navigate('PlayerScreen', { track: item });
      }

      // Save the previous track as "last played" before switching
      if (activeTrack && !skipSaveLastPlayed) {
        const prevTrackInfo = musicData.find(
          (m: any) =>
            m.id === activeTrack.id ||
            (m.isComposite &&
              m.blocks?.some((b: any) => b.id === activeTrack.id)),
        );
        if (prevTrackInfo) {
          const { position } = await TrackPlayer.getProgress();
          dispatch(setLastPlayedTrack(prevTrackInfo));
          dispatch(updatePlaybackPosition(position));
        }
      }

      await TrackPlayer.reset();

      if (item.isComposite && item.blocks) {
        const trackList = await Promise.all(
          item.blocks.map(async (block: any) => {
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
        const verifiedPath = await verifyLocalFile(item.id);
        const playbackUrl = verifiedPath || item.url;
        await TrackPlayer.add({
          id: item.id,
          url: playbackUrl,
          title: item.title,
          artist: item.artist,
          artwork: item.artwork || musicPlaceHolder,
        });
      }

      await TrackPlayer.play();

      if (resumePosition && resumePosition > 0) {
        await TrackPlayer.seekTo(resumePosition);
      }
    } catch (e) {
      console.log('Error in handleTrackSelect:', e);
    } finally {
      isProcessingSelect.current = false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subtitle}>Take a deep breath and relax.</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon
              name="notifications-outline"
              size={wp(5.5)}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.dailySessionCard,
            activeTrack?.id === musicData[0].id && styles.activeDailySession,
          ]}
        >
          <View style={styles.dailySessionContent}>
            <Text style={styles.dailySessionLabel}>DAILY SESSION</Text>
            <Text style={styles.dailySessionTitle}>
              10 min Calm{'\n'}Session
            </Text>
            <Text style={styles.dailySessionDescription}>
              Relieve stress and find your center with deep breathing.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              activeOpacity={0.8}
              onPress={() => handleTrackSelect(musicData[0])}
            >
              {activeTrack?.id === musicData[0].id && isBuffering ? (
                <ActivityIndicator
                  color={Colors.primary}
                  size="small"
                  style={{ marginRight: 6 }}
                />
              ) : (
                <Icon
                  name={
                    isPlaying && activeTrack?.id === musicData[0].id
                      ? 'pause'
                      : 'play'
                  }
                  size={16}
                  color={Colors.primary}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text style={styles.startButtonText}>
                {activeTrack?.id === musicData[0].id && isBuffering
                  ? 'Loading...'
                  : isPlaying && activeTrack?.id === musicData[0].id
                  ? 'Playing'
                  : 'Start Now'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dailySessionImage}>
            <Text style={styles.leafEmoji}>🍃</Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Focus Areas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.focusAreasContainer}>
            <FocusAreaIcon iconName="fitness-outline" label="Stress" />
            <FocusAreaIcon iconName="moon-outline" label="Sleep" />
            <FocusAreaIcon iconName="bulb-outline" label="Focus" />
            <FocusAreaIcon iconName="heart-outline" label="Anxiety" />
          </View>
        </View>

        {lastPlayedTrack && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue last session</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                handleTrackSelect(
                  lastPlayedTrack,
                  activeTrack?.id === lastPlayedTrack.id
                    ? undefined
                    : playbackPosition,
                  true,
                )
              }
              style={[
                styles.continueSessionCard,
                activeTrack?.id === lastPlayedTrack.id &&
                  styles.activeContinueSession,
              ]}
            >
              <View style={styles.continueSessionThumbnail}>
                <MusicImage
                  uri={lastPlayedTrack.artwork}
                  style={styles.continueSessionImage}
                />
              </View>
              <View style={styles.continueSessionInfo}>
                <Text
                  style={[
                    styles.continueSessionTitle,
                    activeTrack?.id === lastPlayedTrack.id &&
                      styles.activeItemText,
                  ]}
                >
                  {lastPlayedTrack.title}
                </Text>
                <Text style={styles.continueSessionSubtitle}>
                  {lastPlayedTrack.artist} •{' '}
                  {(() => {
                    const isTrackActive =
                      activeTrack?.id === lastPlayedTrack.id;
                    const displayPosition = isTrackActive
                      ? realTimePosition
                      : playbackPosition;
                    // Fallback to musicData for duration if missing
                    const fullTrackInfo = musicData.find(
                      m => m.id === lastPlayedTrack.id,
                    );
                    const duration =
                      lastPlayedTrack.duration || fullTrackInfo?.duration || 0;
                    return duration
                      ? `${Math.max(
                          0,
                          Math.floor((duration - displayPosition) / 60),
                        )} min left`
                      : 'Resuming...';
                  })()}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: (() => {
                          const isTrackActive =
                            activeTrack?.id === lastPlayedTrack.id;
                          const displayPosition = isTrackActive
                            ? realTimePosition
                            : playbackPosition;
                          const fullTrackInfo = musicData.find(
                            m => m.id === lastPlayedTrack.id,
                          );
                          const duration =
                            lastPlayedTrack.duration ||
                            fullTrackInfo?.duration ||
                            0;
                          return duration
                            ? `${Math.min(
                                100,
                                (displayPosition / duration) * 100,
                              )}%`
                            : '0%';
                        })(),
                      },
                    ]}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.playButtonSmall}
                activeOpacity={0.7}
                onPress={() =>
                  handleTrackSelect(
                    lastPlayedTrack,
                    activeTrack?.id === lastPlayedTrack.id
                      ? undefined
                      : playbackPosition,
                    true,
                  )
                }
              >
                {activeTrack?.id === lastPlayedTrack.id && isBuffering ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Icon
                    name={
                      isPlaying && activeTrack?.id === lastPlayedTrack.id
                        ? 'pause'
                        : 'play'
                    }
                    size={isTablet() ? 40 : 20}
                    color={Colors.white}
                  />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mindful Moments</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mindfulMomentsScroll}
          >
            {musicData.slice(2, 8).map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.mindfulCard}
                activeOpacity={0.9}
                onPress={() => handleTrackSelect(item)}
              >
                <View style={styles.mindfulCardImageContainer}>
                  <MusicImage
                    uri={item.artwork}
                    style={styles.mindfulCardImage}
                  />
                  <View style={styles.mindfulCardOverlay}>
                    {activeTrack?.id === item.id && isPlaying ? (
                      <Icon
                        name="pause-circle"
                        size={isTablet() ? 64 : 32}
                        color={Colors.white}
                      />
                    ) : (
                      <Icon
                        name="play-circle"
                        size={isTablet() ? 64 : 32}
                        color={Colors.white}
                      />
                    )}
                  </View>
                </View>
                <Text style={styles.mindfulCardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.mindfulCardSubtitle}>
                  {Math.floor(item.duration / 60)} MIN •{' '}
                  {item.genre?.toUpperCase() || 'RELAX'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  notificationButton: {
    width: theme.icon.xl,
    height: theme.icon.xl,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailySessionCard: {
    marginHorizontal: theme.layout.containerPadding,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    minHeight: 180,
  },
  dailySessionContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dailySessionLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.white,
    letterSpacing: 1,
  },
  dailySessionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.white,
    marginVertical: theme.spacing.sm,
  },
  dailySessionDescription: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.md,
  },
  startButton: {
    backgroundColor: Colors.white,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  startButtonIcon: {
    fontSize: theme.font.sm,
    color: Colors.primary,
    marginRight: theme.spacing.xs,
  },
  startButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.sm,
    color: Colors.primary,
  },
  dailySessionImage: {
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafEmoji: {
    fontSize: wp(20),
    opacity: 0.3,
  },
  section: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.layout.containerPadding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.lg,
    color: Colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.primary,
    letterSpacing: 1,
  },
  focusAreasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  continueSessionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueSessionThumbnail: {
    width: theme.image.small,
    height: theme.image.small,
    borderRadius: theme.radius.sm,
    backgroundColor: Colors.cardBackgroundLight,
    overflow: 'hidden',
  },
  continueSessionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailEmoji: {
    fontSize: theme.font.xxl,
  },
  continueSessionInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  continueSessionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  continueSessionSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '60%',
    backgroundColor: Colors.primary,
  },
  playButtonSmall: {
    width: theme.icon.xl,
    height: theme.icon.xl,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  activeDailySession: {
    borderColor: Colors.white,
    borderWidth: 2,
  },
  activeContinueSession: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  activeItemText: {
    color: Colors.primary,
  },
  mindfulMomentsScroll: {
    paddingRight: theme.layout.containerPadding,
  },
  mindfulCard: {
    width: wp(40),
    marginRight: theme.spacing.md,
  },
  mindfulCardImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.radius.md,
    backgroundColor: Colors.cardBackground,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  mindfulCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mindfulCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mindfulCardTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  mindfulCardSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default HomeScreen;
