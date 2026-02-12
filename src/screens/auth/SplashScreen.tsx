import React, { FC, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { isLandscape, isTablet, theme, wp } from '../../utils/responsive';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('OnboardingScreen');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.illustrationContainer}>
          <View style={styles.circle}>
            <Image
              source={require('../../assets/Images/logoTransparent.png')}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.brandName}>SERENITY</Text>
        <Text style={styles.tagline}>Mindfulness & Meditation</Text>
      </Animated.View>

      <View
        style={[
          styles.footer,
          {
            bottom:
              isTablet() && isLandscape()
                ? theme.spacing.md
                : theme.spacing.xxl,
          },
        ]}
      >
        <Text style={styles.footerText}>Find your inner peace</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.textPrimary,
    letterSpacing: 6,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.accentPurple,
    letterSpacing: 2,
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.Medium,
    fontSize: theme.font.xs,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.lg,
    width: isTablet() && isLandscape() ? wp(35) : isTablet() ? wp(50) : wp(90),
    height: isTablet() && isLandscape() ? wp(35) : isTablet() ? wp(50) : wp(90),
  },
  circle: {
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 10,
  },
  appIcon: {
    width: isTablet() ? wp(70) : wp(120),
    height: isTablet() ? wp(70) : wp(120),
    borderRadius: theme.radius.full,
  },
});

export default SplashScreen;
