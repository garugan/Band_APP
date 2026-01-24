import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parse } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { mockSongs, mockChecklistTemplates } from '../data/mockData';
import { RootStackScreenProps } from '../navigation/types';
import { usePractices } from '../contexts/PracticeContext';
import { Practice, ChecklistItem } from '../data/types';

type Props = RootStackScreenProps<'PracticeAdd'>;

interface PracticeSongItem {
  songId: string;
  goal: string;
}

export function PracticeAddScreen({ route, navigation }: Props) {
  const { addPractice } = usePractices();

  const initialDate = route.params?.date
    ? parse(route.params.date, 'yyyy-MM-dd', new Date())
    : new Date();

  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [songs, setSongs] = useState<PracticeSongItem[]>([]);
  const [memo, setMemo] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);

  const studioTemplate = mockChecklistTemplates.find((t) => t.type === 'studio');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleAddSong = () => {
    const selectedIds = songs.map((s) => s.songId);
    const availableSong = mockSongs.find((s) => !selectedIds.includes(s.id));
    if (availableSong) {
      setSongs([...songs, { songId: availableSong.id, goal: '' }]);
    } else {
      Alert.alert('', 'すべての曲が追加されています');
    }
  };

  const handleRemoveSong = (index: number) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const handleSongGoalChange = (index: number, goal: string) => {
    const newSongs = [...songs];
    newSongs[index] = { ...newSongs[index], goal };
    setSongs(newSongs);
  };

  const handleSave = () => {
    if (!location.trim()) {
      Alert.alert('エラー', 'スタジオ名を入力してください');
      return;
    }

    // Create checklist from template if selected
    let checklist: ChecklistItem[] = [];
    if (useTemplate && studioTemplate) {
      checklist = studioTemplate.items.map((item) => ({
        ...item,
        id: `${item.id}-${Date.now()}`,
        checked: false,
      }));
    }

    const newPractice: Practice = {
      id: `p${Date.now()}`,
      date: date,
      location: location.trim(),
      meetTime: meetTime.trim() || undefined,
      purpose: purpose.trim(),
      songs: songs.map((s, index) => ({
        songId: s.songId,
        order: index + 1,
        goal: s.goal,
      })),
      checklist,
      memo: memo.trim(),
    };

    addPractice(newPractice);

    Alert.alert('保存完了', 'スタジオ予定を保存しました', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date */}
        <Card style={styles.card}>
          <Text style={styles.label}>日付</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={18} color={colors.primary} />
            <Text style={styles.dateText}>
              {format(date, 'yyyy年M月d日(E)', { locale: ja })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              locale="ja"
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.doneButtonText}>完了</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Time */}
        <Card style={styles.card}>
          <Text style={styles.label}>開始時間</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Feather name="clock" size={18} color={colors.primary} />
            <Text style={styles.dateText}>{format(date, 'HH:mm')}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              locale="ja"
            />
          )}
          {Platform.OS === 'ios' && showTimePicker && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.doneButtonText}>完了</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Location */}
        <Card style={styles.card}>
          <Text style={styles.label}>スタジオ名 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例: スタジオノア渋谷"
            placeholderTextColor={colors.textMuted}
            value={location}
            onChangeText={setLocation}
          />
        </Card>

        {/* Meet Time */}
        <Card style={styles.card}>
          <Text style={styles.label}>集合時間（任意）</Text>
          <TextInput
            style={styles.input}
            placeholder="例: 13:50"
            placeholderTextColor={colors.textMuted}
            value={meetTime}
            onChangeText={setMeetTime}
          />
        </Card>

        {/* Purpose */}
        <Card style={styles.card}>
          <Text style={styles.label}>目的</Text>
          <TextInput
            style={styles.input}
            placeholder="例: 新曲の通し練習"
            placeholderTextColor={colors.textMuted}
            value={purpose}
            onChangeText={setPurpose}
          />
        </Card>

        {/* Songs */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>練習曲</Text>
          {songs.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Feather name="music" size={32} color={colors.textMuted} />
              <Text style={styles.emptyText}>曲を追加してください</Text>
            </Card>
          ) : (
            songs.map((item, index) => {
              const song = mockSongs.find((s) => s.id === item.songId);
              return (
                <Card key={item.songId} style={styles.songCard}>
                  <View style={styles.songHeader}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.songTitle}>{song?.title || '不明'}</Text>
                    <TouchableOpacity onPress={() => handleRemoveSong(index)}>
                      <Feather name="x" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.goalInput}
                    placeholder="練習目標（任意）"
                    placeholderTextColor={colors.textMuted}
                    value={item.goal}
                    onChangeText={(text) => handleSongGoalChange(index, text)}
                  />
                </Card>
              );
            })
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddSong}>
            <Feather name="plus" size={20} color={colors.primary} />
            <Text style={styles.addButtonText}>曲を追加</Text>
          </TouchableOpacity>
        </View>

        {/* Checklist Template */}
        <Card style={styles.card}>
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkbox, useTemplate && styles.checkboxChecked]}
              onPress={() => setUseTemplate(!useTemplate)}
            >
              {useTemplate && (
                <Feather name="check" size={14} color="#ffffff" />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              チェックリストテンプレートを使用
            </Text>
          </View>
          {useTemplate && studioTemplate && (
            <View style={styles.templatePreview}>
              <Text style={styles.templateName}>{studioTemplate.name}</Text>
              <Text style={styles.templateCount}>
                {studioTemplate.items.length}項目
              </Text>
            </View>
          )}
        </Card>

        {/* Memo */}
        <Card style={styles.card}>
          <Text style={styles.label}>メモ（任意）</Text>
          <TextInput
            style={styles.textarea}
            placeholder="メモを入力..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={memo}
            onChangeText={setMemo}
          />
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  songCard: {
    marginBottom: 8,
  },
  songHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  songTitle: {
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  checkboxLabel: {
    fontSize: 14,
    color: colors.text,
  },
  templatePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  templateName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  templateCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  textarea: {
    fontSize: 15,
    color: colors.text,
    minHeight: 80,
    padding: 0,
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
});
