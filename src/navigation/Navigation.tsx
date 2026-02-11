import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import { navigationRef } from '../utils/NavigationUtils';

export const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
};
