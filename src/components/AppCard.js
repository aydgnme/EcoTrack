import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';

export default function AppCard({
  children,
  style,
  variant = 'default',
  shadow = 'md',
  padded = true,
}) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.variantPrimary;
      case 'accent':
        return styles.variantAccent;
      case 'success':
        return styles.variantSuccess;
      case 'warning':
        return styles.variantWarning;
      case 'danger':
        return styles.variantDanger;
      default:
        return styles.variantDefault;
    }
  };

  return (
    <View
      style={[
        styles.container,
        getVariantStyle(),
        theme.shadows[shadow],
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.cardLight,
    marginBottom: theme.spacing.lg,
  },
  padded: {
    padding: theme.spacing.lg,
  },
  variantDefault: {
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  variantPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  variantAccent: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  variantSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  variantWarning: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  variantDanger: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
  },
});
