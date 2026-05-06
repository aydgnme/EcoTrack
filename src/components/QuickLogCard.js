import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../styles/theme';
import AppCard from './AppCard';

export default function QuickLogCard({
  icon,
  label,
  activity,
  carbonValue,
  onPress,
  isFrequent = false,
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <AppCard
        variant="accent"
        style={styles.card}
        shadow="sm"
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color="#fff" />
            {isFrequent && (
              <View style={styles.frequentBadge}>
                <Ionicons name="star" size={10} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.textContent}>
            <Text style={styles.activity}>{activity}</Text>
            <Text style={styles.label}>{label}</Text>
          </View>

          <View style={styles.carbonBadge}>
            <Text style={styles.carbonText}>{carbonValue}</Text>
            <Text style={styles.carbonUnit}>kg</Text>
          </View>
        </View>
      </AppCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  frequentBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.warning,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  activity: {
    ...theme.typography.body,
    color: theme.colors.textDark,
    fontWeight: '600',
    marginBottom: 2,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  carbonBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  carbonText: {
    ...theme.typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  carbonUnit: {
    ...theme.typography.label,
    color: '#fff',
    fontSize: 10,
  },
});
