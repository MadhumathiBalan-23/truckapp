import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { ROLE_PRIVILEGES } from '../../types/user';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightElement, showLogout = true }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const roleMeta = user?.role ? ROLE_PRIVILEGES[user.role] : null;

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Log out of Trukora and return to Login?')) {
        logout();
      }
    } else {
      Alert.alert('Sign Out', 'Log out of Trukora?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]);
    }
  };

  const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0;

  return (
    <View style={[styles.fixedHeaderWrapper, { paddingTop: topInset }]}>
      <StatusBar style="light" />

      {/* Main Header Bar */}
      <View style={styles.headerBar}>
        {/* Left: Back or Role Badge */}
        <View style={styles.leftSlot}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          ) : roleMeta ? (
            <View style={[styles.roleBadge, { backgroundColor: roleMeta.badgeColor + '20', borderColor: roleMeta.badgeColor }]}>
              <Text style={styles.roleIcon}>{roleMeta.icon}</Text>
            </View>
          ) : null}
        </View>

        {/* Center: App Name + Title */}
        <View style={styles.centerSlot}>
          <Text style={styles.appBrandName}>TRUKORA</Text>
          <Text style={styles.screenTitle} numberOfLines={1}>{title}</Text>
        </View>

        {/* Right: Logout or Custom */}
        <View style={styles.rightSlot}>
          {rightElement ? (
            rightElement
          ) : showLogout ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Text style={styles.logoutTxt}>Exit</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Orange Accent Line */}
      <View style={styles.accentLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  fixedHeaderWrapper: {
    backgroundColor: COLORS.secondaryDark,
    ...SHADOWS.md,
    zIndex: 100,
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  leftSlot: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  appBrandName: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 3,
  },
  screenTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
    marginTop: -1,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: -2,
  },
  roleBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  logoutTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  accentLine: {
    height: 2,
    backgroundColor: COLORS.primary,
    width: '100%',
  },
});
