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
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { mockSongs } from '../data/mockData';
import { LogSong } from '../data/types';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'LogAdd'>;

export function LogAddScreen({ route, navigation }: Props) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [songs, setSongs] = useState<LogSong[]>([]);
  const [goodPoints, setGoodPoints] = useState('');
  const [issues, setIssues] = useState('');
  const [nextActions, setNextActions] = useState('');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddSong = () => {
    // For demo, add the first unselected song
    const selectedIds = songs.map((s) => s.songId);
    const availableSong = mockSongs.find((s) => !selectedIds.includes(s.id));
    if (availableSong) {
      setSongs([...songs, { songId: availableSong.id, achievement: 50 }]);
    } else {
      Alert.alert('', 'すべての曲が追加されています');
    }
  };

  const handleRemoveSong = (index: number) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (index: number, value: number) => {
    const newSongs = [...songs];
    newSongs[index] = { ...newSongs[index], achievement: Math.round(value) };
    setSongs(newSongs);
  };

  const handleSave = () => {
    if (songs.length === 0) {
      Alert.alert('エラー', '少なくとも1曲を追加してください');
      return;
    }

    // TODO: Save to storage
    Alert.alert('保存完了', 'ログを保存しました', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date */}
        <Card style={styles.card}>
          <Text style={styles.label}>日時</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={18} color={colors.primary} />
            <Text style={styles.dateText}>
              {format(date, 'yyyy年M月d日(E) HH:mm', { locale: ja })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
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

        {/* Songs */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>練習した曲</Text>
          {songs.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Feather name="music" size={32} color={colors.textMuted} />
              <Text style={styles.emptyText}>曲を追加してください</Text>
            </Card>
          ) : (
            songs.map((logSong, index) => {
              const song = mockSongs.find((s) => s.id === logSong.songId);
              return (
                <Card key={logSong.songId} style={styles.songCard}>
                  <View style={styles.songHeader}>
                    <Text style={styles.songTitle}>{song?.title || '不明'}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSong(index)}
                    >
                      <Feather name="x" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sliderContainer}>
                    <Text style={styles.achievementLabel}>達成度</Text>
                    <Text style={styles.achievementValue}>
                      {logSong.achievement}%
                    </Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                    value={logSong.achievement}
                    onValueChange={(value) =>
                      handleAchievementChange(index, value)
                    }
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.muted}
                    thumbTintColor={colors.primary}
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

        {/* Good Points */}
        <Card style={styles.card}>
          <View style={styles.labelRow}>
            <Feather name="thumbs-up" size={18} color={colors.success} />
            <Text style={[styles.label, { color: colors.success }]}>
              良かった点
            </Text>
          </View>
          <TextInput
            style={styles.textarea}
            placeholder="良かった点を記入..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={goodPoints}
            onChangeText={setGoodPoints}
          />
        </Card>

        {/* Issues */}
        <Card style={styles.card}>
          <View style={styles.labelRow}>
            <Feather name="alert-circle" size={18} color={colors.error} />
            <Text style={[styles.label, { color: colors.error }]}>
              課題・改善点
            </Text>
          </View>
          <TextInput
            style={styles.textarea}
            placeholder="課題・改善点を記入..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={issues}
            onChangeText={setIssues}
          />
        </Card>

        {/* Next Actions */}
        <Card style={styles.card}>
          <View style={styles.labelRow}>
            <Feather name="target" size={18} color={colors.primary} />
            <Text style={[styles.label, { color: colors.primary }]}>
              次回への取り組み
            </Text>
          </View>
          <TextInput
            style={styles.textarea}
            placeholder="次回への取り組みを記入..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={nextActions}
            onChangeText={setNextActions}
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
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
  textarea: {
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
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
