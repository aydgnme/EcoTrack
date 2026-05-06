import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../styles/theme';
import AppCard from './AppCard';

export default function GamificationCard() {
  // Örnek veri - gerçek veriler Firestore'dan gelecek
  const level = 3;
  const streak = 7;
  const totalReductions = 45.3;

  const getLevelName = (lvl) => {
    const levels = {
      1: 'Başlayan',
      2: 'Katılımcı',
      3: 'Öncü',
      4: 'Şampiyon',
      5: 'Dünyanın Kurtarıcısı',
    };
    return levels[lvl] || 'Başlayan';
  };

  return (
    <AppCard variant="primary" style={styles.card}>
      <Text style={styles.title}>Çevre Puanın</Text>

      <View style={styles.statsGrid}>
        {/* Level Card */}
        <View style={styles.statItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.statLabel}>Seviye</Text>
          <Text style={styles.statValue}>{level}</Text>
          <Text style={styles.statSubtext}>{getLevelName(level)}</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.statItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="flame" size={24} color={theme.colors.warning} />
          </View>
          <Text style={styles.statLabel}>Seri</Text>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statSubtext}>gün</Text>
        </View>

        {/* Reduction Card */}
        <View style={styles.statItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="leaf" size={24} color={theme.colors.success} />
          </View>
          <Text style={styles.statLabel}>Tasarruf</Text>
          <Text style={styles.statValue}>{totalReductions}</Text>
          <Text style={styles.statSubtext}>kg CO₂</Text>
        </View>
      </View>

      {/* Achievement Badge */}
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeLabel}>Son Başarı</Text>
        <View style={styles.badge}>
          <Ionicons name="star" size={16} color={theme.colors.warning} />
          <Text style={styles.badgeText}>Hafta Şampiyonu</Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    ...theme.typography.label,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
  },
  statSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  badgeContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  badgeLabel: {
    ...theme.typography.label,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  badgeText: {
    ...theme.typography.caption,
    color: theme.colors.warning,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
});
