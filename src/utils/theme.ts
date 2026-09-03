import { StyleSheet, Dimensions, Platform } from 'react-native';

export const COLORS = {
  // Primary Palette: High-Vis Logistics Orange & Deep Blue Navy
  primary: '#FF6500', // high-vis logistics orange
  primaryDark: '#E05500', // deep vibrant orange hover/pressed
  primaryLight: '#FFF2E8', // soft orange tint for backgrounds & badges
  
  secondary: '#0F172A', // Deep slate navy (Deep Blue core)
  secondaryDark: '#0A192F', // Deepest midnight blue background
  secondaryLight: '#1E293B', // Rich card navy / header blue
  
  accentBlue: '#2563EB', // Bright cobalt blue accent
  accentBlueLight: '#EFF6FF',
  
  // Role Specific Palette
  roleCustomer: '#FF6500', // Orange for Customer
  roleVendor: '#0EA5E9', // Sky Blue for Vehicle Owner
  roleDriver: '#10B981', // Emerald Green for Driver
  roleAdmin: '#8B5CF6', // Royal Purple for Admin
  
  // Status Colors
  success: '#10B981', // green for approved/completed
  successLight: '#ECFDF5',
  warning: '#F59E0B', // amber for pending/loading
  warningLight: '#FEF3C7',
  danger: '#EF4444', // red for rejected/cancelled
  dangerLight: '#FEF2F2',
  info: '#3B82F6', // blue for in-transit/info
  infoLight: '#EFF6FF',
  
  // Neutral Colors
  background: '#F8FAFC', // light grey background
  card: '#FFFFFF', // card back color
  cardNavy: '#0F172A', // navy card variant
  text: '#0F172A', // dark text slate-900
  textMuted: '#64748B', // muted text slate-500
  textLight: '#94A3B8', // slate-400
  border: '#E2E8F0', // slate-200 boundary lines
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
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
