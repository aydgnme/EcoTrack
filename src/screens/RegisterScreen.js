import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { register } from '../services/auth.service';
import useUserStore from '../store/useUserStore';

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const isPasswordValid = Object.values(passwordValidation).every(v => v);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isEmailValid = validateEmail(email);
  const isNameValid = fullName.trim().length >= 2;

  const canSubmit = isNameValid && isEmailValid && isPasswordValid && passwordsMatch && !loading;

  const handleRegister = async () => {
    if (!fullName.trim()) {
      return Alert.alert('Hata', 'Lütfen adınızı giriniz.');
    }
    if (!isEmailValid) {
      return Alert.alert('Hata', 'Geçersiz e-posta adresi.');
    }
    if (!isPasswordValid) {
      return Alert.alert('Hata', 'Şifre tüm gereksinimleri karşılamalıdır.');
    }
    if (!passwordsMatch) {
      return Alert.alert('Hata', 'Şifreler eşleşmiyor.');
    }

    setLoading(true);
    const { user, error } = await register(email, password, fullName);
    setLoading(false);

    if (error) {
      Alert.alert('Kayıt Başarısız', error);
    } else {
      setUser(user);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        disabled={loading}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={32} color="#40916C" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>EcoTrack</Text>
        <Ionicons name="leaf" size={36} color="#40916C" style={{ marginLeft: 10 }} />
      </View>
      <Text style={styles.subtitle}>Haydi başlayalım!</Text>

      {/* Full Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tam Adı</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Adınız Soyadınız"
            value={fullName}
            onChangeText={setFullName}
            editable={!loading}
            placeholderTextColor="#95D5B2"
          />
          {isNameValid && <Ionicons name="checkmark-circle" size={20} color="#40916C" style={styles.iconRight} />}
        </View>
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>E-posta</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="ornek@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor="#95D5B2"
            keyboardType="email-address"
          />
          {isEmailValid && <Ionicons name="checkmark-circle" size={20} color="#40916C" style={styles.iconRight} />}
          {email && !isEmailValid && <Ionicons name="close-circle" size={20} color="#E63946" style={styles.iconRight} />}
        </View>
        {email && !isEmailValid && <Text style={styles.errorText}>Geçersiz e-posta</Text>}
      </View>

      {/* Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Şifre</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Şifrenizi giriniz"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            placeholderTextColor="#95D5B2"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#40916C"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        {password && (
          <View style={styles.passwordRequirements}>
            <RequirementRow
              met={passwordValidation.minLength}
              text="En az 8 karakter"
            />
            <RequirementRow
              met={passwordValidation.hasUpperCase}
              text="Büyük harf (A-Z)"
            />
            <RequirementRow
              met={passwordValidation.hasLowerCase}
              text="Küçük harf (a-z)"
            />
            <RequirementRow
              met={passwordValidation.hasNumber}
              text="Rakam (0-9)"
            />
            <RequirementRow
              met={passwordValidation.hasSpecialChar}
              text="Özel karakter (!@#$%...)"
            />
          </View>
        )}
      </View>

      {/* Confirm Password */}
      {isPasswordValid && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Şifre Doğrulama</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi tekrar giriniz"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              placeholderTextColor="#95D5B2"
            />
            {passwordsMatch ? (
              <Ionicons name="checkmark-circle" size={20} color="#40916C" style={styles.iconRight} />
            ) : confirmPassword ? (
              <Ionicons name="close-circle" size={20} color="#E63946" style={styles.iconRight} />
            ) : null}
            {confirmPassword && (
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading} style={{marginRight: 40}}>
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#40916C"
                />
              </TouchableOpacity>
            )}
          </View>
          {confirmPassword && !passwordsMatch && (
            <Text style={styles.errorText}>Şifreler eşleşmiyor</Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!canSubmit}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.linkText}>Zaten hesabın var mı? <Text style={{ fontWeight: 'bold' }}>Giriş Yap</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function RequirementRow({ met, text }) {
  return (
    <View style={styles.requirement}>
      <Ionicons
        name={met ? "checkmark-circle" : "ellipse"}
        size={16}
        color={met ? "#40916C" : "#95D5B2"}
      />
      <Text style={[styles.requirementText, met && styles.requirementMet]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F9F4',
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 15,
    width: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1B4332'
  },
  subtitle: {
    fontSize: 16,
    color: '#40916C',
    textAlign: 'center',
    marginBottom: 30
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8F3DC',
    paddingRight: 12,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#1B4332',
    fontSize: 16,
  },
  iconRight: {
    marginRight: 8,
  },
  errorText: {
    color: '#E63946',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  passwordRequirements: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F0F9F4',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#95D5B2',
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
    color: '#95D5B2',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#40916C',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2D6A4F',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#95D5B2',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  linkText: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2D6A4F'
  }
});
