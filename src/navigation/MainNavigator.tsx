import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mergedStack } from './ScreenCollection';

const Stack = createNativeStackNavigator();

const MainNavigator: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SplashScreen"
    >
      {mergedStack.map((item, index) => {
        return (
          <Stack.Screen
            key={index}
            name={item?.name}
            component={item?.component}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default MainNavigator;
