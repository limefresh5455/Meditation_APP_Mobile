import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { FC } from 'react';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import { theme } from '../../utils/responsive';

const ExploreScreen: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: theme.font.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: theme.font.base,
    color: Colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});

export default ExploreScreen;
