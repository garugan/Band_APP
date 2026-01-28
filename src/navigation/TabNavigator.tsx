import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { useThemeColors } from '../contexts/ThemeContext';

import { HomeScreen } from '../screens/HomeScreen';
import { SongsScreen } from '../screens/SongsScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { LiveEventsScreen } from '../screens/LiveEventsScreen';
import { PracticeLogsScreen } from '../screens/PracticeLogsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function TabNavigator() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Songs"
        component={SongsScreen}
        options={{
          tabBarLabel: '曲',
          tabBarIcon: ({ color, size }) => (
            <Feather name="music" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarLabel: 'スタジオ',
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveEventsScreen}
        options={{
          tabBarLabel: 'ライブ',
          tabBarIcon: ({ color, size }) => (
            <Feather name="mic" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Log"
        component={PracticeLogsScreen}
        options={{
          tabBarLabel: 'ログ',
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
