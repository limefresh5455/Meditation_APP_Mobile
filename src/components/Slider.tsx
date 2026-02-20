import React, { FC, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import RNSlider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import { isTablet } from '../utils/responsive';

interface SliderProps {
  progress: number;
  onSeek?: (progress: number) => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: (progress: number) => void;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  thumbColor?: string;
  orientation?: 'horizontal' | 'vertical';
  sliderLength?: number;
}

const Slider: FC<SliderProps> = ({
  progress,
  onSeek,
  onSlidingStart,
  onSlidingComplete,
  backgroundColor = Colors.storageBackground,
  progressColor = Colors.primary,
  thumbColor = Colors.primary,
  orientation = 'horizontal',
  sliderLength = 200,
}) => {
  const [slideValue, setSlideValue] = useState(progress);
  const [isSliding, setIsSliding] = useState(false);
  const slidingRef = useRef(false);
  const ignoreUpdatesRef = useRef(false);

  const [thumbImage, setThumbImage] = useState<ImageSourcePropType>();

  useEffect(() => {
    if (!slidingRef.current && !ignoreUpdatesRef.current) {
      setSlideValue(progress);
    }
  }, [progress]);

  useEffect(() => {
    let mounted = true;
    Icon.getImageSource('circle', 20, thumbColor).then(source => {
      if (mounted) setThumbImage(source);
    });
    return () => {
      mounted = false;
    };
  }, [thumbColor]);

  const handleSlidingStart = () => {
    slidingRef.current = true;
    setIsSliding(true);
    onSlidingStart?.();
  };

  const handleValueChange = (value: number) => {
    setSlideValue(value);
    onSeek?.(value);
  };

  const handleSlidingComplete = (value: number) => {
    slidingRef.current = false;
    setIsSliding(false);
    setSlideValue(value);
    onSlidingComplete?.(value);

    ignoreUpdatesRef.current = true;
    setTimeout(() => {
      ignoreUpdatesRef.current = false;
    }, 1000);
  };

  const isVertical = orientation === 'vertical';

  if (isVertical) {
    return (
      <View style={[styles.verticalContainer, { height: sliderLength }]}>
        <View style={[styles.verticalInner, { width: sliderLength }]}>
          <RNSlider
            style={[styles.verticalSlider, { width: sliderLength }]}
            value={slideValue}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={progressColor}
            maximumTrackTintColor={backgroundColor}
            thumbTintColor={thumbColor}
            thumbImage={thumbImage as any}
            onSlidingStart={handleSlidingStart}
            onValueChange={handleValueChange}
            onSlidingComplete={handleSlidingComplete}
            tapToSeek
          />
        </View>
      </View>
    );
  }

  return (
    <RNSlider
      style={styles.horizontalSlider}
      value={slideValue}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor={progressColor}
      maximumTrackTintColor={backgroundColor}
      thumbTintColor={thumbColor}
      thumbImage={thumbImage as any}
      onSlidingStart={handleSlidingStart}
      onValueChange={handleValueChange}
      onSlidingComplete={handleSlidingComplete}
      tapToSeek
    />
  );
};

const styles = StyleSheet.create({
  horizontalSlider: {
    width: '100%',
    height: 40,
  },
  verticalContainer: {
    flex: 1,
    width: isTablet() ? 60 : 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalInner: {
    width: isTablet() ? 320 : 200,
    height: isTablet() ? 60 : 32,
    transform: [{ rotate: '-90deg' }],
  },
  verticalSlider: {
    width: '100%',
    height: '100%',
  },
});

export default Slider;
