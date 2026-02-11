import React, { FC } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { theme } from '../utils/responsive';

interface SessionListItemProps {
  image: ImageSourcePropType;
  title: string;
  duration: string;
  fileSize: string;
  onPress?: () => void;
  onPlayPress?: () => void;
}

const SessionListItem: FC<SessionListItemProps> = ({
  image,
  title,
  duration,
  fileSize,
  onPress,
  onPlayPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.duration}>⏱ {duration}</Text>
          <Text style={styles.fileSize}>📁 {fileSize}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={onPlayPress}
        activeOpacity={0.7}
      >
        <Text style={styles.playIcon}>▶</Text>
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
  playIcon: {
    fontSize: theme.font.md,
    color: Colors.white,
    marginLeft: 2,
  },
});

export default SessionListItem;
