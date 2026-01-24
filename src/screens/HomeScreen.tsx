import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { FAB } from '../components/FAB';
import { colors } from '../theme/colors';
import { bandInfo, mockPractices, mockLiveEvents } from '../data/mockData';
import { MainTabScreenProps } from '../navigation/types';

type Props = MainTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const nextPractice = mockPractices[0];
  const nextLive = mockLiveEvents.find((e) => e.status === 'scheduled');

  const [todayTasks, setTodayTasks] = useState([
    { id: '1', text: '青春コンプレックス', checked: false },
    { id: '2', text: 'スタジオ予約確認', checked: false },
    { id: '3', text: 'セットリスト最終確認', checked: true },
  ]);

  const toggleTask = (id: string) => {
    setTodayTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  return (
    <SafeAreaView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.bandName}>{bandInfo.name}</Text>
          <Text style={styles.memberName}>{bandInfo.memberName}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {bandInfo.memberName.charAt(0)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Next Practice */}
        {nextPractice && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PracticeDetail', { id: nextPractice.id })
            }
          >
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Feather name="calendar" size={20} color={colors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>次のスタジオ練習</Text>
                  <View style={styles.infoRow}>
                    <Feather
                      name="calendar"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>
                      {format(nextPractice.date, 'M月d日(E) HH:mm', {
                        locale: ja,
                      })}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Feather
                      name="map-pin"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>{nextPractice.location}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Feather
                      name="music"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>
                      {nextPractice.songs.length}曲練習予定
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}

        {/* Next Live */}
        {nextLive && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('LiveDetail', { id: nextLive.id })
            }
          >
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Feather name="mic" size={20} color={colors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>次のライブ</Text>
                  <View style={styles.infoRow}>
                    <Feather
                      name="calendar"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>
                      {format(nextLive.date, 'M月d日(E) HH:mm', { locale: ja })}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Feather
                      name="map-pin"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>{nextLive.venue}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Feather
                      name="music"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.infoText}>
                      セットリスト {nextLive.setlist.length}曲
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}

        {/* Today's Tasks */}
        <Card style={styles.card}>
          <View style={styles.taskHeader}>
            <Feather name="check-square" size={20} color={colors.primary} />
            <Text style={styles.taskTitle}>今日のやること</Text>
          </View>
          {todayTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskRow}
              onPress={() => toggleTask(task.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  task.checked && styles.checkboxChecked,
                ]}
              >
                {task.checked && (
                  <Feather name="check" size={14} color="#ffffff" />
                )}
              </View>
              <Text
                style={[styles.taskText, task.checked && styles.taskTextChecked]}
              >
                {task.text}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>クイックアクション</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SongAdd')}
          >
            <Feather name="music" size={24} color={colors.text} />
            <Text style={styles.actionText}>曲を追加</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PracticeAdd')}
          >
            <Feather name="calendar" size={24} color={colors.text} />
            <Text style={styles.actionText}>練習を追加</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LiveAdd')}
          >
            <Feather name="mic" size={24} color={colors.text} />
            <Text style={styles.actionText}>ライブを追加</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LogAdd', {})}
          >
            <Feather name="plus" size={24} color={colors.text} />
            <Text style={styles.actionText}>ログを追加</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  bandName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  memberName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginLeft: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  taskText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  taskTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '47%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
  bottomSpacer: {
    height: 100,
  },
});
