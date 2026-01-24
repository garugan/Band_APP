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
import { FAB } from '../components/FAB';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { LiveEvent } from '../data/types';
import { MainTabScreenProps } from '../navigation/types';
import { useLiveEvents } from '../contexts/LiveContext';

type Props = MainTabScreenProps<'Live'>;

type FilterType = 'all' | 'scheduled' | 'completed';

export function LiveEventsScreen({ navigation }: Props) {
  const { liveEvents } = useLiveEvents();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredEvents = liveEvents
    .filter((event) => {
      if (filter === 'all') return true;
      return event.status === filter;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const renderEvent = ({ item }: { item: LiveEvent }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('LiveDetail', { id: item.id })}
    >
      <Card style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status === 'scheduled'
                ? styles.statusScheduled
                : styles.statusCompleted,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === 'scheduled'
                  ? styles.statusTextScheduled
                  : styles.statusTextCompleted,
              ]}
            >
              {item.status === 'scheduled' ? '予定' : '完了'}
            </Text>
          </View>
        </View>
        <View style={styles.eventInfo}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {format(item.date, 'M月d日(E) HH:mm', { locale: ja })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>{item.venue}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="music" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              セットリスト {item.setlist.length}曲
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ライブ</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(['all', 'scheduled', 'completed'] as FilterType[]).map((type) => (
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
              {type === 'all' ? 'すべて' : type === 'scheduled' ? '予定' : '完了'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event List */}
      {filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="mic"
          title="ライブがありません"
          description="ライブを追加して、セットリストやチェックリストを管理しましょう"
          actionLabel="ライブを追加"
          onAction={() => navigation.navigate('LiveAdd')}
        />
      )}

      <FAB onPress={() => navigation.navigate('LiveAdd')} />
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
  eventCard: {
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusScheduled: {
    backgroundColor: colors.primaryLight,
  },
  statusCompleted: {
    backgroundColor: colors.successLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statusTextScheduled: {
    color: colors.primary,
  },
  statusTextCompleted: {
    color: colors.success,
  },
  eventInfo: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});
