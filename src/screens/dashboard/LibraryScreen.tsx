import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { theme } from '../../utils/responsive';
import SessionListItem from '../../components/SessionListItem';
import ProgressBar from '../../components/ProgressBar';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import musicData from '../../constants/musicData.json';

interface LibraryScreenProps {
  navigation: any;
}

const LibraryScreen: FC<LibraryScreenProps> = ({ navigation }) => {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const isBuffering =
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading;
  const musicPlaceHolder = require('../../assets/Images/musicPlaceHolderTransparent.png');

  const handleTrackSelect = async (item: any) => {
    const shouldNavigate = !activeTrack;

    if (activeTrack?.id === item.id) {
      await TrackPlayer.play();
      if (shouldNavigate) {
        navigation.navigate('PlayerScreen', { track: item });
      }
      return;
    }

    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: item.id,
        url: item.url,
        title: item.title,
        artist: item.artist,
        artwork: item.artwork || musicPlaceHolder,
      });

      await TrackPlayer.play();
      if (shouldNavigate) {
        navigation.navigate('PlayerScreen', { track: item });
      }
    } catch (e) {
      console.log('Error starting track in LibraryScreen:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Downloads</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your library..."
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Recently Saved */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENTLY SAVED</Text>
          <SessionListItem
            image={{ uri: musicData[2].artwork }}
            title={musicData[2].title}
            duration="15 min"
            fileSize="12.4 MB"
            onPlayPress={() => handleTrackSelect(musicData[2])}
            isPlaying={isPlaying && activeTrack?.id === musicData[2].id}
            isActive={activeTrack?.id === musicData[2].id}
            isLoading={isBuffering && activeTrack?.id === musicData[2].id}
          />
          <SessionListItem
            image={{ uri: musicData[3].artwork }}
            title={musicData[3].title}
            duration="10 min"
            fileSize="38.1 MB"
            onPlayPress={() => handleTrackSelect(musicData[3])}
            isPlaying={isPlaying && activeTrack?.id === musicData[3].id}
            isActive={activeTrack?.id === musicData[3].id}
            isLoading={isBuffering && activeTrack?.id === musicData[3].id}
          />
        </View>

        {/* Last Week */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LAST WEEK</Text>
          <SessionListItem
            image={{ uri: musicData[0].artwork }}
            title={musicData[0].title}
            duration="10 min"
            fileSize="8.9 MB"
            onPlayPress={() => handleTrackSelect(musicData[0])}
            isPlaying={isPlaying && activeTrack?.id === musicData[0].id}
            isActive={activeTrack?.id === musicData[0].id}
            isLoading={isBuffering && activeTrack?.id === musicData[0].id}
          />
          <SessionListItem
            image={{ uri: musicData[1].artwork }}
            title={musicData[1].title}
            duration="20 min"
            fileSize="16.5 MB"
            onPlayPress={() => handleTrackSelect(musicData[1])}
            isPlaying={isPlaying && activeTrack?.id === musicData[1].id}
            isActive={activeTrack?.id === musicData[1].id}
            isLoading={isBuffering && activeTrack?.id === musicData[1].id}
          />
          <SessionListItem
            image={{ uri: musicData[4].artwork }}
            title={musicData[4].title}
            duration="30 min"
            fileSize="24.2 MB"
            onPlayPress={() => handleTrackSelect(musicData[4])}
            isPlaying={isPlaying && activeTrack?.id === musicData[4].id}
            isActive={activeTrack?.id === musicData[4].id}
            isLoading={isBuffering && activeTrack?.id === musicData[4].id}
          />
        </View>

        {/* Browse More Button */}
        <TouchableOpacity style={styles.browseButton} activeOpacity={0.8}>
          <Text style={styles.browseButtonText}>Browse More Content</Text>
        </TouchableOpacity>
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
  backButton: {
    width: theme.icon.lg,
  },
  backIcon: {
    fontSize: theme.font.xxl,
    color: Colors.primary,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.lg,
    color: Colors.textPrimary,
  },
  editButton: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.primary,
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
    fontSize: theme.font.lg,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  storageContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  storageLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  storageValue: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.accentPurple,
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
});

export default LibraryScreen;
