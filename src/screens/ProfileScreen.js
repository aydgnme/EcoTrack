import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { logout } from '../services/auth.service';
import { db } from '../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import useUserStore from '../store/useUserStore';

export default function ProfileScreen() {
  const { user, logout: logoutUser, updateUser } = useUserStore();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [updating, setUpdating] = useState(false);

  const generateUsernameFromEmail = (email) => {
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı boş olamaz');
      return;
    }

    if (newUsername.length < 3) {
      Alert.alert('Hata', 'Kullanıcı adı en az 3 karakter olmalıdır');
      return;
    }

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username: newUsername.trim(),
      });
      updateUser({ username: newUsername.trim() });
      setEditingUsername(false);
      Alert.alert('Başarılı', 'Kullanıcı adı güncellendi');
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı adı güncellenemedi');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Uygulamadan çıkmak istediğinize emin misiniz?',
      [
        { text: 'İptal', onPress: () => {}, style: 'cancel' },
        {
          text: 'Çıkış Yap',
          onPress: async () => {
            const { error } = await logout();
            if (!error) {
              logoutUser();
            } else {
              Alert.alert('Hata', error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilim</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#40916C" />
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.infoField}>
            <Text style={styles.label}>Kullanıcı Adı</Text>
            <View style={styles.usernameContainer}>
              <Ionicons name="at" size={18} color="#40916C" />
              <Text style={styles.value}>
                {user?.username || generateUsernameFromEmail(user?.email)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setNewUsername(user?.username || generateUsernameFromEmail(user?.email));
                  setEditingUsername(true);
                }}
              >
                <Ionicons name="pencil" size={18} color="#95D5B2" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>E-Posta</Text>
            <View style={styles.valueContainer}>
              <Ionicons name="mail" size={18} color="#40916C" />
              <Text style={styles.value}>{user?.email || 'Yükleniliyor...'}</Text>
            </View>
          </View>

          {user?.displayName && (
            <View style={styles.infoField}>
              <Text style={styles.label}>Ad Soyad</Text>
              <View style={styles.valueContainer}>
                <Ionicons name="person" size={18} color="#40916C" />
                <Text style={styles.value}>{user.displayName}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hesap Ayarları</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={22} color="#40916C" />
            <Text style={styles.settingText}>Bildirimler</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95D5B2" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield-checkmark" size={22} color="#40916C" />
            <Text style={styles.settingText}>Güvenlik</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95D5B2" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="settings" size={22} color="#40916C" />
            <Text style={styles.settingText}>Tercihler</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95D5B2" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hakkında</Text>

        <View style={styles.aboutItem}>
          <View style={styles.aboutLeft}>
            <Ionicons name="information" size={22} color="#40916C" />
            <View>
              <Text style={styles.aboutTitle}>Versiyon</Text>
              <Text style={styles.aboutSubtitle}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.aboutLeft}>
            <Ionicons name="open-outline" size={22} color="#40916C" />
            <View>
              <Text style={styles.aboutTitle}>Gizlilik Politikası</Text>
              <Text style={styles.aboutSubtitle}>Okuyla</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95D5B2" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.aboutLeft}>
            <Ionicons name="document-text" size={22} color="#40916C" />
            <View>
              <Text style={styles.aboutTitle}>Kullanım Şartları</Text>
              <Text style={styles.aboutSubtitle}>Okuyla</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95D5B2" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={22} color="#fff" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>EcoTrack © 2024 - Dünyayı Kurtaralım</Text>

      <Modal
        visible={editingUsername}
        transparent
        animationType="fade"
        onRequestClose={() => !updating && setEditingUsername(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kullanıcı Adını Düzenle</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Yeni kullanıcı adı"
              value={newUsername}
              onChangeText={setNewUsername}
              editable={!updating}
              placeholderTextColor="#95D5B2"
              maxLength={30}
            />

            <Text style={styles.characterCount}>
              {newUsername.length}/30
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingUsername(false)}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, updating && styles.savingButton]}
                onPress={handleSaveUsername}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F4',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  userInfoSection: {
    width: '100%',
  },
  infoField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#95D5B2',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 16,
    color: '#1B4332',
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#F0F9F4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#1B4332',
    borderWidth: 1,
    borderColor: '#D8F3DC',
  },
  characterCount: {
    fontSize: 12,
    color: '#95D5B2',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F9F4',
  },
  cancelButtonText: {
    color: '#40916C',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#40916C',
  },
  savingButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 12,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#1B4332',
    marginLeft: 12,
    fontWeight: '500',
  },
  aboutItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    color: '#1B4332',
    marginLeft: 12,
    fontWeight: '500',
  },
  aboutSubtitle: {
    fontSize: 12,
    color: '#95D5B2',
    marginLeft: 12,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#E63946',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    textAlign: 'center',
    color: '#95D5B2',
    fontSize: 12,
    marginBottom: 20,
  },
});
