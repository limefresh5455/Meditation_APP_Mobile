import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { theme, isTablet, hp, wp } from '../../utils/responsive';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: FC<SplashScreenProps> = ({ navigation }) => {
  const handleStartMeditation = () => {
    navigation.replace('BottomTab');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brandName}>SERENITY</Text>

        <View style={styles.illustrationContainer}>
          <View style={styles.circle}>
            <Text style={styles.meditationEmoji}>🧘</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.heading}>Find your inner peace</Text>
          <Text style={styles.subheading}>
            Breath, relax, and let go of stress.
          </Text>
        </View>
        {/* 
        <View style={styles.pageIndicators}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View> */}

        <TouchableOpacity
          style={[
            styles.button,
            {
              marginVertical: theme.spacing.lg,
            },
          ]}
          activeOpacity={0.8}
          onPress={handleStartMeditation}
        >
          <Text style={styles.buttonText}>Start Meditation</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity> */}

        <View style={styles.bottomIndicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.containerPadding,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xl,
  },
  brandName: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xl,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
    marginTop: theme.spacing.lg,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.xl,
  },
  circle: {
    width: isTablet() ? wp(50) : wp(70),
    height: isTablet() ? wp(50) : wp(70),
    borderRadius: theme.radius.full,
    backgroundColor: '#E8D5C4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 10,
  },
  meditationEmoji: {
    fontSize: isTablet() ? wp(25) : wp(35),
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  heading: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subheading: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.base,
    color: Colors.accentPurple,
    textAlign: 'center',
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.cardBackground,
    marginHorizontal: theme.spacing.xs,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.base,
    color: Colors.white,
  },
  loginText: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  loginLink: {
    color: Colors.primary,
    fontFamily: FONTS.SemiBold,
  },
  bottomIndicator: {
    width: wp(30),
    height: 4,
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.sm,
    alignSelf: 'center',
    marginTop: theme.spacing.md,
  },
});

export default SplashScreen;
