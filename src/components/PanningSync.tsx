import React, { useEffect } from 'react';
import {
  useActiveTrack,
  usePlaybackState,
  useProgress,
  State,
} from 'react-native-track-player';
import { useAppSelector, useAppDispatch } from '../redux/reduxHook';
import { selectPanValue, setPanValue } from '../redux/reducers/musicSlice';
import PanningService from '../services/PanningService';
import { verifyLocalFile } from '../services/DownloadService';

const PanningSync: React.FC = () => {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const { position } = useProgress();
  const panValue = useAppSelector(selectPanValue);
  const dispatch = useAppDispatch();

  const isPlaying = playbackState.state === State.Playing;

  useEffect(() => {
    if (!activeTrack?.url) {
      return;
    }

    const trackUrl = activeTrack.url;
    const urlStr = typeof trackUrl === 'number' ? String(trackUrl) : trackUrl;

    if (PanningService.isActiveForUrl(urlStr)) {
      PanningService.setPan(panValue);
      return;
    }

    const setup = async () => {
      const verifiedPath = await verifyLocalFile(activeTrack.id);
      const finalUrl = verifiedPath || trackUrl;

      PanningService.setupSound(finalUrl, panValue, () => {
        if (isPlaying) {
          PanningService.syncPlayback(true, position);
        }
      });
    };

    setup();
  }, [activeTrack?.id, activeTrack?.url]);

  useEffect(() => {
    if (!activeTrack || !PanningService.hasSound()) return;
    PanningService.syncPlayback(isPlaying, position);
  }, [isPlaying, position]);

  useEffect(() => {
    PanningService.setPan(panValue);
  }, [panValue]);

  return null;
};

export default PanningSync;
