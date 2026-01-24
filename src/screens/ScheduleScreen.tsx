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
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card } from '../components/Card';
import { FAB } from '../components/FAB';
import { colors } from '../theme/colors';
import { MainTabScreenProps } from '../navigation/types';
import { usePractices } from '../contexts/PracticeContext';

type Props = MainTabScreenProps<'Schedule'>;

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function ScheduleScreen({ navigation }: Props) {
  const { practices } = usePractices();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const practiceDates = practices.map((p) =>
    format(p.date, 'yyyy-MM-dd')
  );

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const upcomingPractices = practices
    .filter((p) => p.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <SafeAreaView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>スタジオ スケジュール</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <Card style={styles.calendarCard}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity
              onPress={goToPreviousMonth}
              style={styles.navButton}
            >
              <Feather name="chevron-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {format(currentMonth, 'yyyy年M月', { locale: ja })}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
              <Feather name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Weekday Headers */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((day, index) => (
              <View key={index} style={styles.weekdayCell}>
                <Text
                  style={[
                    styles.weekdayText,
                    index === 0 && styles.sundayText,
                    index === 6 && styles.saturdayText,
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hasPractice = practiceDates.includes(dateStr);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isDayToday = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.dayCell}
                  onPress={() => setSelectedDate(day)}
                >
                  <View
                    style={[
                      styles.dayContent,
                      isDayToday && styles.todayContent,
                      hasPractice && !isSelected && styles.practiceContent,
                      isSelected && styles.selectedContent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !isCurrentMonth && styles.otherMonthText,
                        isDayToday && styles.todayText,
                        hasPractice && !isSelected && styles.practiceText,
                        isSelected && !isDayToday && styles.selectedText,
                      ]}
                    >
                      {format(day, 'd')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Selected Date */}
        {selectedDate && (
          <View style={styles.selectedDateSection}>
            <Text style={styles.selectedDateText}>
              選択中: {format(selectedDate, 'M月d日(E)', { locale: ja })}
            </Text>
            <TouchableOpacity onPress={() => setSelectedDate(null)}>
              <Text style={styles.clearSelection}>クリア</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upcoming Practices */}
        <View style={styles.practiceSection}>
          <Text style={styles.sectionTitle}>スタジオ予定</Text>
          {upcomingPractices.length > 0 ? (
            upcomingPractices.map((practice) => (
              <TouchableOpacity
                key={practice.id}
                onPress={() =>
                  navigation.navigate('PracticeDetail', { id: practice.id })
                }
              >
                <Card style={styles.practiceCard}>
                  <View style={styles.practiceHeader}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateMonth}>
                        {format(practice.date, 'M月')}
                      </Text>
                      <Text style={styles.dateDay}>
                        {format(practice.date, 'd')}
                      </Text>
                      <Text style={styles.dateDow}>
                        {format(practice.date, 'E', { locale: ja })}
                      </Text>
                    </View>
                    <View style={styles.practiceInfo}>
                      <Text style={styles.practiceTime}>
                        {format(practice.date, 'HH:mm')}
                        {practice.meetTime && ` (集合 ${practice.meetTime})`}
                      </Text>
                      <Text style={styles.practiceLocation}>
                        {practice.location}
                      </Text>
                      <Text style={styles.practicePurpose}>
                        {practice.purpose}
                      </Text>
                      <View style={styles.songCount}>
                        <Feather
                          name="music"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.songCountText}>
                          {practice.songs.length}曲
                        </Text>
                      </View>
                    </View>
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={colors.textMuted}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>今後の練習予定はありません</Text>
            </Card>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <FAB
        onPress={() =>
          navigation.navigate('PracticeAdd', {
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  calendarCard: {
    margin: 16,
    padding: 12,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  sundayText: {
    color: colors.error,
  },
  saturdayText: {
    color: colors.primary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayContent: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  todayContent: {
    backgroundColor: colors.primary,
  },
  practiceContent: {
    backgroundColor: colors.primaryLight,
  },
  selectedContent: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  otherMonthText: {
    color: colors.textMuted,
  },
  todayText: {
    color: '#ffffff',
    fontWeight: '700' as const,
  },
  practiceText: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '700' as const,
  },
  selectedDateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  clearSelection: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  practiceSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  practiceCard: {
    marginBottom: 12,
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    width: 60,
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  dateMonth: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  dateDow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  practiceInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  practiceTime: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  practiceLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  practicePurpose: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  songCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  songCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  bottomSpacer: {
    height: 100,
  },
});
