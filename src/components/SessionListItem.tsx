import React, { FC } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { isTablet, theme } from '../utils/responsive';
import MusicImage from './MusicImage';

import Icon from 'react-native-vector-icons/Ionicons';

interface SessionListItemProps {
  image: any;
  title: string;
  duration: string;
  fileSize: string;
  onPress?: () => void;
  onPlayPress?: () => void;
  isPlaying?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
}

const SessionListItem: FC<SessionListItemProps> = ({
  image,
  title,
  duration,
  fileSize,
  onPress,
  onPlayPress,
  isPlaying,
  isActive,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MusicImage uri={image} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text
          style={[styles.title, isActive && styles.activeTitle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.duration}>⏱ {duration}</Text>
          <Text style={styles.fileSize}>📁 {fileSize}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.playButton, isActive && styles.activePlayButton]}
        onPress={onPlayPress}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            size={isTablet() ? 40 : 20}
            color={Colors.white}
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  thumbnail: {
    width: theme.image.small,
    height: theme.image.small,
    borderRadius: theme.radius.sm,
    backgroundColor: Colors.cardBackgroundLight,
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  title: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  fileSize: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.accentPurple,
  },
  playButton: {
    width: theme.icon.xl,
    height: theme.icon.xl,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  activeContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  activeTitle: {
    color: Colors.primary,
  },
  activePlayButton: {
    backgroundColor: Colors.primary,
  },
  playIcon: {
    fontSize: theme.font.md,
    color: Colors.white,
  },
});

export default SessionListItem;
