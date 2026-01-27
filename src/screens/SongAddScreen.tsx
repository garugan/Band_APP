import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

import { Card } from '../components/Card';
import { useThemeColors } from '../contexts/ThemeContext';
import { useSongs } from '../contexts/SongContext';
import { RootStackScreenProps } from '../navigation/types';
import { Song } from '../data/types';

type Props = RootStackScreenProps<'SongAdd'>;

export function SongAddScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const { addSong } = useSongs();

  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [bpm, setBpm] = useState('');
  const [tags, setTags] = useState('');
  const [memo, setMemo] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('エラー', '曲名を入力してください');
      return;
    }
    if (!key.trim()) {
      Alert.alert('エラー', 'Keyを入力してください');
      return;
    }
    const bpmNum = parseInt(bpm, 10);
    if (isNaN(bpmNum) || bpmNum <= 0) {
      Alert.alert('エラー', 'BPMを正しく入力してください');
      return;
    }

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: title.trim(),
      key: key.trim(),
      bpm: bpmNum,
      tags: parsedTags,
      memo: memo.trim(),
      referenceUrl: referenceUrl.trim() || undefined,
      createdAt: new Date(),
    };

    addSong(newSong);

    Alert.alert('保存完了', '曲を保存しました', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const styles = useMemo(() => StyleSheet.create({
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
    input: {
      fontSize: 16,
      color: colors.text,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    row: {
      flexDirection: 'row',
      gap: 16,
    },
    rowItem: {
      flex: 1,
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
  }), [colors]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Card style={styles.card}>
          <Text style={styles.label}>曲名 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例: 夜に駆ける"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </Card>

        {/* Key & BPM */}
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Key *</Text>
              <TextInput
                style={styles.input}
                placeholder="例: Am"
                placeholderTextColor={colors.textMuted}
                value={key}
                onChangeText={setKey}
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>BPM *</Text>
              <TextInput
                style={styles.input}
                placeholder="例: 120"
                placeholderTextColor={colors.textMuted}
                value={bpm}
                onChangeText={setBpm}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </Card>

        {/* Tags */}
        <Card style={styles.card}>
          <Text style={styles.label}>タグ（カンマ区切り）</Text>
          <TextInput
            style={styles.input}
            placeholder="例: ロック, アップテンポ"
            placeholderTextColor={colors.textMuted}
            value={tags}
            onChangeText={setTags}
          />
        </Card>

        {/* Memo */}
        <Card style={styles.card}>
          <Text style={styles.label}>メモ（任意）</Text>
          <TextInput
            style={styles.textarea}
            placeholder="例: イントロのギターリフに注意"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={memo}
            onChangeText={setMemo}
          />
        </Card>

        {/* Reference URL */}
        <Card style={styles.card}>
          <Text style={styles.label}>参考URL（任意）</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={colors.textMuted}
            value={referenceUrl}
            onChangeText={setReferenceUrl}
            autoCapitalize="none"
            keyboardType="url"
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
