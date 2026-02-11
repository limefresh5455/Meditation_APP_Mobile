import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import HomeScreen from '../screens/dashboard/HomeScreen';
import ExploreScreen from '../screens/dashboard/ExploreScreen';
import LibraryScreen from '../screens/dashboard/LibraryScreen';
import StatsScreen from '../screens/dashboard/StatsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { theme } from '../utils/responsive';

const Tab = createBottomTabNavigator();

const BottomTab: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.iconInactive,
        tabBarLabelStyle: {
          fontFamily: FONTS.Regular,
          fontSize: theme.font.xs,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon icon="🔍" color={color} />,
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon icon="📚" color={color} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon icon="📊" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Simple icon component
const TabIcon: FC<{ icon: string; color: string }> = ({ icon, color }) => {
  const { Text } = require('react-native');
  return (
    <Text style={{ fontSize: 24, opacity: color === Colors.primary ? 1 : 0.5 }}>
      {icon}
    </Text>
  );
};

export default BottomTab;
