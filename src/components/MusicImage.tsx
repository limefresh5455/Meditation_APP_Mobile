import { Image, ImageStyle, StyleProp } from 'react-native';
import React, { FC, useState, useEffect } from 'react';

const musicPlaceHolder = require('../assets/Images/musicPlaceHolderTransparent.png');

interface MusicImageProps {
  uri?: any;
  style: StyleProp<ImageStyle>;
}

const MusicImage: FC<MusicImageProps> = ({ uri, style }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [uri]);

  const getSource = () => {
    if (hasError || !uri) return musicPlaceHolder;
    if (typeof uri === 'number') return uri;
    if (typeof uri === 'object' && uri.uri) return uri;
    if (typeof uri === 'string' && uri.trim() !== '') return { uri };
    return musicPlaceHolder;
  };

  return (
    <Image
      source={getSource()}
      style={style}
      onError={() => {
        console.log('MusicImage Error for URI:', uri);
        setHasError(true);
      }}
    />
  );
};

export default MusicImage;
