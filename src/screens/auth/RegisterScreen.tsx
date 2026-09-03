import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { OtpVerificationModal } from '../../components/OtpVerificationModal';
import { UserRole, ROLE_PRIVILEGES } from '../../types/user';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const registerWithOtp = useAuthStore((state) => state.registerWithOtp);
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  // Form input states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');

  // OTP Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const selectedPrivileges = ROLE_PRIVILEGES[role];

  // Initiate OTP send for registration
  const handleInitiateRegistration = async () => {
    setErrorLocal(null);
    clearError();

    if (!name.trim()) return setErrorLocal('Full Name is required');
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    if (!cleanMobile) return setErrorLocal('Mobile number is required');
    if (cleanMobile.length < 10) return setErrorLocal('Enter a valid 10-digit mobile number');
    if (!email.trim()) return setErrorLocal('Email address is required');
    if (!email.includes('@')) return setErrorLocal('Enter a valid email address');
    if (!password) return setErrorLocal('Password is required');
    if (password.length < 6) return setErrorLocal('Password must be at least 6 characters');
    if (password !== confirmPassword) return setErrorLocal('Passwords do not match');

    // Send OTP to user's mobile number
    const res = await sendOtp(cleanMobile);
    if (res.success) {
      setShowOtpModal(true);
    }
  };

  // Complete OTP verification & registration
  const handleVerifyOtpAndRegister = async (otpCode: string) => {
    const success = await registerWithOtp(name, mobile, email, password, role, otpCode);
    if (success) {
      setShowOtpModal(false);
    }
    return success;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Register Account</Text>
            <Text style={styles.headerSub}>Create role-based workspace with Mobile OTP</Text>
          </View>
        </View>

        {/* Main Form Card */}
        <View style={styles.formCard}>
          {(errorLocal || authError) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {errorLocal || authError}</Text>
            </View>
          )}

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ramesh Sharma"
          />

          {/* Phone Number Field with +91 Country Badge */}
          <Text style={styles.fieldLabel}>Mobile Number (OTP Verification)</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeBadge}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneTextInput}
              value={mobile}
              onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
              placeholder="9876543210"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="ramesh@example.com"
            keyboardType="email-address"
          />

          {/* Role Picker Section */}
          <Text style={styles.fieldLabel}>Select Account Role & Privileges:</Text>
          <View style={styles.roleRow}>
            {(['CUSTOMER', 'VENDOR', 'DRIVER'] as UserRole[]).map((r) => {
              const isActive = role === r;
              const meta = ROLE_PRIVILEGES[r];

              return (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roleSelectCard,
                    isActive ? { borderColor: meta.badgeColor, backgroundColor: meta.badgeColor + '12' } : null,
                  ]}
                  onPress={() => setRole(r)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>{meta.icon}</Text>
                  <Text style={[styles.roleTitle, isActive ? { color: meta.badgeColor, fontWeight: '800' } : null]}>
                    {r === 'CUSTOMER' ? 'Customer' : r === 'VENDOR' ? 'Fleet Owner' : 'Driver'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Privileges Preview Card for Selected Role */}
          <View style={[styles.privilegeCard, { borderLeftColor: selectedPrivileges.badgeColor }]}>
            <View style={styles.privilegeHeader}>
              <Text style={styles.privilegeTitle}>
                {selectedPrivileges.icon} {selectedPrivileges.title} Privileges
              </Text>
            </View>
            <Text style={styles.privilegeDesc}>{selectedPrivileges.description}</Text>

            <View style={styles.permissionsList}>
              {selectedPrivileges.permissions.map((perm, idx) => (
                <View key={idx} style={styles.permissionItem}>
                  <Text style={[styles.checkIcon, { color: selectedPrivileges.badgeColor }]}>✓</Text>
                  <Text style={styles.permissionText}>{perm}</Text>
                </View>
              ))}
            </View>
          </View>

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••"
            secureTextEntry
          />

          <Button
            title="Verify Phone & Create Account →"
            onPress={handleInitiateRegistration}
            loading={isLoading}
            style={styles.registerBtn}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Already registered?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* OTP Verification Popup */}
      <OtpVerificationModal
        visible={showOtpModal}
        mobileNumber={mobile}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtpAndRegister}
        onResendOtp={async () => {
          await sendOtp(mobile);
        }}
        title="Verify Registration OTP"
        subtitle={`Verify mobile number to create your ${role} workspace`}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
    gap: SPACING.md,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.secondary, // Deep Blue Navy
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.xl,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  errorContainer: {
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
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
    marginBottom: SPACING.md,
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
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  roleSelectCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  roleEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  privilegeCard: {
    backgroundColor: '#0F172A', // Deep Slate Navy for Privilege Box
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  privilegeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  privilegeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
  privilegeDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: SPACING.sm,
    lineHeight: 16,
  },
  permissionsList: {
    gap: 4,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkIcon: {
    fontSize: 13,
    fontWeight: '900',
  },
  permissionText: {
    fontSize: 12,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  registerBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    gap: 6,
  },
  promptText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
