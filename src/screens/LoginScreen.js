import useUserStore from '@/store/useUserStore.js';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const setUser = useUserStore((state) => state.setUser);

  const handleGuestLogin = () => {
    // Portfolyo için hızlıca içeri girmeyi sağlar
    setUser({ uid: 'guest', email: 'misafir@ecotrack.com' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoTrack</Text>
      <TouchableOpacity style={styles.button} onPress={handleGuestLogin}>
        <Text style={styles.buttonText}>Hadi Başlayalım</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9F4' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2D6A4F', marginBottom: 20 },
  button: { backgroundColor: '#40916C', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});