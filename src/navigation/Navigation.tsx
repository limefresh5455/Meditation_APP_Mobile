import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import { navigationRef } from '../utils/NavigationUtils';
import PanningSync from '../components/PanningSync';
import HistorySync from '../components/HistorySync';

export const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <PanningSync />
      <HistorySync />
      <MainNavigator />
    </NavigationContainer>
  );
};
