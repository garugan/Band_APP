import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
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
import { useTheme } from '../contexts/ThemeContext';
import { useProfile } from '../contexts/ProfileContext';
import { MainTabScreenProps } from '../navigation/types';
import { usePractices } from '../contexts/PracticeContext';
import { useLiveEvents } from '../contexts/LiveContext';

type Props = MainTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { practices } = usePractices();
  const { liveEvents } = useLiveEvents();
  const { isDark, toggleTheme, colors } = useTheme();
  const { profile } = useProfile();

  const now = new Date();

  const nextPractice = practices
    .filter((p) => p.date.getTime() >= now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null;

  const nextLive = liveEvents
    .filter((e) => e.status === 'scheduled' && e.date.getTime() >= now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null;

  const styles = useMemo(() => StyleSheet.create({
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
      position: 'relative',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeToggle: {
      padding: 8,
      borderRadius: 20,
    },
    headerIconWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    headerIcon: {
      width: 100,
      height: 100,
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
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 4,
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
  }), [colors]);

  return (
    <SafeAreaView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* <View>
            <Text style={styles.bandName}>{bandInfo.name}</Text>
            <Text style={styles.memberName}>{bandInfo.memberName}</Text>
          </View> */}
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Feather
              name={isDark ? 'sun' : 'moon'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
        >
          {profile.avatarUri ? (
            <Image
              source={{ uri: profile.avatarUri }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name ? profile.name.charAt(0) : '?'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <View pointerEvents="none" style={styles.headerIconWrapper}>
          <Image
            source={
              isDark
                ? require('../../assets/icons/logoWhite.png')
                : require('../../assets/icons/logoBlack.png')
            }
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Next Practice */}
        {nextPractice ? (
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
        ) : (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Feather name="calendar" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>次のスタジオ練習</Text>
                <Text style={styles.emptyText}>予定されている練習はありません</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Next Live */}
        {nextLive ? (
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
        ) : (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Feather name="mic" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>次のライブ</Text>
                <Text style={styles.emptyText}>予定されているライブはありません</Text>
              </View>
            </View>
          </Card>
        )}

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
