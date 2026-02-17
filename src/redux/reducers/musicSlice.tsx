import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const EMPTY_ARRAY: string[] = [];

interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
  duration?: number;
  [key: string]: any;
}

interface MusicState {
  lastPlayedTrack: Track | null;
  playbackPosition: number;
  savedTrackIds: string[];
  offlineTrackIds: string[];
  isRepeatOne: boolean;
}

const initialState: MusicState = {
  lastPlayedTrack: null,
  playbackPosition: 0,
  savedTrackIds: [],
  offlineTrackIds: [],
  isRepeatOne: false,
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setLastPlayedTrack: (state, action: PayloadAction<Track>) => {
      state.lastPlayedTrack = action.payload;
    },
    updatePlaybackPosition: (state, action: PayloadAction<number>) => {
      state.playbackPosition = action.payload;
    },
    clearLastPlayedTrack: state => {
      state.lastPlayedTrack = null;
      state.playbackPosition = 0;
    },
    toggleSaveTrack: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;
      if (!state.savedTrackIds) {
        state.savedTrackIds = [];
      }
      if (state.savedTrackIds.includes(trackId)) {
        state.savedTrackIds = state.savedTrackIds.filter(id => id !== trackId);
      } else {
        state.savedTrackIds.push(trackId);
      }
    },
    toggleOfflineTrack: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;
      if (!state.offlineTrackIds) {
        state.offlineTrackIds = [];
      }
      const index = state.offlineTrackIds.indexOf(trackId);
      if (index >= 0) {
        state.offlineTrackIds.splice(index, 1);
      } else {
        state.offlineTrackIds.push(trackId);
      }
    },
    toggleRepeatMode: state => {
      state.isRepeatOne = !state.isRepeatOne;
    },
  },
});

export const {
  setLastPlayedTrack,
  updatePlaybackPosition,
  clearLastPlayedTrack,
  toggleSaveTrack,
  toggleOfflineTrack,
  toggleRepeatMode,
} = musicSlice.actions;

export const selectLastPlayedTrack = (state: RootState) =>
  state.music.lastPlayedTrack;
export const selectPlaybackPosition = (state: RootState) =>
  state.music.playbackPosition;

const selectMusicState = (state: RootState) => state.music;

export const selectSavedTrackIds = createSelector(
  [selectMusicState],
  (music: MusicState) => music.savedTrackIds || EMPTY_ARRAY,
);

export const selectOfflineTrackIds = createSelector(
  [selectMusicState],
  (music: MusicState) => music.offlineTrackIds || EMPTY_ARRAY,
);

export const selectIsRepeatOne = createSelector(
  [selectMusicState],
  (music: MusicState) => music.isRepeatOne,
);

export default musicSlice.reducer;
