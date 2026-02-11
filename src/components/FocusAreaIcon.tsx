import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { theme } from '../utils/responsive';

interface FocusAreaIconProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

const FocusAreaIcon: FC<FocusAreaIconProps> = ({
  icon,
  label,
  isActive = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, isActive && styles.iconContainerActive]}
      >
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  iconContainer: {
    width: theme.icon.xxl,
    height: theme.icon.xxl,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainerActive: {
    backgroundColor: Colors.primary,
  },
  iconText: {
    fontSize: theme.font.lg,
  },
  label: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.textPrimary,
  },
});

export default FocusAreaIcon;
