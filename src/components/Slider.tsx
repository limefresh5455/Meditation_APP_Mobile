import React, { FC, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface SliderProps {
  progress: number;
  onSeek: (progress: number) => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: (progress: number) => void;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  thumbColor?: string;
}

const Slider: FC<SliderProps> = ({
  progress,
  onSeek,
  onSlidingStart,
  onSlidingComplete,
  height = 4,
  backgroundColor = Colors.storageBackground,
  progressColor = Colors.primary,
  thumbColor = Colors.primary,
}) => {
  const [width, setWidth] = useState(0);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          onSlidingStart?.();
        },
        onPanResponderMove: (evt, gestureState) => {
          if (width > 0) {
            const newProgress = Math.min(
              Math.max(evt.nativeEvent.locationX / width, 0),
              1,
            );
            onSeek(newProgress);
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (width > 0) {
            const newProgress = Math.min(
              Math.max(evt.nativeEvent.locationX / width, 0),
              1,
            );
            onSlidingComplete?.(newProgress);
          }
        },
      }),
    [width, onSeek, onSlidingStart, onSlidingComplete],
  );

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.progress,
            {
              width: `${clampedProgress * 100}%`,
              backgroundColor: progressColor,
              borderRadius: height / 2,
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              left: `${clampedProgress * 100}%`,
              backgroundColor: thumbColor,
              width: height * 3,
              height: height * 3,
              borderRadius: (height * 3) / 2,
              marginLeft: -(height * 1.5),
              marginTop: -height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    position: 'relative',
  },
  progress: {
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Slider;
