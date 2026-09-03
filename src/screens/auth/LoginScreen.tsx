import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { OtpVerificationModal } from '../../components/OtpVerificationModal';
import { ROLE_PRIVILEGES, UserRole } from '../../types/user';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const login = useAuthStore((state) => state.login);
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const verifyOtpAndLogin = useAuthStore((state) => state.verifyOtpAndLogin);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  // Tab mode: 'OTP' | 'PASSWORD'
  const [loginMode, setLoginMode] = useState<'OTP' | 'PASSWORD'>('OTP');

  // Input states
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [emailOrMobile, setEmailOrMobile] = useState('customer@truckgo.com');
  const [password, setPassword] = useState('123456');
  
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

  // Verify OTP submission
  const handleVerifyOtp = async (otpCode: string) => {
    const success = await verifyOtpAndLogin(mobileNumber, otpCode);
    if (success) {
      setShowOtpModal(false);
    }
    return success;
  };

  // Password Login submission
  const handlePasswordLogin = async () => {
    setErrorLocal(null);
    clearError();

    if (!emailOrMobile.trim()) {
      setErrorLocal('Please enter Email or Mobile Number');
      return;
    }
    if (!password) {
      setErrorLocal('Please enter Password');
      return;
    }

    await login(emailOrMobile, password);
  };

  // Quick Demo Login helper for role testing
  const handleQuickDemoLogin = async (mobile: string, email: string, pass: string) => {
    setMobileNumber(mobile);
    setEmailOrMobile(email);
    setPassword(pass);

    if (loginMode === 'OTP') {
      const res = await sendOtp(mobile);
      if (res.success) {
        setShowOtpModal(true);
      }
    } else {
      await login(email, pass);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Top Header with Deep Navy Background Accent */}
        <View style={styles.brandHeroCard}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>🚚</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>TruckGo</Text>
              <Text style={styles.brandSubtitle}>Role-Based Logistics Network</Text>
            </View>
          </View>
          <Text style={styles.brandDesc}>
            Instant freight booking, fleet dispatch & live trip tracking with mobile OTP.
          </Text>
        </View>

        {/* Main Form Container */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Select your login method to enter your workspace</Text>

          {/* Mode Switcher Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, loginMode === 'OTP' ? styles.tabBtnActive : null]}
              onPress={() => {
                setLoginMode('OTP');
                setErrorLocal(null);
                clearError();
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, loginMode === 'OTP' ? styles.tabTextActive : null]}>
                📱 Mobile OTP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, loginMode === 'PASSWORD' ? styles.tabBtnActive : null]}
              onPress={() => {
                setLoginMode('PASSWORD');
                setErrorLocal(null);
                clearError();
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, loginMode === 'PASSWORD' ? styles.tabTextActive : null]}>
                🔑 Password
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Alert Box */}
          {(errorLocal || authError) && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorLocal || authError}</Text>
            </View>
          )}

          {/* TAB 1: Mobile OTP Form */}
          {loginMode === 'OTP' ? (
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeBadge}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneTextInput}
                  value={mobileNumber}
                  onChangeText={(val) => setMobileNumber(val.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 10-digit mobile"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <Text style={styles.helperTip}>
                🔒 We will send a 4-digit OTP code to verify your mobile number.
              </Text>

              <Button
                title="Send Verification OTP →"
                onPress={handleSendOtp}
                loading={isLoading}
                style={styles.actionBtn}
              />
            </View>
          ) : (
            /* TAB 2: Password Form */
            <View style={styles.formSection}>
              <Input
                label="Email or Mobile Number"
                value={emailOrMobile}
                onChangeText={setEmailOrMobile}
                placeholder="customer@truckgo.com or 9876543210"
                keyboardType="email-address"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In with Password"
                onPress={handlePasswordLogin}
                loading={isLoading}
                style={styles.actionBtn}
              />
            </View>
          )}

          {/* Create Account Link */}
          <View style={styles.registerPromptRow}>
            <Text style={styles.promptText}>New to TruckGo?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLinkText}>Register with Mobile OTP</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Demo Accounts Grid */}
        <View style={styles.demoSection}>
          <Text style={styles.demoHeaderTitle}>Instant Role Logins (Demo)</Text>
          <Text style={styles.demoHeaderSub}>Tap any role to auto-fill & send verification OTP</Text>

          <View style={styles.demoGrid}>
            {(['CUSTOMER', 'VENDOR', 'DRIVER', 'ADMIN'] as UserRole[]).map((r) => {
              const info = ROLE_PRIVILEGES[r];
              let demoMobile = '9876543210';
              let demoEmail = 'customer@truckgo.com';
              let demoPass = '123456';

              if (r === 'VENDOR') {
                demoMobile = '9876543211';
                demoEmail = 'vendor@truckgo.com';
              } else if (r === 'DRIVER') {
                demoMobile = '9876543212';
                demoEmail = 'driver@truckgo.com';
              } else if (r === 'ADMIN') {
                demoMobile = '9876543213';
                demoEmail = 'admin@truckgo.com';
                demoPass = 'admin123';
              }

              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.demoRoleCard, { borderLeftColor: info.badgeColor }]}
                  onPress={() => handleQuickDemoLogin(demoMobile, demoEmail, demoPass)}
                  activeOpacity={0.8}
                >
                  <View style={styles.demoCardHeader}>
                    <Text style={styles.demoIcon}>{info.icon}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: info.badgeColor + '20' }]}>
                      <Text style={[styles.roleBadgeText, { color: info.badgeColor }]}>{r}</Text>
                    </View>
                  </View>

                  <Text style={styles.demoRoleTitle}>{info.title.split('/')[0]}</Text>
                  <Text style={styles.demoMobileText}>📱 +91 {demoMobile}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* Interactive Mobile OTP Modal */}
      <OtpVerificationModal
        visible={showOtpModal}
        mobileNumber={mobileNumber}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResendOtp={async () => {
          await sendOtp(mobileNumber);
        }}
        title="Mobile Verification OTP"
        subtitle={`Verify mobile number to sign in as role privilege`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  brandHeroCard: {
    backgroundColor: COLORS.secondaryDark, // Deep Midnight Navy
    borderRadius: 24,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  logoEmoji: {
    fontSize: 26,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  brandDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 4,
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
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 4,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.secondary, // Deep Blue active tab
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.white,
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
  },
  formSection: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    height: 52,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    height: '100%',
    paddingHorizontal: SPACING.md,
    gap: 4,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  phoneTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
    paddingHorizontal: SPACING.md,
  },
  helperTip: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
  },
  registerPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    gap: 6,
  },
  promptText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  registerLinkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  demoSection: {
    marginBottom: SPACING.xl,
  },
  demoHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoHeaderSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  demoRoleCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  demoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  demoIcon: {
    fontSize: 20,
  },
  roleBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  demoRoleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  demoMobileText: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
});
