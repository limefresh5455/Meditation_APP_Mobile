import TrackPlayer, { Event, State } from 'react-native-track-player';

let wasPlayingBeforeInterruption = false;

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());
  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext(),
  );
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );

  TrackPlayer.addEventListener(Event.RemoteDuck, async event => {
    if (event.paused) {
      const state = await TrackPlayer.getState();
      wasPlayingBeforeInterruption = state === State.Playing;
      await TrackPlayer.pause();
    } else if (!event.permanent && wasPlayingBeforeInterruption) {
      wasPlayingBeforeInterruption = false;
      await TrackPlayer.play();
    }
  });
}
