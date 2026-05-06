import { login } from '../services/auth.service';
import useUserStore from '../store/useUserStore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Hata", "Lütfen tüm alanları doldurun.");

    setLoading(true);
    const { user, error } = await login(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Giriş Başarısız", error);
    } else {
      setUser(user);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>EcoTrack</Text>
        <Ionicons name="leaf" size={36} color="#40916C" style={{ marginLeft: 10 }} />
      </View>
      <Text style={styles.subtitle}>Dünyayı kurtarmaya hazır mısın?</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!loading}
        placeholderTextColor="#95D5B2"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        placeholderTextColor="#95D5B2"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Giriş Yap</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
        <Text style={styles.linkText}>Hesabın yok mu? <Text style={{ fontWeight: 'bold' }}>Kayıt Ol</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F0F9F4' },
  logoContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#1B4332' },
  subtitle: { fontSize: 16, color: '#40916C', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#D8F3DC', color: '#1B4332' },
  button: { backgroundColor: '#2D6A4F', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { marginTop: 20, textAlign: 'center', color: '#2D6A4F' }
});