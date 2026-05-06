import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import useUserStore from '../store/useUserStore';

export default function SplashScreen() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="leaf" size={80} color="#40916C" />
        <Text style={styles.title}>EcoTrack</Text>
      </View>
      <Text style={styles.subtitle}>Dünyayı kurtarmaya hazır mısın?</Text>
      <ActivityIndicator size="large" color="#40916C" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9F4',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1B4332',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#40916C',
    marginTop: 10,
  },
  loader: {
    marginTop: 40,
  },
});
