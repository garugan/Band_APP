import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Card } from '../components/Card';
import { useThemeColors } from '../contexts/ThemeContext';
import { useProfile } from '../contexts/ProfileContext';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState(profile.name);
  const [part, setPart] = useState(profile.part);
  const [bandName, setBandName] = useState(profile.bandName);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [pendingAction, setPendingAction] = useState<'camera' | 'library' | null>(null);

  const hasChanges =
    name !== profile.name ||
    part !== profile.part ||
    bandName !== profile.bandName ||
    avatarUri !== profile.avatarUri;

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('権限エラー', 'カメラの使用を許可してください');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const launchLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('権限エラー', '写真ライブラリへのアクセスを許可してください');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = () => {
    setShowImagePicker(false);
    if (Platform.OS === 'android') {
      setTimeout(launchCamera, 500);
    } else {
      setPendingAction('camera');
    }
  };

  const handlePickImage = () => {
    setShowImagePicker(false);
    if (Platform.OS === 'android') {
      setTimeout(launchLibrary, 500);
    } else {
      setPendingAction('library');
    }
  };

  const handleModalDismiss = () => {
    if (pendingAction === 'camera') {
      setPendingAction(null);
      launchCamera();
    } else if (pendingAction === 'library') {
      setPendingAction(null);
      launchLibrary();
    }
  };

  const handleSave = () => {
    updateProfile({
      name: name.trim(),
      part: part.trim(),
      bandName: bandName.trim(),
      avatarUri,
    });
    Alert.alert('', 'プロフィールを保存しました');
    navigation.goBack();
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
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 24,
      marginTop: 8,
    },
    avatarWrapper: {
      position: 'relative',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '600' as const,
      color: '#ffffff',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: -4,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      fontSize: 16,
      color: colors.text,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    saveButton: {
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: hasChanges ? colors.primary : colors.muted,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: hasChanges ? '#ffffff' : colors.textMuted,
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
      paddingBottom: 32,
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
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 16,
    },
    modalOptionText: {
      fontSize: 16,
      color: colors.text,
    },
  }), [colors, hasChanges]);

  const displayInitial = name.trim() ? name.trim().charAt(0) : '?';

  return (
    <>
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => setShowImagePicker(true)}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{displayInitial}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={14} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>

        <Card style={styles.card}>
          <Text style={styles.label}>名前</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="名前を入力"
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>担当パート</Text>
          <TextInput
            style={styles.input}
            value={part}
            onChangeText={setPart}
            placeholder="例: ギター、ベース、ドラム"
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>バンド名</Text>
          <TextInput
            style={styles.input}
            value={bandName}
            onChangeText={setBandName}
            placeholder="バンド名を入力"
            placeholderTextColor={colors.textMuted}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </View>

    <Modal
      visible={showImagePicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowImagePicker(false)}
      onDismiss={handleModalDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>プロフィール写真</Text>
            <TouchableOpacity onPress={() => setShowImagePicker(false)}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
            <Feather name="camera" size={22} color={colors.primary} />
            <Text style={styles.modalOptionText}>写真を撮影する</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={handlePickImage}>
            <Feather name="image" size={22} color={colors.primary} />
            <Text style={styles.modalOptionText}>写真フォルダから選択</Text>
          </TouchableOpacity>
          {avatarUri && (
            <TouchableOpacity style={styles.modalOption} onPress={() => { setAvatarUri(undefined); setShowImagePicker(false); }}>
              <Feather name="trash-2" size={22} color={colors.error} />
              <Text style={[styles.modalOptionText, { color: colors.error }]}>写真を削除</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
    </>
  );
}
