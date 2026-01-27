import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { useThemeColors } from '../contexts/ThemeContext';
import { getSongById } from '../data/mockData';
import { RootStackScreenProps } from '../navigation/types';
import { ChecklistItem } from '../data/types';
import { usePractices } from '../contexts/PracticeContext';

type Props = RootStackScreenProps<'PracticeDetail'>;

export function PracticeDetailScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { id } = route.params;
  const { practices } = usePractices();
  const practice = practices.find((p) => p.id === id);

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    practice?.checklist || []
  );

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Basic Info */}
      <Card style={styles.card}>
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
      </Card>

      {/* Purpose */}
      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Feather name="target" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>目的</Text>
        </View>
        <Text style={styles.purposeText}>{practice.purpose}</Text>
      </Card>

      {/* Songs */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>練習曲</Text>
        {practice.songs.map((practiceSong, index) => {
          const song = getSongById(practiceSong.songId);
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
      {practice.memo && (
        <Card style={styles.card}>
          <Text style={styles.memoLabel}>メモ</Text>
          <Text style={styles.memoText}>{practice.memo}</Text>
        </Card>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() =>
          navigation.navigate('LogAdd', { practiceId: practice.id })
        }
      >
        <Feather name="file-text" size={20} color="#ffffff" />
        <Text style={styles.actionButtonText}>
          この練習からログを作成
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}
