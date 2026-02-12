import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import BottomTab from './BottomTab';
import PlayerScreen from '../screens/dashboard/PlayerScreen';

export const authStack = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },
  {
    name: 'OnboardingScreen',
    component: OnboardingScreen,
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
