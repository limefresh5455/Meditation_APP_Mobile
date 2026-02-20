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
  lastPlayedPosition: number;
  previousTrack: Track | null;
  previousPosition: number;
  isContinuingCurrent: boolean;
  savedTrackIds: string[];
  offlineTrackIds: string[];
  isRepeatOne: boolean;
  panValue: number;
}

const initialState: MusicState = {
  lastPlayedTrack: null,
  lastPlayedPosition: 0,
  previousTrack: null,
  previousPosition: 0,
  isContinuingCurrent: false,
  savedTrackIds: [],
  offlineTrackIds: [],
  isRepeatOne: false,
  panValue: 0,
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setTrackHistory: (
      state,
      action: PayloadAction<{ track: Track; isContinuing?: boolean }>,
    ) => {
      const { track: newTrack, isContinuing } = action.payload;

      // If it's the same track and we are already "continuing", do nothing
      if (state.lastPlayedTrack?.id === newTrack.id) {
        if (isContinuing) {
          state.isContinuingCurrent = true;
        }
        return;
      }

      // If we are "continuing" a session (from history card),
      // we might be continuing the previous track
      if (isContinuing) {
        // Switch them back if needed
        if (state.previousTrack?.id === newTrack.id) {
          const tempTrack = state.lastPlayedTrack;
          const tempPos = state.lastPlayedPosition;

          state.lastPlayedTrack = state.previousTrack;
          state.lastPlayedPosition = state.previousPosition;

          state.previousTrack = tempTrack;
          state.previousPosition = tempPos;
        } else {
          // If it's something else but marked as continuing (shouldn't really happen from card)
          if (state.lastPlayedTrack) {
            state.previousTrack = state.lastPlayedTrack;
            state.previousPosition = state.lastPlayedPosition;
          }
          state.lastPlayedTrack = newTrack;
          state.lastPlayedPosition = 0;
        }
        state.isContinuingCurrent = true;
        return;
      }

      // Normal discovery flow (Library, Search, etc.)
      if (state.lastPlayedTrack) {
        state.previousTrack = state.lastPlayedTrack;
        state.previousPosition = state.lastPlayedPosition;
      }

      state.lastPlayedTrack = newTrack;
      state.lastPlayedPosition = 0;
      state.isContinuingCurrent = false;
      state.panValue = 0;
    },
    updateCurrentPosition: (state, action: PayloadAction<number>) => {
      state.lastPlayedPosition = action.payload;
    },
    clearHistory: state => {
      state.lastPlayedTrack = null;
      state.lastPlayedPosition = 0;
      state.previousTrack = null;
      state.previousPosition = 0;
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
    setPanValue: (state, action: PayloadAction<number>) => {
      state.panValue = action.payload;
    },
  },
});

export const {
  setTrackHistory,
  updateCurrentPosition,
  clearHistory,
  toggleSaveTrack,
  toggleOfflineTrack,
  toggleRepeatMode,
  setPanValue,
} = musicSlice.actions;

export const selectLastPlayedTrack = (state: RootState) =>
  state.music.lastPlayedTrack;
export const selectLastPlayedPosition = (state: RootState) =>
  state.music.lastPlayedPosition;
export const selectPreviousTrack = (state: RootState) =>
  state.music.previousTrack;
export const selectPreviousPosition = (state: RootState) =>
  state.music.previousPosition;
export const selectIsContinuingCurrent = (state: RootState) =>
  state.music.isContinuingCurrent;

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

export const selectPanValue = createSelector(
  [selectMusicState],
  (music: MusicState) => music.panValue ?? 0,
);

export default musicSlice.reducer;
