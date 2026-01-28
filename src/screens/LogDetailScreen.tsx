import React, { useMemo, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { useThemeColors } from '../contexts/ThemeContext';
import { useSongs } from '../contexts/SongContext';
import { useLogs } from '../contexts/LogContext';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'LogDetail'>;

export function LogDetailScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { songs: allSongs } = useSongs();
  const { logs, deleteLog } = useLogs();
  const { id } = route.params;
  const log = logs.find((l) => l.id === id);

  const handleDelete = () => {
    Alert.alert('削除確認', 'このログを削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deleteLog(id);
          navigation.goBack();
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={{ padding: 8 }}>
          <Feather name="trash-2" size={20} color={colors.error} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
      marginTop: 40,
    },
    card: {
      marginBottom: 12,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginLeft: 12,
    },
    section: {
      marginBottom: 12,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
    },
    songCard: {
      marginBottom: 8,
    },
    songHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    songTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    achievementText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.primary,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.muted,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    songMeta: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      marginLeft: 8,
    },
    contentText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 24,
    },
    issuesCard: {
      borderLeftWidth: 3,
      borderLeftColor: colors.error,
    },
    bottomSpacer: {
      height: 40,
    },
  }), [colors]);

  if (!log) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ログが見つかりません</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Date */}
      <Card style={styles.card}>
        <View style={styles.dateRow}>
          <Feather name="calendar" size={18} color={colors.primary} />
          <Text style={styles.dateText}>
            {format(log.date, 'yyyy年M月d日(E) HH:mm', { locale: ja })}
          </Text>
        </View>
      </Card>

      {/* Songs Achievement */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>曲の達成度</Text>
        {log.songs.map((logSong) => {
          const song = allSongs.find((s) => s.id === logSong.songId);
          return (
            <Card key={logSong.songId} style={styles.songCard}>
              <View style={styles.songHeader}>
                <Text style={styles.songTitle}>{song?.title || '不明'}</Text>
                <Text style={styles.achievementText}>{logSong.achievement}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${logSong.achievement}%` },
                  ]}
                />
              </View>
              <Text style={styles.songMeta}>
                Key: {song?.key} / BPM: {song?.bpm}
              </Text>
            </Card>
          );
        })}
      </View>

      {/* Good Points */}
      {log.goodPoints && (
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="thumbs-up" size={18} color={colors.success} />
            <Text style={[styles.sectionTitle, { color: colors.success }]}>
              良かった点
            </Text>
          </View>
          <Text style={styles.contentText}>{log.goodPoints}</Text>
        </Card>
      )}

      {/* Issues */}
      {log.issues && (
        <Card style={[styles.card, styles.issuesCard]}>
          <View style={styles.sectionHeader}>
            <Feather name="alert-circle" size={18} color={colors.error} />
            <Text style={[styles.sectionTitle, { color: colors.error }]}>
              課題・改善点
            </Text>
          </View>
          <Text style={styles.contentText}>{log.issues}</Text>
        </Card>
      )}

      {/* Next Actions */}
      {log.nextActions && (
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="target" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              次回への取り組み
            </Text>
          </View>
          <Text style={styles.contentText}>{log.nextActions}</Text>
        </Card>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}
