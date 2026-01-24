import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { FAB } from '../components/FAB';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { mockSongs } from '../data/mockData';
import { Song } from '../data/types';
import { MainTabScreenProps } from '../navigation/types';

type Props = MainTabScreenProps<'Songs'>;

export function SongsScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = mockSongs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSong = ({ item }: { item: Song }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('SongDetail', { id: item.id })}
    >
      <Card style={styles.songCard}>
        <View style={styles.songHeader}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <View style={styles.songMeta}>
            <Text style={styles.metaText}>Key: {item.key}</Text>
            <Text style={styles.metaText}>BPM: {item.bpm}</Text>
            {item.referenceUrl && (
              <Feather
                name="external-link"
                size={14}
                color={colors.textSecondary}
              />
            )}
          </View>
        </View>
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Chip key={index} label={tag} />
            ))}
          </View>
        )}
        {item.memo && (
          <Text style={styles.memo} numberOfLines={2}>
            {item.memo}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>曲一覧</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="曲を検索..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Song List */}
      {filteredSongs.length > 0 ? (
        <FlatList
          data={filteredSongs}
          renderItem={renderSong}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="music"
          title="曲がありません"
          description={
            searchQuery
              ? '検索条件に一致する曲が見つかりませんでした'
              : '曲を追加して、練習やライブの管理を始めましょう'
          }
          actionLabel={searchQuery ? undefined : '曲を追加'}
          onAction={
            searchQuery ? undefined : () => navigation.navigate('SongAdd')
          }
        />
      )}

      <FAB onPress={() => navigation.navigate('SongAdd')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.muted,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    paddingVertical: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  songCard: {
    marginBottom: 12,
  },
  songHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    flex: 1,
  },
  songMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  memo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
    lineHeight: 20,
  },
});
