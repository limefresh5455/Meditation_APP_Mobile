import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderRadius?: number;
}

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  height = 4,
  backgroundColor = Colors.storageBackground,
  progressColor = Colors.storageUsed,
  borderRadius = 2,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: progressColor,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar;
