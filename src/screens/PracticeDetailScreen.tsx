import React, { useState, useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { useThemeColors } from '../contexts/ThemeContext';
import { useSongs } from '../contexts/SongContext';
import { RootStackScreenProps } from '../navigation/types';
import { ChecklistItem, PracticeSong, Song } from '../data/types';
import { usePractices } from '../contexts/PracticeContext';

type Props = RootStackScreenProps<'PracticeDetail'>;

export function PracticeDetailScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { id } = route.params;
  const { practices, updatePractice, deletePractice } = usePractices();
  const { songs: allSongs } = useSongs();
  const practice = practices.find((p) => p.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editLocation, setEditLocation] = useState(practice?.location || '');
  const [editMeetTime, setEditMeetTime] = useState(practice?.meetTime || '');
  const [editPurpose, setEditPurpose] = useState(practice?.purpose || '');
  const [editMemo, setEditMemo] = useState(practice?.memo || '');
  const [editSongs, setEditSongs] = useState<PracticeSong[]>(practice?.songs || []);
  const [showSongPicker, setShowSongPicker] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    practice?.checklist || []
  );

  const selectedSongIds = editSongs.map((s) => s.songId);
  const availableSongs = allSongs.filter((s) => !selectedSongIds.includes(s.id));

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
  }, [navigation, isEditing, editLocation, editMeetTime, editPurpose, editMemo, editSongs, checklist, colors]);

  const startEditing = () => {
    if (!practice) return;
    setEditLocation(practice.location);
    setEditMeetTime(practice.meetTime || '');
    setEditPurpose(practice.purpose);
    setEditMemo(practice.memo);
    setEditSongs([...practice.songs]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!practice) return;
    if (!editLocation.trim()) {
      Alert.alert('エラー', '場所を入力してください');
      return;
    }
    updatePractice(id, {
      ...practice,
      location: editLocation.trim(),
      meetTime: editMeetTime.trim() || undefined,
      purpose: editPurpose.trim(),
      memo: editMemo.trim(),
      songs: editSongs.map((s, index) => ({ ...s, order: index + 1 })),
      checklist,
    });
    setIsEditing(false);
  };

  const handleAddSong = () => {
    if (availableSongs.length === 0) {
      Alert.alert('', 'すべての曲が追加されています');
      return;
    }
    setShowSongPicker(true);
  };

  const handleSelectSong = (songId: string) => {
    setEditSongs([...editSongs, { songId, order: editSongs.length + 1, goal: '' }]);
    setShowSongPicker(false);
  };

  const handleRemoveSong = (index: number) => {
    setEditSongs(editSongs.filter((_, i) => i !== index));
  };

  const handleSongGoalChange = (index: number, goal: string) => {
    const newSongs = [...editSongs];
    newSongs[index] = { ...newSongs[index], goal };
    setEditSongs(newSongs);
  };

  const handleDelete = () => {
    Alert.alert('削除確認', 'この練習を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deletePractice(id);
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
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    purposeText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
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
    goalContainer: {
      flexDirection: 'row',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    goalLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginRight: 8,
    },
    goalText: {
      fontSize: 13,
      color: colors.text,
      flex: 1,
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
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
      marginTop: 8,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#ffffff',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      borderRadius: 12,
      gap: 8,
      marginTop: 8,
    },
    addButtonText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500' as const,
    },
    editSongCard: {
      marginBottom: 8,
    },
    editSongHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    editSongTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    goalInput: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      fontSize: 14,
      color: colors.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '60%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
    },
    modalCloseButton: {
      padding: 4,
    },
    songPickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    songPickerInfo: {
      flex: 1,
    },
    songPickerTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    songPickerMeta: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    emptyModalText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      padding: 32,
    },
    bottomSpacer: {
      height: 40,
    },
  }), [colors]);

  if (!practice) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>練習が見つかりません</Text>
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
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Basic Info */}
      <Card style={styles.card}>
        {isEditing ? (
          <>
            <Text style={[styles.editLabel, { marginTop: 0 }]}>場所</Text>
            <TextInput
              style={styles.editInput}
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder="場所"
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
            <View style={styles.infoRow}>
              <Feather name="calendar" size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {format(practice.date, 'yyyy年M月d日(E) HH:mm', { locale: ja })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={18} color={colors.primary} />
              <Text style={styles.infoText}>{practice.location}</Text>
            </View>
            {practice.meetTime && (
              <View style={styles.infoRow}>
                <Feather name="clock" size={18} color={colors.primary} />
                <Text style={styles.infoText}>集合: {practice.meetTime}</Text>
              </View>
            )}
          </>
        )}
      </Card>

      {/* Purpose */}
      <Card style={styles.card}>
        {isEditing ? (
          <>
            <Text style={[styles.editLabel, { marginTop: 0 }]}>目的</Text>
            <TextInput
              style={styles.editTextarea}
              value={editPurpose}
              onChangeText={setEditPurpose}
              placeholder="練習の目的"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>目的</Text>
            </View>
            <Text style={styles.purposeText}>{practice.purpose}</Text>
          </>
        )}
      </Card>

      {/* Songs */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>練習曲</Text>
        {isEditing ? (
          <>
            {editSongs.map((practiceSong, index) => {
              const song = allSongs.find((s) => s.id === practiceSong.songId);
              return (
                <Card key={practiceSong.songId} style={styles.editSongCard}>
                  <View style={styles.editSongHeader}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.editSongTitle}>{song?.title || '不明'}</Text>
                    <TouchableOpacity onPress={() => handleRemoveSong(index)}>
                      <Feather name="x" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.goalInput}
                    placeholder="練習目標（任意）"
                    placeholderTextColor={colors.textMuted}
                    value={practiceSong.goal}
                    onChangeText={(text) => handleSongGoalChange(index, text)}
                  />
                </Card>
              );
            })}
            <TouchableOpacity style={styles.addButton} onPress={handleAddSong}>
              <Feather name="plus" size={18} color={colors.primary} />
              <Text style={styles.addButtonText}>曲を追加</Text>
            </TouchableOpacity>
          </>
        ) : (
          practice.songs.map((practiceSong) => {
            const song = allSongs.find((s) => s.id === practiceSong.songId);
            return (
              <TouchableOpacity
                key={practiceSong.songId}
                onPress={() =>
                  navigation.navigate('SongDetail', { id: practiceSong.songId })
                }
              >
                <Card style={styles.songCard}>
                  <View style={styles.songHeader}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderText}>{practiceSong.order}</Text>
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
                  {practiceSong.goal && (
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalLabel}>目標:</Text>
                      <Text style={styles.goalText}>{practiceSong.goal}</Text>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })
        )}
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
      ) : practice.memo ? (
        <Card style={styles.card}>
          <Text style={styles.memoLabel}>メモ</Text>
          <Text style={styles.memoText}>{practice.memo}</Text>
        </Card>
      ) : null}

      {/* Action Button */}
      {!isEditing && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('LogAdd', { practiceId: practice.id, initialTags: ['スタジオ練習'] })
          }
        >
          <Feather name="file-text" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>
            この練習からログを作成
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>

    {/* Song Picker Modal */}
    <Modal
      visible={showSongPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSongPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>曲を選択</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSongPicker(false)}
            >
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {availableSongs.length === 0 ? (
            <Text style={styles.emptyModalText}>追加できる曲がありません</Text>
          ) : (
            <FlatList
              data={availableSongs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: { item: Song }) => (
                <TouchableOpacity
                  style={styles.songPickerItem}
                  onPress={() => handleSelectSong(item.id)}
                >
                  <View style={styles.songPickerInfo}>
                    <Text style={styles.songPickerTitle}>{item.title}</Text>
                    <Text style={styles.songPickerMeta}>
                      Key: {item.key} / BPM: {item.bpm}
                    </Text>
                  </View>
                  <Feather name="plus" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
    </>
  );
}
