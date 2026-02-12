import { s, vs, ms } from 'react-native-size-matters';
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isTablet = () => {
  const aspectRatio = height / width;
  return (
    (Platform.OS === 'ios' && aspectRatio < 1.5) ||
    (Platform.OS === 'android' && width >= 600)
  );
};

export const isLandscape = () => width > height;
export const isPortrait = () => height > width;

export const screenWidth = width;
export const screenHeight = height;

export const wp = (percentage: number) => (width * percentage) / 100;
export const hp = (percentage: number) => (height * percentage) / 100;

export const theme = {
  spacing: {
    xs: s(4),
    sm: s(8),
    md: s(16),
    lg: s(24),
    xl: s(32),
    xxl: s(40),
  },

  radius: {
    sm: s(6),
    md: s(10),
    lg: s(14),
    xl: s(20),
    xxl: s(28),
    full: 9999,
  },

  font: {
    xs: ms(10),
    sm: ms(12),
    md: ms(14),
    base: ms(16),
    lg: ms(18),
    xl: ms(22),
    xxl: ms(28),
    xxxl: ms(34),
  },

  icon: {
    xs: s(12),
    sm: s(16),
    md: s(20),
    lg: s(28),
    xl: s(36),
    xxl: s(48),
  },

  button: {
    height: vs(50),
    heightSmall: vs(40),
    heightLarge: vs(60),
  },

  image: {
    small: s(60),
    medium: s(80),
    large: s(120),
    xlarge: s(180),
  },

  layout: {
    cardWidth: '90%',
    fullWidth: '100%',
    containerPadding: s(20),
    sectionSpacing: vs(24),
  },
};
