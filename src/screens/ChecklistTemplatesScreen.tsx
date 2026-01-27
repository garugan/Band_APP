import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Card } from '../components/Card';
import { useThemeColors } from '../contexts/ThemeContext';
import { mockChecklistTemplates } from '../data/mockData';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'ChecklistTemplates'>;

type TabType = 'studio' | 'live';

export function ChecklistTemplatesScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<TabType>('studio');

  const templates = mockChecklistTemplates.filter((t) => t.type === activeTab);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    tabContainer: {
      flexDirection: 'row',
      padding: 16,
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.muted,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: '#ffffff',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    templateCard: {
      marginBottom: 12,
    },
    templateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    templateName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    editButton: {
      padding: 4,
    },
    itemList: {
      gap: 8,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    itemText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    itemCount: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 12,
      textAlign: 'right',
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
      height: 40,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'studio' && styles.tabActive]}
          onPress={() => setActiveTab('studio')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'studio' && styles.tabTextActive,
            ]}
          >
            スタジオ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'live' && styles.tabActive]}
          onPress={() => setActiveTab('live')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'live' && styles.tabTextActive,
            ]}
          >
            ライブ
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {templates.map((template) => (
          <Card key={template.id} style={styles.templateCard}>
            <View style={styles.templateHeader}>
              <Text style={styles.templateName}>{template.name}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Feather name="edit-2" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.itemList}>
              {template.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.checkbox}>
                    {item.checked && (
                      <Feather name="check" size={14} color={colors.primary} />
                    )}
                  </View>
                  <Text style={styles.itemText}>{item.text}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.itemCount}>
              {template.items.length}項目
            </Text>
          </Card>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>新しいテンプレートを追加</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}
