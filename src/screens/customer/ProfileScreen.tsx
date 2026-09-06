import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { ROLE_PRIVILEGES } from '../../types/user';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const roleMeta = user?.role ? ROLE_PRIVILEGES[user.role] : ROLE_PRIVILEGES.CUSTOMER;
  const userPrivileges = user?.privileges || roleMeta.permissions;

  const handleLogout = () => {
    Alert.alert('Confirm Signout', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Signout', onPress: logout }
    ]);
  };

  const getRoleIcon = (role: string): any => {
    switch(role) {
      case 'ADMIN': return 'shield-account-outline';
      case 'VENDOR': return 'storefront-outline';
      case 'DRIVER': return 'steering-wheel';
      default: return 'account-outline';
    }
  };

  const OptionRow = ({ icon, title, onPress }: { icon: any, title: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionLeft}>
        <MaterialCommunityIcons name={icon} size={22} color={COLORS.textMuted} />
        <Text style={styles.optionName}>{title}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Account Profile" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} bounces={true}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarCircle, { backgroundColor: roleMeta.badgeColor + '15' }]}>
              <MaterialCommunityIcons name={getRoleIcon(user?.role || 'CUSTOMER')} size={36} color={roleMeta.badgeColor} />
            </View>

            <View style={styles.profileMeta}>
              <Text style={styles.userName}>{user?.name || 'Logistics User'}</Text>
              
              <View style={styles.badgeRow}>
                <View style={[styles.roleBadge, { backgroundColor: roleMeta.badgeColor + '20' }]}>
                  <Text style={[styles.roleBadgeText, { color: roleMeta.badgeColor }]}>
                    {user?.role || 'CUSTOMER'}
                  </Text>
                </View>

                {user?.mobileVerified !== false && (
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.success} />
                    <Text style={styles.verifiedBadgeText}> Verified</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactInfo}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="email-outline" size={18} color={COLORS.textMuted} />
              <Text style={styles.infoValue}>{user?.email || 'user@truckgo.com'}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="phone-outline" size={18} color={COLORS.textMuted} />
              <Text style={styles.infoValue}>+91 {user?.mobile || '9876543210'}</Text>
            </View>
          </View>
        </View>

        {/* User Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>WORKSPACE SETTINGS</Text>
          <View style={styles.settingsCard}>
            <OptionRow icon="bell-outline" title="Push & SMS Notifications" onPress={() => Alert.alert('Notifications', 'Notification preferences saved')} />
            <OptionRow icon="fingerprint" title="Security & Login" onPress={() => Alert.alert('Security', 'Security settings managed')} />
            <OptionRow icon="headset" title="Help & Support" onPress={() => Alert.alert('Support', 'Connecting you with support...')} />
            <OptionRow icon="shield-check-outline" title="Role Privileges" onPress={() => Alert.alert('Active Privileges', userPrivileges.join('\n• '))} />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} />
          <Text style={styles.logoutBtnTxt}>SIGN OUT</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.xl,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  profileMeta: {
    flex: 1,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  contactInfo: {
    gap: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoValue: {
    fontSize: 14.5,
    color: COLORS.text,
    fontWeight: '500',
  },
  settingsSection: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginLeft: SPACING.xs,
  },
  settingsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionName: {
    fontSize: 15,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2', // Very light red
    borderWidth: 1,
    borderColor: '#FCC2C2',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  logoutBtnTxt: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
