import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Image } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { ROLE_PRIVILEGES } from '../../types/user';

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

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Account & Privileges" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} bounces={true}>
        
        {/* Profile Hero Background */}
        <View style={styles.heroContainer}>
          <Image 
            source={require('../../../assets/profile_bg.png')} 
            style={styles.heroImg} 
          />
          <View style={styles.heroOverlay} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarCircle, { borderColor: roleMeta.badgeColor }]}>
              <Text style={styles.avatarEmoji}>{roleMeta.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user?.name || 'Logistics User'}</Text>
              
              <View style={styles.badgeRow}>
                <View style={[styles.roleBadge, { backgroundColor: roleMeta.badgeColor + '20' }]}>
                  <Text style={[styles.roleBadgeText, { color: roleMeta.badgeColor }]}>
                    {user?.role || 'CUSTOMER'}
                  </Text>
                </View>

                {user?.mobileVerified !== false && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>✓ Phone Verified</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 EMAIL ADDRESS</Text>
            <Text style={styles.infoValue}>{user?.email || 'user@truckgo.com'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📱 REGISTERED MOBILE</Text>
            <Text style={styles.infoValue}>+91 {user?.mobile || '9876543210'}</Text>
          </View>
        </View>

        {/* Role Privileges & Capabilities Card */}
        <View style={[styles.privilegeCard, { borderLeftColor: roleMeta.badgeColor }]}>
          <View style={styles.privilegeHeaderRow}>
            <Text style={styles.privilegeHeaderTitle}>
              🛡️ Active Role Privileges ({user?.role})
            </Text>
          </View>
          <Text style={styles.privilegeSub}>{roleMeta.description}</Text>

          <View style={styles.permList}>
            {userPrivileges.map((perm, idx) => (
              <View key={idx} style={styles.permItem}>
                <Text style={[styles.checkMark, { color: roleMeta.badgeColor }]}>✓</Text>
                <Text style={styles.permText}>{perm}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Settings */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.sectionTitle}>WORKSPACE SETTINGS</Text>
          
          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Notifications', 'Notification preferences saved')}>
            <Text style={styles.optionName}>🔔 Push & SMS Notifications</Text>
            <Text style={styles.optionArrow}>Enabled ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Security', 'Security settings managed')}>
            <Text style={styles.optionName}>🔒 Biometrics / OTP Login</Text>
            <Text style={styles.optionArrow}>Configured ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Support', 'Connecting you with 24/7 support...')}>
            <Text style={styles.optionName}>📞 24/7 Logistics Support</Text>
            <Text style={styles.optionArrow}>Chat ›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnTxt}>SIGN OUT WORKSPACE</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  heroContainer: {
    height: 180,
    marginHorizontal: -SPACING.lg,
    position: 'relative',
  },
  heroImg: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    marginTop: -40,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  verifiedBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  verifiedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  infoRow: {
    marginVertical: SPACING.xs,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14.5,
    color: COLORS.secondary,
    fontWeight: '700',
    marginTop: 2,
  },
  privilegeCard: {
    backgroundColor: '#0F172A', // Deep Slate Navy
    borderRadius: 20,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  privilegeHeaderRow: {
    marginBottom: 4,
  },
  privilegeHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
  },
  privilegeSub: {
    fontSize: 12.5,
    color: '#94A3B8',
    marginBottom: SPACING.md,
    lineHeight: 17,
  },
  permList: {
    gap: 6,
  },
  permItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkMark: {
    fontSize: 14,
    fontWeight: '900',
  },
  permText: {
    fontSize: 13,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionName: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  optionArrow: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  logoutBtnTxt: {
    color: COLORS.danger,
    fontSize: 14.5,
    fontWeight: '800',
  },
});
