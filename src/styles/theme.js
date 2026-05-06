// EcoTrack Tasarım Sistemi - Renk ve Stil Tanımları

export const colors = {
  // Ana Renkler
  primary: '#2D6A4F', // Forest Green
  primaryLight: '#40916C',
  primaryDark: '#1B4332',

  // Yardımcı Renkler
  secondary: '#6BB6D6', // Sky Blue
  secondaryLight: '#90CAF9',

  // Durum Renkleri
  warning: '#FFA500', // Warm Amber
  danger: '#E63946', // Soft Coral
  success: '#40916C',

  // Arka Plan Renkleri
  backgroundLight: '#F0F9F4',
  backgroundDark: '#1A1A1A',

  // Metin Renkleri
  textDark: '#1B4332',
  textMedium: '#40916C',
  textLight: '#95D5B2',

  // Card Renkleri
  cardLight: '#FFFFFF',
  cardDark: '#2A2A2A',

  // Yardımcı Renkler
  border: '#D8F3DC',
  divider: '#E8F5E9',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme;
