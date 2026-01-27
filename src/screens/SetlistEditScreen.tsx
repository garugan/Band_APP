import React, { useState } from 'react';
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

import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { getSongById } from '../data/mockData';
import { SetlistSong } from '../data/types';
import { RootStackScreenProps } from '../navigation/types';
import { useLiveEvents } from '../contexts/LiveContext';

type Props = RootStackScreenProps<'SetlistEdit'>;

export function SetlistEditScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { liveEvents, updateLiveEvent } = useLiveEvents();
  const liveEvent = liveEvents.find((e) => e.id === id);

  const [setlist, setSetlist] = useState<SetlistSong[]>(
    liveEvent?.setlist || []
  );

  if (!liveEvent) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ライブが見つかりません</Text>
      </View>
    );
  }

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSetlist = [...setlist];
    [newSetlist[index - 1], newSetlist[index]] = [
      newSetlist[index],
      newSetlist[index - 1],
    ];
    // Update order numbers
    newSetlist.forEach((song, i) => {
      song.order = i + 1;
    });
    setSetlist(newSetlist);
  };

  const moveDown = (index: number) => {
    if (index === setlist.length - 1) return;
    const newSetlist = [...setlist];
    [newSetlist[index], newSetlist[index + 1]] = [
      newSetlist[index + 1],
      newSetlist[index],
    ];
    // Update order numbers
    newSetlist.forEach((song, i) => {
      song.order = i + 1;
    });
    setSetlist(newSetlist);
  };

  const removeSong = (index: number) => {
    Alert.alert('削除確認', 'この曲をセットリストから削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          const newSetlist = setlist.filter((_, i) => i !== index);
          newSetlist.forEach((song, i) => {
            song.order = i + 1;
          });
          setSetlist(newSetlist);
        },
      },
    ]);
  };

  const updateMemo = (index: number, memo: string) => {
    const newSetlist = [...setlist];
    newSetlist[index] = { ...newSetlist[index], memo };
    setSetlist(newSetlist);
  };

  const handleSave = () => {
    if (!liveEvent) return;
    updateLiveEvent(id, { ...liveEvent, setlist });
    Alert.alert('保存完了', 'セットリストを保存しました', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleAddSong = () => {
    // TODO: Open song selection modal
    Alert.alert('曲を追加', 'この機能は開発中です');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {setlist.map((setlistSong, index) => {
          const song = getSongById(setlistSong.songId);
          return (
            <Card key={`${setlistSong.songId}-${index}`} style={styles.songCard}>
              <View style={styles.songHeader}>
                <View style={styles.dragHandle}>
                  <Feather name="menu" size={18} color={colors.textMuted} />
                </View>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderText}>{index + 1}</Text>
                </View>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song?.title || '不明'}</Text>
                  <Text style={styles.songMeta}>
                    Key: {song?.key} / BPM: {song?.bpm}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => moveUp(index)}
                    disabled={index === 0}
                    style={[
                      styles.actionButton,
                      index === 0 && styles.actionButtonDisabled,
                    ]}
                  >
                    <Feather
                      name="chevron-up"
                      size={20}
                      color={index === 0 ? colors.textMuted : colors.text}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => moveDown(index)}
                    disabled={index === setlist.length - 1}
                    style={[
                      styles.actionButton,
                      index === setlist.length - 1 && styles.actionButtonDisabled,
                    ]}
                  >
                    <Feather
                      name="chevron-down"
                      size={20}
                      color={
                        index === setlist.length - 1
                          ? colors.textMuted
                          : colors.text
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeSong(index)}
                    style={styles.actionButton}
                  >
                    <Feather name="x" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                style={styles.memoInput}
                placeholder="メモ（MCメモ、チューニングなど）"
                placeholderTextColor={colors.textMuted}
                value={setlistSong.memo || ''}
                onChangeText={(text) => updateMemo(index, text)}
              />
            </Card>
          );
        })}

        <TouchableOpacity style={styles.addButton} onPress={handleAddSong}>
          <Feather name="plus" size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>曲を追加</Text>
        </TouchableOpacity>

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
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
  songCard: {
    marginBottom: 12,
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
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 6,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  memoInput: {
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
