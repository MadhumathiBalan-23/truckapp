import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar as RNStatusBar,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { OtpVerificationModal } from '../../components/common/OtpVerificationModal';
import { UserRole } from '../../types/user';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'Login'>;

const ROLES: { id: UserRole; label: string; icon: string; color: string }[] = [
  { id: 'CUSTOMER', label: 'Customer', icon: '👤', color: COLORS.primary },
  { id: 'VENDOR', label: 'Fleet Owner', icon: '🏢', color: '#0EA5E9' },
  { id: 'DRIVER', label: 'Driver', icon: '🧑‍✈️', color: '#10B981' },
  { id: 'ADMIN', label: 'Admin', icon: '🛠️', color: '#8B5CF6' },
];

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute();
  const initialRole = (route.params as any)?.role || 'CUSTOMER';

  const sendOtp = useAuthStore((state) => state.sendOtp);
  const verifyOtpAndLogin = useAuthStore((state) => state.verifyOtpAndLogin);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  // Selected Workspace Role
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Clean empty mobile number input state
  const [mobileNumber, setMobileNumber] = useState('');

  // OTP Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  // Send OTP trigger
  const handleSendOtp = async () => {
    setErrorLocal(null);
    clearError();

    const cleanMobile = mobileNumber.replace(/[^0-9]/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorLocal('Please enter a valid 10-digit mobile number');
      return;
    }

    const res = await sendOtp(cleanMobile);
    if (res.success) {
      setShowOtpModal(true);
    }
  };

  // Verify OTP submission with selectedRole
  const handleVerifyOtp = async (otpCode: string) => {
    const success = await verifyOtpAndLogin(mobileNumber, otpCode, selectedRole);
    if (success) {
      setShowOtpModal(false);
    }
    return success;
  };

  const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) + 8 : 12;
  const activeRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Extreme Premium Glowing Data Map Background */}
      <Image source={require('../../../assets/login_bg.png')} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(9, 14, 23, 0.82)' }]} />

      {/* ══════ FIXED TOP HEADER (Never Scrolls) ══════ */}
      <View style={[styles.compactHeader, { paddingTop: topInset, backgroundColor: 'transparent' }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('Landing')}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerBrandName}>TRUKORA</Text>
            <Text style={styles.headerScreenTitle}>Sign In</Text>
          </View>

          <View style={{ width: 36 }} />
        </View>
        <View style={styles.accentLine} />
      </View>

      {/* Main Single-Screen Content (No Scroll Needed!) */}
      <View style={styles.singleScreenContainer}>
        {/* Role Workspace Selector Pills */}
        <Text style={styles.sectionLabel}>SELECT YOUR ROLE</Text>
        <View style={styles.rolePillsRow}>
          {ROLES.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.rolePill,
                  isSelected ? { borderColor: r.color, backgroundColor: r.color + '15' } : null,
                ]}
                onPress={() => {
                  setSelectedRole(r.id);
                  setErrorLocal(null);
                  clearError();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.rolePillIcon}>{r.icon}</Text>
                <Text
                  style={[
                    styles.rolePillLabel,
                    isSelected ? { color: r.color, fontWeight: '800' } : null,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clean Login Form Box */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{activeRoleObj.label} Mobile OTP</Text>
          <Text style={styles.formSub}>Enter your 10-digit mobile number to receive verification code</Text>

          {/* Error Alert Box */}
          {(errorLocal || authError) && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorLocal || authError}</Text>
            </View>
          )}

          {/* Mobile Phone Input */}
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeBadge}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneTextInput}
              value={mobileNumber}
              onChangeText={(val) => setMobileNumber(val.replace(/[^0-9]/g, ''))}
              placeholder="Mobile Number"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
              maxLength={10}
              autoFocus={true}
            />
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            style={[styles.sendOtpBtn, { backgroundColor: activeRoleObj.color }]}
            onPress={handleSendOtp}
            activeOpacity={0.85}
          >
            <Text style={styles.sendOtpBtnTxt}>Send Verification OTP →</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Quick Register Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLinkTxt, { color: activeRoleObj.color }]}>Register with OTP</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Mobile OTP Verification Modal */}
      <OtpVerificationModal
        visible={showOtpModal}
        mobileNumber={mobileNumber}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResendOtp={async () => {
          await sendOtp(mobileNumber);
        }}
        title={`${activeRoleObj.label} OTP Verification`}
        subtitle={`Verify mobile +91 ${mobileNumber} to enter ${activeRoleObj.label} portal`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondaryDark,
  },
  compactHeader: {
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
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  backBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: -2,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerBrandName: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 3,
  },
  headerScreenTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
    marginTop: -1,
  },
  accentLine: {
    height: 2,
    backgroundColor: COLORS.primary,
  },
  singleScreenContainer: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.xs + 2,
    textAlign: 'center',
  },
  rolePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.lg,
    justifyContent: 'center',
  },
  rolePill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    gap: 8,
    ...SHADOWS.sm,
  },
  rolePillIcon: {
    fontSize: 18,
  },
  rolePillLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.xl,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  formSub: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.xl,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: COLORS.dangerLight,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    height: 56,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    height: '100%',
    paddingHorizontal: SPACING.md,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  phoneTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    letterSpacing: 1,
  },
  sendOtpBtn: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  sendOtpBtnTxt: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13.5,
  },
  registerLinkTxt: {
    fontSize: 13.5,
    fontWeight: '900',
  },
});
