import { StyleSheet, Dimensions, Platform } from 'react-native';

export const COLORS = {
  // Primary Palette: High-Vis Logistics Orange & Deep Blue Navy
  primary: '#F97316', // More vibrant and modern orange
  primaryDark: '#EA580C', // Deep orange for active states
  primaryLight: '#FFF7ED', // Very soft orange for backgrounds
  
  secondary: '#334155', // Slate instead of harsh navy for light theme
  secondaryDark: '#1E293B', // Darker slate
  secondaryLight: '#94A3B8', // Muted slate
  
  accentBlue: '#3B82F6', // Cobalt blue
  accentBlueLight: '#EFF6FF',
  
  // Role Specific Palette (Vibrant for Light Theme)
  roleCustomer: '#F97316', // Bright Orange
  roleVendor: '#0284C7', // Nice Ocean Blue
  roleDriver: '#059669', // Emerald Green
  roleAdmin: '#7C3AED', // Vivid Purple
  
  // Status Colors
  success: '#10B981', 
  successLight: '#D1FAE5',
  warning: '#F59E0B', 
  warningLight: '#FEF3C7',
  danger: '#EF4444', 
  dangerLight: '#FEE2E2',
  info: '#3B82F6', 
  infoLight: '#DBEAFE',
  
  // Neutral Colors for Light Theme
  background: '#F8FAFC', // Very clean slate-50 background
  card: '#FFFFFF', // Pure white cards for maximum contrast with background
  cardNavy: '#FFFFFF', // Using white card since user requested light theme
  text: '#0F172A', // Slate-900 High contrast text
  textMuted: '#64748B', // Slate-500
  textLight: '#94A3B8', // Slate-400
  border: '#E2E8F0', // Soft dividers
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const FONTS = {
  bold: 'System', // system font weight configurations
  semibold: 'System',
  medium: 'System',
  regular: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const COMMON_STYLES = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  shadow: {
    ...SHADOWS.md,
  },
});

// Detect web environment
export const isWeb = Platform.OS === 'web';
export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
