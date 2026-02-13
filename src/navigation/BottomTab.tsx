import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/dashboard/HomeScreen';
import ExploreScreen from '../screens/dashboard/ExploreScreen';
import LibraryScreen from '../screens/dashboard/LibraryScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import { Colors } from '../constants/Colors';
import { FONTS } from '../constants/Fonts';
import { isTablet, theme } from '../utils/responsive';
import MiniPlayer from '../components/MiniPlayer';

const Tab = createBottomTabNavigator();

const BottomTab: FC = () => {
  const insets = useSafeAreaInsets();
  const iconSize = isTablet() ? 28 : 24;
  const tabHeight = isTablet() ? 80 + insets.bottom : 60 + insets.bottom;

  return (
    <>
      <MiniPlayer bottomOffset={tabHeight} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: tabHeight,
            paddingBottom: insets.bottom + 8,
            paddingTop: isTablet() ? 14 : 12,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.iconInactive,
          tabBarLabelStyle: {
            fontFamily: FONTS.Regular,
            fontSize: isTablet() ? theme.font.sm : theme.font.xs,
            marginTop: isTablet() ? 4 : 2,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={iconSize}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name={focused ? 'compass' : 'compass-outline'}
                size={iconSize}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name={focused ? 'library' : 'library-outline'}
                size={iconSize}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name={focused ? 'person' : 'person-outline'}
                size={iconSize}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTab;
