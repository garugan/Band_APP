import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { FAB } from '../components/FAB';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { mockPracticeLogs, getSongById } from '../data/mockData';
import { PracticeLog } from '../data/types';
import { MainTabScreenProps } from '../navigation/types';

type Props = MainTabScreenProps<'Log'>;

type FilterType = 'this-month' | 'last-month' | 'all';

export function PracticeLogsScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<FilterType>('this-month');

  const calculateAverageAchievement = (log: PracticeLog): number => {
    if (log.songs.length === 0) return 0;
    const total = log.songs.reduce((sum, s) => sum + s.achievement, 0);
    return Math.round(total / log.songs.length);
  };

  const totalPractices = mockPracticeLogs.length;
  const overallAverage =
    totalPractices > 0
      ? Math.round(
          mockPracticeLogs.reduce(
            (sum, log) => sum + calculateAverageAchievement(log),
            0
          ) / totalPractices
        )
      : 0;

  const renderLog = ({ item }: { item: PracticeLog }) => {
    const avgAchievement = calculateAverageAchievement(item);
    const songNames = item.songs
      .map((s) => getSongById(s.songId)?.title)
      .filter(Boolean);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('LogDetail', { id: item.id })}
      >
        <Card style={styles.logCard}>
          <View style={styles.logHeader}>
            <View>
              <Text style={styles.logDate}>
                {format(item.date, 'M月d日(E)', { locale: ja })}
              </Text>
              <Text style={styles.logTime}>
                {format(item.date, 'HH:mm', { locale: ja })}
              </Text>
            </View>
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementText}>{avgAchievement}%</Text>
            </View>
          </View>

          <View style={styles.songsContainer}>
            <Feather name="music" size={14} color={colors.textSecondary} />
            <Text style={styles.songsCount}>{item.songs.length}曲</Text>
          </View>

          <View style={styles.tagsContainer}>
            {songNames.slice(0, 3).map((name, index) => (
              <Chip key={index} label={name || ''} />
            ))}
            {songNames.length > 3 && (
              <Chip label={`+${songNames.length - 3}`} />
            )}
          </View>

          {item.issues && (
            <Text style={styles.issuesText} numberOfLines={2}>
              {item.issues}
            </Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>練習ログ</Text>
      </View>

      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalPractices}</Text>
            <Text style={styles.summaryLabel}>今月の練習回数</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{overallAverage}%</Text>
            <Text style={styles.summaryLabel}>平均達成度</Text>
          </View>
        </View>
      </Card>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(['this-month', 'last-month', 'all'] as FilterType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.filterTextActive,
              ]}
            >
              {type === 'this-month'
                ? '今月'
                : type === 'last-month'
                ? '先月'
                : 'すべて'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Log List */}
      {mockPracticeLogs.length > 0 ? (
        <FlatList
          data={mockPracticeLogs}
          renderItem={renderLog}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="file-text"
          title="ログがありません"
          description="練習後にログを残して、上達を記録しましょう"
          actionLabel="ログを追加"
          onAction={() => navigation.navigate('LogAdd', {})}
        />
      )}

      <FAB onPress={() => navigation.navigate('LogAdd', {})} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  summaryCard: {
    margin: 16,
    marginBottom: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.muted,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  logCard: {
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  logTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  achievementBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  songsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  songsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  issuesText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
