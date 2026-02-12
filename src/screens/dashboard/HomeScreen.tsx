import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { theme, isTablet, isLandscape, wp } from '../../utils/responsive';
import FocusAreaIcon from '../../components/FocusAreaIcon';
import LinearGradient from 'react-native-linear-gradient';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handlePlaySession = () => {
    navigation.navigate('PlayerScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subtitle}>Take a deep breath and relax.</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Session Card */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dailySessionCard}
        >
          <View style={styles.dailySessionContent}>
            <Text style={styles.dailySessionLabel}>DAILY SESSION</Text>
            <Text style={styles.dailySessionTitle}>
              10 min Calm{'\n'}Session
            </Text>
            <Text style={styles.dailySessionDescription}>
              Relieve stress and find your center with deep breathing.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              activeOpacity={0.8}
              onPress={handlePlaySession}
            >
              <Text style={styles.startButtonIcon}>▶</Text>
              <Text style={styles.startButtonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dailySessionImage}>
            <Text style={styles.leafEmoji}>🍃</Text>
          </View>
        </LinearGradient>

        {/* Focus Areas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Focus Areas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.focusAreasContainer}>
            <FocusAreaIcon iconName="fitness-outline" label="Stress" />
            <FocusAreaIcon iconName="moon-outline" label="Sleep" />
            <FocusAreaIcon iconName="bulb-outline" label="Focus" />
            <FocusAreaIcon iconName="heart-outline" label="Anxiety" />
          </View>
        </View>

        {/* Continue Last Session */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue last session</Text>
          <View style={styles.continueSessionCard}>
            <View style={styles.continueSessionThumbnail}>
              <Text style={styles.thumbnailEmoji}>🌲</Text>
            </View>
            <View style={styles.continueSessionInfo}>
              <Text style={styles.continueSessionTitle}>Forest Whispers</Text>
              <Text style={styles.continueSessionSubtitle}>
                Deep Relaxation • 22 min left
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.playButtonSmall}
              onPress={handlePlaySession}
            >
              <Text style={styles.playIconSmall}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mindful Moments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mindful Moments</Text>
          <View style={styles.mindfulMomentsGrid}>
            <View style={styles.mindfulCard}>
              <View style={styles.mindfulCardImage}>
                <Text style={styles.mindfulEmoji}>🌊</Text>
              </View>
              <Text style={styles.mindfulCardTitle}>Tidal Flow</Text>
              <Text style={styles.mindfulCardSubtitle}>5 MIN • FOCUS</Text>
            </View>
            <View style={styles.mindfulCard}>
              <View style={styles.mindfulCardImage}>
                <Text style={styles.mindfulEmoji}>🪴</Text>
              </View>
              <Text style={styles.mindfulCardTitle}>Zen Garden</Text>
              <Text style={styles.mindfulCardSubtitle}>15 MIN • RELAX</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  notificationButton: {
    width: theme.icon.xl,
    height: theme.icon.xl,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: theme.font.lg,
  },
  dailySessionCard: {
    marginHorizontal: theme.layout.containerPadding,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    minHeight: 180,
  },
  dailySessionContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dailySessionLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.white,
    letterSpacing: 1,
  },
  dailySessionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.white,
    marginVertical: theme.spacing.sm,
  },
  dailySessionDescription: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.sm,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.md,
  },
  startButton: {
    backgroundColor: Colors.white,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  startButtonIcon: {
    fontSize: theme.font.sm,
    color: Colors.primary,
    marginRight: theme.spacing.xs,
  },
  startButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.sm,
    color: Colors.primary,
  },
  dailySessionImage: {
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafEmoji: {
    fontSize: wp(20),
    opacity: 0.3,
  },
  section: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.layout.containerPadding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.lg,
    color: Colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.primary,
    letterSpacing: 1,
  },
  focusAreasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  continueSessionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueSessionThumbnail: {
    width: theme.image.small,
    height: theme.image.small,
    borderRadius: theme.radius.sm,
    backgroundColor: '#D4C5A0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailEmoji: {
    fontSize: theme.font.xxl,
  },
  continueSessionInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  continueSessionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  continueSessionSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '60%',
    backgroundColor: Colors.primary,
  },
  playButtonSmall: {
    width: theme.icon.xl,
    height: theme.icon.xl,
    borderRadius: theme.radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  playIconSmall: {
    fontSize: theme.font.md,
    color: Colors.white,
    marginLeft: 2,
  },
  mindfulMomentsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mindfulCard: {
    width: '48%',
  },
  mindfulCardImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.radius.md,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  mindfulEmoji: {
    fontSize: wp(15),
  },
  mindfulCardTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  mindfulCardSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default HomeScreen;
