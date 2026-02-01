import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { PracticeProvider } from './src/contexts/PracticeContext';
import { LiveProvider } from './src/contexts/LiveContext';
import { SongProvider } from './src/contexts/SongContext';
import { LogProvider } from './src/contexts/LogContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { ProfileProvider } from './src/contexts/ProfileContext';

function AppContent() {
  const { isDark, colors } = useTheme();

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ProfileProvider>
          <SongProvider>
            <PracticeProvider>
              <LiveProvider>
                <LogProvider>
                  <AppContent />
                </LogProvider>
              </LiveProvider>
            </PracticeProvider>
          </SongProvider>
        </ProfileProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
