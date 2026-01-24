import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors } from '../theme/colors';

import { TabNavigator } from './TabNavigator';
import { SongDetailScreen } from '../screens/SongDetailScreen';
import { PracticeDetailScreen } from '../screens/PracticeDetailScreen';
import { LiveDetailScreen } from '../screens/LiveDetailScreen';
import { SetlistEditScreen } from '../screens/SetlistEditScreen';
import { ChecklistTemplatesScreen } from '../screens/ChecklistTemplatesScreen';
import { LogDetailScreen } from '../screens/LogDetailScreen';
import { LogAddScreen } from '../screens/LogAddScreen';
import { PracticeAddScreen } from '../screens/PracticeAddScreen';
import { LiveAddScreen } from '../screens/LiveAddScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600' as const,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetailScreen}
        options={{ title: '曲詳細' }}
      />
      <Stack.Screen
        name="SongAdd"
        component={PlaceholderScreen}
        options={{ title: '曲を追加' }}
      />
      <Stack.Screen
        name="PracticeDetail"
        component={PracticeDetailScreen}
        options={{ title: '練習詳細' }}
      />
      <Stack.Screen
        name="PracticeAdd"
        component={PracticeAddScreen}
        options={{ title: '練習を追加' }}
      />
      <Stack.Screen
        name="LiveDetail"
        component={LiveDetailScreen}
        options={{ title: 'ライブ詳細' }}
      />
      <Stack.Screen
        name="LiveAdd"
        component={LiveAddScreen}
        options={{ title: 'ライブを追加' }}
      />
      <Stack.Screen
        name="SetlistEdit"
        component={SetlistEditScreen}
        options={{ title: 'セットリスト編集' }}
      />
      <Stack.Screen
        name="ChecklistTemplates"
        component={ChecklistTemplatesScreen}
        options={{ title: 'チェックリストテンプレート' }}
      />
      <Stack.Screen
        name="LogDetail"
        component={LogDetailScreen}
        options={{ title: 'ログ詳細' }}
      />
      <Stack.Screen
        name="LogAdd"
        component={LogAddScreen}
        options={{ title: 'ログを追加' }}
      />
    </Stack.Navigator>
  );
}
