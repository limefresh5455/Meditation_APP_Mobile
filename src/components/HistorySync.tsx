import React, { useEffect } from 'react';
import { useProgress, useActiveTrack } from 'react-native-track-player';
import { useAppDispatch } from '../redux/reduxHook';
import { updateCurrentPosition } from '../redux/reducers/musicSlice';
import musicData from '../constants/musicData';

const HistorySync: React.FC = () => {
  const { position } = useProgress();
  const activeTrack = useActiveTrack();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeTrack && position > 0) {
      const session = musicData.find(
        m =>
          m.isComposite && m.blocks?.some((b: any) => b.id === activeTrack.id),
      );

      if (session && session.blocks) {
        let accumulatedTime = 0;
        for (const block of session.blocks) {
          if (block.id === activeTrack.id) {
            break;
          }
          accumulatedTime += block.duration || 0;
        }
        dispatch(updateCurrentPosition(accumulatedTime + position));
      } else {
        dispatch(updateCurrentPosition(position));
      }
    }
  }, [position, activeTrack?.id]);

  return null;
};

export default HistorySync;
