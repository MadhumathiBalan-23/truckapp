import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { OtpVerificationModal } from '../../components/common/OtpVerificationModal';
import { UserRole } from '../../types/user';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'Register'>;

const ROLES: { id: UserRole; label: string; icon: string; color: string }[] = [
  { id: 'CUSTOMER', label: 'Customer', icon: '👤', color: COLORS.primary },
  { id: 'VENDOR', label: 'Fleet Owner', icon: '🏢', color: '#0EA5E9' },
  { id: 'DRIVER', label: 'Driver', icon: '🧑‍✈️', color: '#10B981' },
  { id: 'ADMIN', label: 'Admin', icon: '🛠️', color: '#8B5CF6' },
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const registerWithOtp = useAuthStore((state) => state.registerWithOtp);
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const activeRole = ROLES.find((r) => r.id === role) || ROLES[0];

  const handleSendOtp = async () => {
    setErrorLocal(null);
    clearError();

    if (!name.trim()) return setErrorLocal('Full name is required');
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    if (!cleanMobile || cleanMobile.length < 10) return setErrorLocal('Enter a valid 10-digit mobile number');

    const res = await sendOtp(cleanMobile);
    if (res.success) {
      setShowOtpModal(true);
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    const success = await registerWithOtp(name, mobile, `${mobile}@trukora.app`, 'Trukora@123', role, otpCode);
    if (success) setShowOtpModal(false);
    return success;
  };

  const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ══════ FIXED HEADER ══════ */}
      <View style={[styles.fixedHeader, { paddingTop: topInset }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Landing')} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerBrand}>TRUKORA</Text>
            <Text style={styles.headerTitle}>Create Account</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.accentLine} />
      </View>

      {/* ══════ FORM ══════ */}
      <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Role Selector */}
        <Text style={styles.sectionLabel}>SELECT YOUR ROLE</Text>
        <View style={styles.rolePillsRow}>
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.rolePill, isSelected ? { borderColor: r.color, backgroundColor: r.color + '15' } : null]}
                onPress={() => { setRole(r.id); setErrorLocal(null); clearError(); }}
                activeOpacity={0.8}
              >
                <Text style={styles.rolePillIcon}>{r.icon}</Text>
                <Text style={[styles.rolePillLabel, isSelected ? { color: r.color, fontWeight: '800' } : null]}>{r.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Register as {activeRole.label}</Text>
          <Text style={styles.formSub}>Enter your name & mobile number to register with OTP</Text>

          {(errorLocal || authError) && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorLocal || authError}</Text>
            </View>
          )}

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryBadge}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                value={mobile}
                onChangeText={(v) => setMobile(v.replace(/[^0-9]/g, ''))}
                placeholder="10-digit number"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerBtn, { backgroundColor: activeRole.color }]}
            onPress={handleSendOtp}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnTxt}>Verify & Register →</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: activeRole.color }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <OtpVerificationModal
        visible={showOtpModal}
        mobileNumber={mobile}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResendOtp={async () => { await sendOtp(mobile); }}
        title={`${activeRole.label} Registration`}
        subtitle={`Verify +91 ${mobile} to complete ${activeRole.label} registration`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  fixedHeader: {
    backgroundColor: COLORS.secondaryDark,
    zIndex: 100,
    ...SHADOWS.md,
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  backArrow: { fontSize: 22, fontWeight: '600', color: COLORS.white, marginTop: -2 },
  headerCenter: { alignItems: 'center' },
  headerBrand: { fontSize: 9, fontWeight: '900', color: COLORS.primary, letterSpacing: 3 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white, letterSpacing: 0.3, marginTop: -1 },
  accentLine: { height: 2, backgroundColor: COLORS.primary },
  scrollBody: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '900', color: COLORS.textMuted,
    letterSpacing: 1, marginBottom: 6, textAlign: 'center',
  },
  rolePillsRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    marginBottom: SPACING.lg, justifyContent: 'center',
  },
  rolePill: {
    width: '47%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 14, paddingHorizontal: SPACING.md, paddingVertical: 12, gap: 8,
    ...SHADOWS.sm,
  },
  rolePillIcon: { fontSize: 18 },
  rolePillLabel: { fontSize: 13.5, fontWeight: '700', color: COLORS.textMuted },
  formCard: {
    backgroundColor: COLORS.card, borderRadius: 24, padding: SPACING.xl,
    ...SHADOWS.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg,
  },
  formTitle: { fontSize: 20, fontWeight: '900', color: COLORS.secondary, textAlign: 'center' },
  formSub: {
    fontSize: 12.5, color: COLORS.textMuted, textAlign: 'center',
    marginTop: 4, marginBottom: SPACING.xl, lineHeight: 18,
  },
  errorBox: {
    backgroundColor: COLORS.dangerLight, padding: SPACING.md, borderRadius: 12,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: '#FCA5A5',
  },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  inputContainer: { marginBottom: SPACING.md },
  inputLabel: { fontSize: 12, fontWeight: '800', color: COLORS.secondary, marginBottom: 6, letterSpacing: 0.3 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 14, height: 52, paddingHorizontal: SPACING.md,
  },
  inputIcon: { fontSize: 16, marginRight: 8 },
  textInput: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.secondary },
  phoneRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.border, borderRadius: 14,
    backgroundColor: COLORS.background, height: 52, overflow: 'hidden',
  },
  countryBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.border, height: '100%', paddingHorizontal: SPACING.md, gap: 6,
  },
  flag: { fontSize: 18 },
  countryCode: { fontSize: 15, fontWeight: '800', color: COLORS.secondary },
  phoneInput: {
    flex: 1, height: '100%', fontSize: 17, fontWeight: '800',
    color: COLORS.secondary, paddingHorizontal: SPACING.md, letterSpacing: 1,
  },
  registerBtn: {
    height: 54, borderRadius: 16, justifyContent: 'center',
    alignItems: 'center', ...SHADOWS.md, marginTop: SPACING.sm,
  },
  registerBtnTxt: { color: COLORS.white, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerText: { color: COLORS.textMuted, fontSize: 13.5 },
  loginLink: { fontSize: 13.5, fontWeight: '900' },
});
