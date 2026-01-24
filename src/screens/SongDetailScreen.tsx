import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { colors } from '../theme/colors';
import { mockSongs, mockPracticeLogs, getSongById } from '../data/mockData';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'SongDetail'>;

export function SongDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const song = mockSongs.find((s) => s.id === id);

  if (!song) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>曲が見つかりません</Text>
      </View>
    );
  }

  const relatedLogs = mockPracticeLogs
    .filter((log) => log.songs.some((s) => s.songId === id))
    .slice(0, 3);

  const openReferenceUrl = () => {
    if (song.referenceUrl) {
      Linking.openURL(song.referenceUrl);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Basic Info */}
      <Card style={styles.card}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Key</Text>
            <Text style={styles.metaValue}>{song.key}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>BPM</Text>
            <Text style={styles.metaValue}>{song.bpm}</Text>
          </View>
        </View>
      </Card>

      {/* Tags */}
      {song.tags.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>タグ</Text>
          <View style={styles.tagsContainer}>
            {song.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="primary" />
            ))}
          </View>
        </Card>
      )}

      {/* Memo */}
      {song.memo && (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>メモ</Text>
          <Text style={styles.memoText}>{song.memo}</Text>
        </Card>
      )}

      {/* Reference URL */}
      {song.referenceUrl && (
        <TouchableOpacity onPress={openReferenceUrl}>
          <Card style={styles.card}>
            <View style={styles.linkRow}>
              <Feather name="external-link" size={20} color={colors.primary} />
              <Text style={styles.linkText}>参考音源を開く</Text>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textMuted}
              />
            </View>
          </Card>
        </TouchableOpacity>
      )}

      {/* Related Logs */}
      {relatedLogs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>関連する練習ログ</Text>
          {relatedLogs.map((log) => {
            const logSong = log.songs.find((s) => s.songId === id);
            return (
              <TouchableOpacity
                key={log.id}
                onPress={() => navigation.navigate('LogDetail', { id: log.id })}
              >
                <Card style={styles.logCard}>
                  <View style={styles.logRow}>
                    <View>
                      <Text style={styles.logDate}>
                        {log.date.toLocaleDateString('ja-JP')}
                      </Text>
                    </View>
                    <View style={styles.achievementBadge}>
                      <Text style={styles.achievementText}>
                        {logSong?.achievement || 0}%
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  songTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memoText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
    marginLeft: 12,
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  logCard: {
    marginBottom: 8,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logDate: {
    fontSize: 14,
    color: colors.text,
  },
  achievementBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  bottomSpacer: {
    height: 40,
  },
});
