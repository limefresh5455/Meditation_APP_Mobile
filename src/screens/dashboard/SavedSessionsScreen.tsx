import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import React, { FC, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { isTablet, theme, wp } from '../../utils/responsive';
import SessionListItem from '../../components/SessionListItem';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import musicData from '../../constants/musicData';
import { useAppSelector, useAppDispatch } from '../../redux/reduxHook';
import {
  selectSavedTrackIds,
  setTrackHistory,
  updateCurrentPosition,
} from '../../redux/reducers/musicSlice';
import { verifyLocalFile } from '../../services/DownloadService';

interface SavedSessionsScreenProps {
  navigation: any;
}

const SavedSessionsScreen: FC<SavedSessionsScreenProps> = ({ navigation }) => {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const dispatch = useAppDispatch();
  const isPlaying = playbackState.state === State.Playing;
  const isBuffering =
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading;
  const musicPlaceHolder = require('../../assets/Images/musicPlaceHolderTransparent.png');

  const [searchQuery, setSearchQuery] = useState('');

  const savedTrackIds = useAppSelector(selectSavedTrackIds) || [];

  const savedTracks = musicData.filter(track =>
    savedTrackIds.includes(track.id),
  );

  const isSessionActive = (session: any) => {
    if (!activeTrack) return false;
    if (activeTrack.id === session.id) return true;
    if (session.isComposite && session.blocks) {
      return session.blocks.some((block: any) => block.id === activeTrack.id);
    }
    return false;
  };

  const filteredTracks = savedTracks.filter(
    track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTrackSelect = async (item: any) => {
    try {
      const isSameTrack = isSessionActive(item);
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

      dispatch(setTrackHistory({ track: item, isContinuing: false }));

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
        console.log('Saved: Setting up track with URL:', playbackUrl);

        await TrackPlayer.add({
          id: item.id,
          url: playbackUrl,
          title: item.title,
          artist: item.artist,
          artwork: item.artwork || musicPlaceHolder,
        });
      }

      await TrackPlayer.play();
    } catch (e) {
      console.log('Error starting track in SavedSessionsScreen:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Sessions</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: theme.spacing.xxl * 2.5 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={isTablet() ? 26 : 20}
            color={Colors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your saved sessions..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {savedTracks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="heart-outline"
              size={wp(20)}
              color={Colors.border}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptySubtitle}>
              Sessions you save by tapping the heart icon will appear here for
              quick access.
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, { width: '80%', marginTop: 30 }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Explore')}
            >
              <Text style={styles.browseButtonText}>Discover Sessions</Text>
            </TouchableOpacity>
          </View>
        ) : filteredTracks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="search-outline"
              size={wp(15)}
              color={Colors.border}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find any saved sessions matching "{searchQuery}"
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, { width: '60%', marginTop: 20 }]}
              activeOpacity={0.8}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.browseButtonText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FAVORITE SESSIONS</Text>
              {filteredTracks.map(track => (
                <SessionListItem
                  key={track.id}
                  image={{ uri: track.artwork }}
                  title={track.title}
                  duration={`${Math.floor(track.duration / 60)} min`}
                  fileSize="Dynamic MB"
                  onPlayPress={() => handleTrackSelect(track)}
                  isPlaying={isPlaying && isSessionActive(track)}
                  isActive={isSessionActive(track)}
                  isLoading={isBuffering && isSessionActive(track)}
                  onPress={() => handleTrackSelect(track)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.browseButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseButtonText}>Browse More Content</Text>
            </TouchableOpacity>
          </>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.layout.containerPadding,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.lg,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.containerPadding,
    paddingBottom: theme.spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  browseButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: theme.radius.xl,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  browseButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isTablet() ? theme.spacing.sm * 1.5 : theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xl,
    color: Colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: isTablet() ? 45 : 22,
  },
});

export default SavedSessionsScreen;
