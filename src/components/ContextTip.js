import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../styles/theme';

export default function ContextTip({ icon = 'information-circle', title, tips = [] }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={theme.colors.secondary} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {tips.map((tip, index) => (
        <View key={index} style={styles.tipRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.body,
    color: theme.colors.textDark,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    ...theme.typography.caption,
    color: theme.colors.secondary,
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  tipText: {
    ...theme.typography.caption,
    color: theme.colors.textMedium,
    flex: 1,
    lineHeight: 20,
  },
});
