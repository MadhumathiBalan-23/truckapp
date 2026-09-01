import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('Confirm Signout', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Signout', onPress: logout }
    ]);
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="My Account" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={COMMON_STYLES.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user?.name || 'Customer User'}</Text>
              <Text style={styles.roleBadge}>{user?.role || 'CUSTOMER'}</Text>
            </View>
          </View>

          <View style={COMMON_STYLES.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 EMAIL</Text>
            <Text style={styles.infoValue}>{user?.email || 'customer@truckgo.com'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📱 MOBILE</Text>
            <Text style={styles.infoValue}>{user?.mobile || '9876543210'}</Text>
          </View>
        </View>

        {/* User Settings */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.sectionTitle}>WORKSPACE PREFERENCES</Text>
          
          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Preferences', 'Notification preferences saved')}>
            <Text style={styles.optionName}>🔔 Push Notifications</Text>
            <Text style={styles.optionArrow}>Enabled ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Security', 'Security settings managed')}>
            <Text style={styles.optionName}>🔒 Biometrics / FaceID</Text>
            <Text style={styles.optionArrow}>Configure ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Support', 'Connecting you with support live chat...')}>
            <Text style={styles.optionName}>📞 Help & Logistics Support</Text>
            <Text style={styles.optionArrow}>Chat ›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
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
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  roleBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  infoRow: {
    marginVertical: SPACING.xs,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14.5,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
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
    color: COLORS.text,
    fontWeight: '600',
  },
  optionArrow: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  logoutBtnTxt: {
    color: COLORS.danger,
    fontSize: 14.5,
    fontWeight: '800',
  },
});
