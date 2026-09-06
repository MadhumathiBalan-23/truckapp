import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { ROLE_PRIVILEGES } from '../../types/user';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
              <MaterialCommunityIcons name="chevron-left" size={26} color={COLORS.secondaryDark} />
            </TouchableOpacity>
          ) : roleMeta ? (
            <View style={[styles.roleBadge, { backgroundColor: roleMeta.badgeColor + '20', borderColor: roleMeta.badgeColor }]}>
              <MaterialCommunityIcons name="shield-check" size={16} color={roleMeta.badgeColor} />
            </View>
          ) : null}
        </View>

        {/* Center: App Name + Title */}
        <View style={styles.centerSlot}>
          <Text style={styles.appBrandName}>TRUKORA</Text>
          <Text style={styles.screenTitle} numberOfLines={1}>{title}</Text>
        </View>

        {/* Right: Notifications & Logout */}
        <View style={styles.rightSlot}>
            <TouchableOpacity 
            style={styles.notifBtn} 
            activeOpacity={0.7} 
            onPress={() => Alert.alert('Notifications', 'No new notifications at this time.')}
          >
            <MaterialCommunityIcons name="bell-outline" size={20} color={COLORS.secondaryDark} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>

          {rightElement ? (
            rightElement
          ) : showLogout ? (
             <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
               <MaterialCommunityIcons name="logout" size={20} color={COLORS.secondaryDark} />
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
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftSlot: {
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    minWidth: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  appBrandName: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondaryDark,
    letterSpacing: 0.3,
    marginTop: -1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutBtn: {
     width: 38, height: 38, borderRadius: 19,
     backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center',
     borderWidth: 1, borderColor: '#FFE4E6'
  },
  roleBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  accentLine: {
    height: 1,
    backgroundColor: 'transparent',
    width: '100%',
  },
});
