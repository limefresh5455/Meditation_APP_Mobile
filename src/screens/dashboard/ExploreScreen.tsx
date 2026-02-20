import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { isTablet, theme, wp } from '../../utils/responsive';
import musicData from '../../constants/musicData';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import { verifyLocalFile } from '../../services/DownloadService';
import {
  setTrackHistory,
  updateCurrentPosition,
} from '../../redux/reducers/musicSlice';
import { useAppDispatch } from '../../redux/reduxHook';

const musicPlaceHolder = require('../../assets/Images/musicPlaceHolderTransparent.png');

interface MusicImageProps {
  uri: string;
  style: any;
}

const MusicImage: FC<MusicImageProps> = ({ uri, style }) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <Image
      source={hasError || !uri ? musicPlaceHolder : { uri }}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: FC<ExploreScreenProps> = ({ navigation }) => {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const dispatch = useAppDispatch();
  const isPlaying = playbackState.state === State.Playing;
  const isBuffering =
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading;

  const isTrackActive = (item: any): boolean => {
    if (!activeTrack) return false;
    if (item.isComposite && item.blocks) {
      return item.blocks.some((block: any) => block.id === activeTrack.id);
    }
    return activeTrack.id === item.id;
  };

  const handleTrackSelect = async (item: any) => {
    try {
      const isSameTrack = isTrackActive(item);
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
        console.log('Explore: Setting up track with URL:', playbackUrl);

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
      console.log('Error in handleTrackSelect:', e);
    }
  };

  const renderMusicItem = ({ item }: { item: any }) => {
    const isActive = isTrackActive(item);
    const isCurrentPlaying = isActive && isPlaying;

    return (
      <TouchableOpacity
        style={[styles.musicItem, isActive && styles.activeMusicItem]}
        onPress={() => handleTrackSelect(item)}
        activeOpacity={0.7}
      >
        <MusicImage uri={item.artwork} style={styles.artwork} />
        <View style={styles.itemInfo}>
          <Text
            style={[styles.itemTitle, isActive && styles.activeItemTitle]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.itemArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          {isActive && isBuffering ? (
            <ActivityIndicator
              color={Colors.primary}
              size="small"
              style={{ marginBottom: 4 }}
            />
          ) : (
            <Icon
              name={isCurrentPlaying ? 'pause-circle' : 'play-circle'}
              size={isTablet() ? 48 : 28}
              color={isActive ? Colors.primary : Colors.textTertiary}
            />
          )}
          <Text style={styles.durationText}>
            {Math.floor(item.duration / 60)}:
            {(item.duration % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover your peace</Text>
      </View>
      <FlatList
        data={musicData}
        renderItem={renderMusicItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: isTablet()
              ? theme.spacing.xxl * 1.5
              : theme.spacing.xxl * 2,
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: theme.layout.containerPadding,
    paddingVertical: theme.spacing.lg,
  },
  listContent: {
    paddingHorizontal: theme.layout.containerPadding,
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.base,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  artwork: {
    width: wp(15),
    height: wp(15),
    borderRadius: theme.radius.md,
    backgroundColor: Colors.cardBackgroundLight,
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  itemTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.base,
    color: Colors.textPrimary,
  },
  itemArtist: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activeMusicItem: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  activeItemTitle: {
    color: Colors.primary,
  },
  rightContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  durationText: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});

export default ExploreScreen;
