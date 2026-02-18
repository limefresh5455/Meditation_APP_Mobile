import { Image } from 'react-native';

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number;
  artwork: string;
  url: any;
  isComposite?: boolean;
  blocks?: TrackMetadata[];
  type?: 'mp3' | 'realtime';
}

export const musicData: TrackMetadata[] = [
  {
    id: 'blocks-session',
    title: 'Blocks Meditation',
    artist: 'Daily Practice',
    album: 'Deep Focus',
    genre: 'Meditation',
    duration: 630,
    artwork: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a',
    url: '',
    isComposite: true,
    blocks: [
      {
        id: 'block-2',
        title: 'Block 2: Breathing Focus',
        artist: 'Meditation',
        duration: 150,
        artwork: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a',
        url: Image.resolveAssetSource(require('../assets/audio/Block_2.mp3'))
          .uri,
        type: 'mp3',
      },
      {
        id: 'block-3',
        title: 'Block 3: Body Scan',
        artist: 'Meditation',
        duration: 120,
        artwork: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a',
        url: Image.resolveAssetSource(require('../assets/audio/Block_3.mp3'))
          .uri,
        type: 'mp3',
      },
      {
        id: 'block-6',
        title: 'Block 6: Awareness',
        artist: 'Meditation',
        duration: 150,
        artwork: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a',
        url: Image.resolveAssetSource(require('../assets/audio/Block_6.mp3'))
          .uri,
        type: 'mp3',
      },
      {
        id: 'block-9',
        title: 'Block 9: Gratitude',
        artist: 'Meditation',
        duration: 120,
        artwork: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a',
        url: Image.resolveAssetSource(require('../assets/audio/Block_9.mp3'))
          .uri,
        type: 'mp3',
      },
      {
        id: 'block-10',
        title: 'Block 10: Conclusion',
        artist: 'Meditation',
        duration: 90,
        artwork: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a',
        url: Image.resolveAssetSource(require('../assets/audio/Block_10.mp3'))
          .uri,
        type: 'mp3',
      },
    ],
  },
  {
    id: '1',
    title: 'Morning Calm',
    artist: 'Zen Studio',
    album: 'Daily Meditation',
    genre: 'Meditation',
    duration: 420,
    artwork: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Deep Breathing',
    artist: 'Inner Peace',
    album: 'Breathwork',
    genre: 'Meditation',
    duration: 480,
    artwork: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Mindful Silence',
    artist: 'Calm Collective',
    album: 'Mindfulness',
    genre: 'Meditation',
    duration: 600,
    artwork: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: '4',
    title: 'Ocean Waves',
    artist: 'Nature Flow',
    album: 'Relaxing Nature',
    genre: 'Meditation',
    duration: 540,
    artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: '5',
    title: 'Evening Wind Down',
    artist: 'Serenity Sounds',
    album: 'Sleep & Relax',
    genre: 'Meditation',
    duration: 660,
    artwork: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: '6',
    title: 'Healing Frequencies',
    artist: 'Aura Balance',
    album: 'Healing Tones',
    genre: 'Meditation',
    duration: 720,
    artwork: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    id: '7',
    title: 'Forest Retreat',
    artist: 'Nature Flow',
    album: 'Relaxing Nature',
    genre: 'Meditation',
    duration: 540,
    artwork: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
  {
    id: '8',
    title: 'Chakra Balance',
    artist: 'Inner Energy',
    album: 'Spiritual Journey',
    genre: 'Meditation',
    duration: 630,
    artwork: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: '9',
    title: 'Stress Release',
    artist: 'Peace Path',
    album: 'Calm Mind',
    genre: 'Meditation',
    duration: 510,
    artwork: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  },
  {
    id: '10',
    title: 'Sleep Sanctuary',
    artist: 'Dream Waves',
    album: 'Deep Sleep',
    genre: 'Meditation',
    duration: 900,
    artwork: 'https://images.unsplash.com/photo-1505483531331-8325e9c6d4f6',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  },
];

export const resolveSessionTrack = (track: TrackMetadata): TrackMetadata => {
  if (track.isComposite) return track;
  const session = musicData.find(
    s => s.isComposite && s.blocks?.some(b => b.id === track.id),
  );
  return session || track;
};

export default musicData;
