import SplashScreen from '../screens/auth/SplashScreen';
import BottomTab from './BottomTab';
import PlayerScreen from '../screens/dashboard/PlayerScreen';

export const authStack = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },
];

export const dashboradStack = [
  {
    name: 'BottomTab',
    component: BottomTab,
  },
  {
    name: 'PlayerScreen',
    component: PlayerScreen,
  },
];

export const mergedStack = [...dashboradStack, ...authStack];
