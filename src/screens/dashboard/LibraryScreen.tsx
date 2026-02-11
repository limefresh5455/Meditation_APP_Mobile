import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { theme } from '../../utils/responsive';
import SessionListItem from '../../components/SessionListItem';
import ProgressBar from '../../components/ProgressBar';

interface LibraryScreenProps {
  navigation: any;
}

const LibraryScreen: FC<LibraryScreenProps> = ({ navigation }) => {
  const handlePlaySession = () => {
    navigation.navigate('PlayerScreen');
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your library..."
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Storage Used */}
        <View style={styles.storageContainer}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageLabel}>STORAGE USED</Text>
            <Text style={styles.storageValue}>1.2 GB of 5 GB</Text>
          </View>
          <ProgressBar progress={0.24} height={6} />
        </View>

        {/* Recently Saved */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENTLY SAVED</Text>
          <SessionListItem
            image={{ uri: 'https://via.placeholder.com/60' }}
            title="Forest Walk for Anxiety"
            duration="15 min"
            fileSize="12.4 MB"
            onPlayPress={handlePlaySession}
          />
          <SessionListItem
            image={{ uri: 'https://via.placeholder.com/60' }}
            title="Ocean Waves Sleep"
            duration="45 min"
            fileSize="38.1 MB"
            onPlayPress={handlePlaySession}
          />
        </View>

        {/* Last Week */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LAST WEEK</Text>
          <SessionListItem
            image={{ uri: 'https://via.placeholder.com/60' }}
            title="Morning Clarity"
            duration="10 min"
            fileSize="8.9 MB"
            onPlayPress={handlePlaySession}
          />
          <SessionListItem
            image={{ uri: 'https://via.placeholder.com/60' }}
            title="Stress Release Breath..."
            duration="20 min"
            fileSize="16.5 MB"
            onPlayPress={handlePlaySession}
          />
          <SessionListItem
            image={{ uri: 'https://via.placeholder.com/60' }}
            title="Midnight Reflection"
            duration="30 min"
            fileSize="24.2 MB"
            onPlayPress={handlePlaySession}
          />
        </View>

        {/* Browse More Button */}
        <TouchableOpacity style={styles.browseButton} activeOpacity={0.8}>
          <Text style={styles.browseButtonText}>Browse More Content</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.containerPadding,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: theme.icon.lg,
  },
  backIcon: {
    fontSize: theme.font.xxl,
    color: Colors.primary,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.lg,
    color: Colors.textPrimary,
  },
  editButton: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.containerPadding,
    paddingBottom: theme.spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  searchIcon: {
    fontSize: theme.font.lg,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: theme.font.md,
    color: Colors.textPrimary,
  },
  storageContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  storageLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  storageValue: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.accentPurple,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.xs,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  browseButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: theme.radius.xl,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  browseButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: theme.font.md,
    color: Colors.primary,
  },
});

export default LibraryScreen;
