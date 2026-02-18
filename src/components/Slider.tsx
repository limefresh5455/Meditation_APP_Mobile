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
  orientation?: 'horizontal' | 'vertical';
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
  orientation = 'horizontal',
}) => {
  const [size, setSize] = useState(0);

  const isVertical = orientation === 'vertical';

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          onSlidingStart?.();
        },
        onPanResponderMove: (evt, gestureState) => {
          if (size > 0) {
            let newProgress;
            if (isVertical) {
              // In vertical, 0 is bottom, 1 is top
              newProgress = Math.min(
                Math.max(1 - evt.nativeEvent.locationY / size, 0),
                1,
              );
            } else {
              newProgress = Math.min(
                Math.max(evt.nativeEvent.locationX / size, 0),
                1,
              );
            }
            onSeek(newProgress);
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (size > 0) {
            let newProgress;
            if (isVertical) {
              newProgress = Math.min(
                Math.max(1 - evt.nativeEvent.locationY / size, 0),
                1,
              );
            } else {
              newProgress = Math.min(
                Math.max(evt.nativeEvent.locationX / size, 0),
                1,
              );
            }
            onSlidingComplete?.(newProgress);
          }
        },
      }),
    [size, onSeek, onSlidingStart, onSlidingComplete, isVertical],
  );

  const onLayout = (event: LayoutChangeEvent) => {
    setSize(
      isVertical
        ? event.nativeEvent.layout.height
        : event.nativeEvent.layout.width,
    );
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.container,
        isVertical ? styles.verticalContainer : styles.horizontalContainer,
      ]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View
        style={[
          isVertical ? styles.verticalTrack : styles.track,
          {
            [isVertical ? 'width' : 'height']: height,
            backgroundColor,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            isVertical ? styles.verticalProgress : styles.progress,
            {
              [isVertical ? 'height' : 'width']: `${clampedProgress * 100}%`,
              backgroundColor: progressColor,
              borderRadius: height / 2,
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            isVertical ? styles.verticalThumb : styles.horizontalThumb,
            {
              [isVertical ? 'bottom' : 'left']: `${clampedProgress * 100}%`,
              backgroundColor: thumbColor,
              width: height * 4,
              height: height * 4,
              borderRadius: height * 2,
              [isVertical ? 'marginLeft' : 'marginTop']: -(height * 2),
              [isVertical ? 'marginBottom' : 'marginLeft']: -(height * 2),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContainer: {
    width: '100%',
    height: 40,
  },
  verticalContainer: {
    height: '100%',
    width: 32,
  },
  track: {
    width: '100%',
    position: 'relative',
  },
  verticalTrack: {
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  progress: {
    height: '100%',
  },
  verticalProgress: {
    width: '100%',
  },
  thumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  horizontalThumb: {
    top: '50%',
  },
  verticalThumb: {
    left: '50%',
  },
});

export default Slider;
