import React, { useState, useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { useThemeColors } from '../contexts/ThemeContext';
import { useSongs } from '../contexts/SongContext';
import { mockPracticeLogs } from '../data/mockData';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'SongDetail'>;

export function SongDetailScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { id } = route.params;
  const { songs, updateSong, deleteSong } = useSongs();
  const song = songs.find((s) => s.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(song?.title || '');
  const [editKey, setEditKey] = useState(song?.key || '');
  const [editBpm, setEditBpm] = useState(song?.bpm?.toString() || '');
  const [editTags, setEditTags] = useState(song?.tags?.join(', ') || '');
  const [editMemo, setEditMemo] = useState(song?.memo || '');
  const [editReferenceUrl, setEditReferenceUrl] = useState(song?.referenceUrl || '');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={handleCancelEdit} style={{ padding: 8 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={{ padding: 8 }}>
                <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' as const }}>保存</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => startEditing()} style={{ padding: 8 }}>
                <Feather name="edit-2" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={{ padding: 8 }}>
                <Feather name="trash-2" size={20} color={colors.error} />
              </TouchableOpacity>
            </>
          )}
        </View>
      ),
    });
  }, [navigation, isEditing, editTitle, editKey, editBpm, editTags, editMemo, editReferenceUrl, colors]);

  const startEditing = () => {
    if (!song) return;
    setEditTitle(song.title);
    setEditKey(song.key);
    setEditBpm(song.bpm.toString());
    setEditTags(song.tags.join(', '));
    setEditMemo(song.memo);
    setEditReferenceUrl(song.referenceUrl || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!song) return;
    if (!editTitle.trim()) {
      Alert.alert('エラー', '曲名を入力してください');
      return;
    }
    if (!editKey.trim()) {
      Alert.alert('エラー', 'Keyを入力してください');
      return;
    }
    const bpmNum = parseInt(editBpm, 10);
    if (isNaN(bpmNum) || bpmNum <= 0) {
      Alert.alert('エラー', 'BPMを正しく入力してください');
      return;
    }
    const tags = editTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    updateSong(id, {
      ...song,
      title: editTitle.trim(),
      key: editKey.trim(),
      bpm: bpmNum,
      tags,
      memo: editMemo.trim(),
      referenceUrl: editReferenceUrl.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('削除確認', 'この曲を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deleteSong(id);
          navigation.goBack();
        },
      },
    ]);
  };

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
    editLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginBottom: 4,
      marginTop: 12,
    },
    editInput: {
      fontSize: 16,
      color: colors.text,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    editTextarea: {
      fontSize: 15,
      color: colors.text,
      minHeight: 80,
      padding: 0,
    },
    editRow: {
      flexDirection: 'row',
      gap: 16,
    },
    editRowItem: {
      flex: 1,
    },
    bottomSpacer: {
      height: 40,
    },
  }), [colors]);

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
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      {/* Basic Info */}
      <Card style={styles.card}>
        {isEditing ? (
          <>
            <Text style={[styles.editLabel, { marginTop: 0 }]}>曲名</Text>
            <TextInput
              style={styles.editInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="曲名"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.editRow}>
              <View style={styles.editRowItem}>
                <Text style={styles.editLabel}>Key</Text>
                <TextInput
                  style={styles.editInput}
                  value={editKey}
                  onChangeText={setEditKey}
                  placeholder="例: Am"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.editRowItem}>
                <Text style={styles.editLabel}>BPM</Text>
                <TextInput
                  style={styles.editInput}
                  value={editBpm}
                  onChangeText={setEditBpm}
                  placeholder="例: 120"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </>
        ) : (
          <>
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
          </>
        )}
      </Card>

      {/* Tags */}
      {isEditing ? (
        <Card style={styles.card}>
          <Text style={[styles.editLabel, { marginTop: 0 }]}>タグ（カンマ区切り）</Text>
          <TextInput
            style={styles.editInput}
            value={editTags}
            onChangeText={setEditTags}
            placeholder="例: ロック, アップテンポ"
            placeholderTextColor={colors.textMuted}
          />
        </Card>
      ) : song.tags.length > 0 ? (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>タグ</Text>
          <View style={styles.tagsContainer}>
            {song.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="primary" />
            ))}
          </View>
        </Card>
      ) : null}

      {/* Memo */}
      {isEditing ? (
        <Card style={styles.card}>
          <Text style={[styles.editLabel, { marginTop: 0 }]}>メモ</Text>
          <TextInput
            style={styles.editTextarea}
            value={editMemo}
            onChangeText={setEditMemo}
            placeholder="メモ（任意）"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>
      ) : song.memo ? (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>メモ</Text>
          <Text style={styles.memoText}>{song.memo}</Text>
        </Card>
      ) : null}

      {/* Reference URL */}
      {isEditing ? (
        <Card style={styles.card}>
          <Text style={[styles.editLabel, { marginTop: 0 }]}>参考URL（任意）</Text>
          <TextInput
            style={styles.editInput}
            value={editReferenceUrl}
            onChangeText={setEditReferenceUrl}
            placeholder="https://..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="url"
          />
        </Card>
      ) : song.referenceUrl ? (
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
      ) : null}

      {/* Related Logs */}
      {!isEditing && relatedLogs.length > 0 && (
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
