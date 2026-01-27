import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { getSongById } from '../data/mockData';
import { RootStackScreenProps } from '../navigation/types';
import { ChecklistItem } from '../data/types';
import { useLiveEvents } from '../contexts/LiveContext';

type Props = RootStackScreenProps<'LiveDetail'>;

export function LiveDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { liveEvents, updateLiveEvent, deleteLiveEvent } = useLiveEvents();
  const liveEvent = liveEvents.find((e) => e.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(liveEvent?.title || '');
  const [editVenue, setEditVenue] = useState(liveEvent?.venue || '');
  const [editMeetTime, setEditMeetTime] = useState(liveEvent?.meetTime || '');
  const [editMemo, setEditMemo] = useState(liveEvent?.memo || '');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    liveEvent?.checklist || []
  );

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
  }, [navigation, isEditing, editTitle, editVenue, editMeetTime, editMemo, checklist]);

  const startEditing = () => {
    if (!liveEvent) return;
    setEditTitle(liveEvent.title);
    setEditVenue(liveEvent.venue);
    setEditMeetTime(liveEvent.meetTime || '');
    setEditMemo(liveEvent.memo);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!liveEvent) return;
    if (!editTitle.trim()) {
      Alert.alert('エラー', 'イベント名を入力してください');
      return;
    }
    if (!editVenue.trim()) {
      Alert.alert('エラー', '会場を入力してください');
      return;
    }
    updateLiveEvent(id, {
      ...liveEvent,
      title: editTitle.trim(),
      venue: editVenue.trim(),
      meetTime: editMeetTime.trim() || undefined,
      memo: editMemo.trim(),
      checklist,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('削除確認', 'このライブを削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deleteLiveEvent(id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleToggleStatus = () => {
    if (!liveEvent) return;
    const newStatus = liveEvent.status === 'scheduled' ? 'completed' : 'scheduled';
    updateLiveEvent(id, { ...liveEvent, status: newStatus, checklist });
  };

  if (!liveEvent) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ライブが見つかりません</Text>
      </View>
    );
  }

  const toggleChecklistItem = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Basic Info */}
      <Card style={styles.card}>
        {isEditing ? (
          <>
            <Text style={styles.editLabel}>イベント名</Text>
            <TextInput
              style={styles.editInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="イベント名"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.editLabel}>会場</Text>
            <TextInput
              style={styles.editInput}
              value={editVenue}
              onChangeText={setEditVenue}
              placeholder="会場"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.editLabel}>集合時間（任意）</Text>
            <TextInput
              style={styles.editInput}
              value={editMeetTime}
              onChangeText={setEditMeetTime}
              placeholder="例: 16:30"
              placeholderTextColor={colors.textMuted}
            />
          </>
        ) : (
          <>
            <Text style={styles.eventTitle}>{liveEvent.title}</Text>
            <View style={styles.infoRow}>
              <Feather name="calendar" size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {format(liveEvent.date, 'yyyy年M月d日(E) HH:mm', { locale: ja })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={18} color={colors.primary} />
              <Text style={styles.infoText}>{liveEvent.venue}</Text>
            </View>
            {liveEvent.meetTime && (
              <View style={styles.infoRow}>
                <Feather name="clock" size={18} color={colors.primary} />
                <Text style={styles.infoText}>集合: {liveEvent.meetTime}</Text>
              </View>
            )}
          </>
        )}
        <TouchableOpacity onPress={handleToggleStatus}>
          <View
            style={[
              styles.statusBadge,
              liveEvent.status === 'scheduled'
                ? styles.statusScheduled
                : styles.statusCompleted,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                liveEvent.status === 'scheduled'
                  ? styles.statusTextScheduled
                  : styles.statusTextCompleted,
              ]}
            >
              {liveEvent.status === 'scheduled' ? '予定' : '完了'}
            </Text>
          </View>
        </TouchableOpacity>
      </Card>

      {/* Setlist */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>セットリスト</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SetlistEdit', { id: liveEvent.id })}
          >
            <Text style={styles.editLink}>編集</Text>
          </TouchableOpacity>
        </View>
        {liveEvent.setlist.map((setlistSong) => {
          const song = getSongById(setlistSong.songId);
          return (
            <TouchableOpacity
              key={setlistSong.songId + setlistSong.order}
              onPress={() =>
                navigation.navigate('SongDetail', { id: setlistSong.songId })
              }
            >
              <Card style={styles.songCard}>
                <View style={styles.songHeader}>
                  <View style={styles.dragHandle}>
                    <Feather name="menu" size={18} color={colors.textMuted} />
                  </View>
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderText}>{setlistSong.order}</Text>
                  </View>
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>{song?.title || '不明'}</Text>
                    <Text style={styles.songMeta}>
                      Key: {song?.key} / BPM: {song?.bpm}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.textMuted}
                  />
                </View>
                {setlistSong.memo && (
                  <View style={styles.memoContainer}>
                    <Text style={styles.songMemo}>{setlistSong.memo}</Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Checklist */}
      {checklist.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>チェックリスト</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChecklistTemplates')}
            >
              <Text style={styles.editLink}>編集</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.card}>
            {checklist.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistRow}
                onPress={() => toggleChecklistItem(item.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.checked && styles.checkboxChecked,
                  ]}
                >
                  {item.checked && (
                    <Feather name="check" size={14} color="#ffffff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.checklistText,
                    item.checked && styles.checklistTextChecked,
                  ]}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      )}

      {/* Memo */}
      {isEditing ? (
        <Card style={styles.card}>
          <Text style={styles.editLabel}>メモ</Text>
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
      ) : liveEvent.memo ? (
        <Card style={styles.card}>
          <Text style={styles.memoLabel}>メモ</Text>
          <Text style={styles.memoText}>{liveEvent.memo}</Text>
        </Card>
      ) : null}

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
  eventTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  statusScheduled: {
    backgroundColor: colors.primaryLight,
  },
  statusCompleted: {
    backgroundColor: colors.successLight,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  statusTextScheduled: {
    color: colors.primary,
  },
  statusTextCompleted: {
    color: colors.success,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  songCard: {
    marginBottom: 8,
  },
  songHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dragHandle: {
    padding: 4,
    marginRight: 8,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  songMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memoContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  songMemo: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checklistText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  checklistTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
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
  memoLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  memoText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
