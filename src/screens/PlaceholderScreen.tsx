import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Card } from '../components/Card';
import { colors } from '../theme/colors';

export function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Feather name="tool" size={48} color={colors.textMuted} />
        <Text style={styles.title}>開発中</Text>
        <Text style={styles.description}>
          この機能は現在開発中です。{'\n'}
          今後のアップデートをお待ちください。
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
