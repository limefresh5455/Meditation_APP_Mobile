import React, { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
  State,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { theme, wp } from '../utils/responsive';
import * as NavigationUtils from '../utils/NavigationUtils';
import { resolveSessionTrack } from '../constants/musicData';

const musicPlaceHolder = require('../assets/Images/musicPlaceHolderTransparent.png');

interface MiniPlayerProps {
  bottomOffset: number;
}

interface MusicImageProps {
  uri?: string;
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

const MiniPlayer: FC<MiniPlayerProps> = ({ bottomOffset }) => {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const isPlaying = playbackState.state === State.Playing;

  if (!activeTrack) return null;

  const progress = duration > 0 ? position / duration : 0;

  const handlePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handlePress = () => {
    NavigationUtils.navigate('PlayerScreen', {
      track: resolveSessionTrack(activeTrack as any),
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { bottom: bottomOffset + 8 }]}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <MusicImage uri={activeTrack.artwork} style={styles.artwork} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {activeTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {activeTrack.artist}
          </Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          {playbackState.state === State.Buffering ||
          playbackState.state === State.Loading ? (
            <ActivityIndicator color={Colors.textPrimary} size="small" />
          ) : (
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={Colors.textPrimary}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressIndicator, { width: `${progress * 100}%` }]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    height: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  artwork: {
    width: 45,
    height: 45,
    borderRadius: theme.radius.sm,
    backgroundColor: Colors.cardBackgroundLight,
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.sm,
    color: Colors.textPrimary,
  },
  artist: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  playButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: theme.font.lg,
    color: Colors.textPrimary,
  },
  progressBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: Colors.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});

export default MiniPlayer;
