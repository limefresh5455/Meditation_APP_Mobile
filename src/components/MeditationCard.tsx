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

interface MeditationCardProps {
  image: ImageSourcePropType;
  title: string;
  subtitle?: string;
  duration?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'square' | 'rectangle';
  onPress?: () => void;
}

const MeditationCard: FC<MeditationCardProps> = ({
  image,
  title,
  subtitle,
  duration,
  size = 'medium',
  variant = 'square',
  onPress,
}) => {
  const cardSize =
    size === 'small'
      ? theme.image.small
      : size === 'medium'
      ? theme.image.medium
      : theme.image.large;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        variant === 'rectangle' && styles.rectangleContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={image}
        style={[
          styles.image,
          { width: cardSize, height: cardSize },
          variant === 'rectangle' && styles.rectangleImage,
        ]}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {duration && (
          <Text style={styles.duration} numberOfLines={1}>
            {duration}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  rectangleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    borderRadius: theme.radius.md,
    backgroundColor: Colors.cardBackground,
  },
  rectangleImage: {
    width: theme.image.medium,
    height: theme.image.medium,
  },
  textContainer: {
    marginTop: theme.spacing.sm,
  },
  title: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  duration: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
});

export default MeditationCard;
