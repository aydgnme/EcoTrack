import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../styles/theme';
import AppCard from './AppCard';

export default function StatCard({
  icon,
  label,
  value,
  unit = 'kg CO₂',
  subtitle,
  variant = 'primary',
}) {
  return (
    <AppCard variant={variant} style={styles.card}>
      <View style={styles.header}>
        {icon && (
          <Ionicons
            name={icon}
            size={28}
            color={theme.colors[variant === 'primary' ? 'primary' : 'secondary']}
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: theme.spacing.sm,
  },
  value: {
    ...theme.typography.h2,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  unit: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMedium,
    fontStyle: 'italic',
  },
});
