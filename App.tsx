import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { PracticeProvider } from './src/contexts/PracticeContext';
import { LiveProvider } from './src/contexts/LiveContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <PracticeProvider>
        <LiveProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </LiveProvider>
      </PracticeProvider>
    </SafeAreaProvider>
  );
}
