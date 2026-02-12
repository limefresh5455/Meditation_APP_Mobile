import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { theme, isTablet, hp, wp, isLandscape } from '../../utils/responsive';

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: FC<OnboardingScreenProps> = ({ navigation }) => {
  const handleStartMeditation = () => {
    navigation.replace('BottomTab');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* <Text style={styles.brandName}>SERENITY</Text> */}

        <View style={styles.illustrationContainer}>
          <View style={styles.circle}>
            <Image
              source={require('../../assets/Images/logoTransparent.png')}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.heading}>Find your inner peace</Text>
          <Text style={styles.subheading}>
            Breath, relax, and let go of stress.
          </Text>
        </View>

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
  },
  brandName: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xl,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: !isTablet()
      ? theme.spacing.xxl * 1.6
      : isLandscape()
      ? theme.spacing.xxl * 1.05
      : theme.spacing.xxl * 1.8,
  },
  circle: {
    width: isTablet() ? wp(32) : wp(70),
    height: isTablet() ? wp(32) : wp(70),
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
    borderRadius: theme.radius.full,
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
  bottomIndicator: {
    width: wp(30),
    height: 4,
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.sm,
    alignSelf: 'center',
    marginTop: theme.spacing.md,
  },
});

export default OnboardingScreen;
