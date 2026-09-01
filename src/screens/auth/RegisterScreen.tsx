import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { UserRole } from '../../types/user';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const register = useAuthStore((state) => state.register);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleRegister = async () => {
    setErrorLocal(null);
    clearError();

    if (!name.trim()) return setErrorLocal('Full name is required');
    if (!mobile.trim()) return setErrorLocal('Mobile number is required');
    if (mobile.length < 10) return setErrorLocal('Enter a valid 10-digit mobile number');
    if (!email.trim()) return setErrorLocal('Email address is required');
    if (!email.includes('@')) return setErrorLocal('Enter a valid email address');
    if (!password) return setErrorLocal('Password is required');
    if (password.length < 6) return setErrorLocal('Password must be at least 6 characters');
    if (password !== confirmPassword) return setErrorLocal('Passwords do not match');

    const success = await register(name, mobile, email, password, role);
    if (!success) {
      // Error will reflect in store
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

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
            placeholder="John Doe"
          />

          <Input
            label="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            placeholder="9876543210"
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
            keyboardType="email-address"
          />

          {/* Role Picker Selection */}
          <Text style={styles.roleLabel}>I want to register as a:</Text>
          <View style={styles.roleRow}>
            {(['CUSTOMER', 'VENDOR', 'DRIVER'] as UserRole[]).map((r) => {
              const isActive = role === r;
              let emoji = '👤';
              let title = 'Customer';
              if (r === 'VENDOR') { emoji = '🏢'; title = 'Owner'; }
              if (r === 'DRIVER') { emoji = '🧑‍✈️'; title = 'Driver'; }

              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleSelectCard, isActive ? styles.roleSelectActive : null]}
                  onPress={() => setRole(r)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>{emoji}</Text>
                  <Text style={[styles.roleTitle, isActive ? styles.roleTitleActive : null]}>
                    {title}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
            title="Create Workspace"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerBtn}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Already registered?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  backText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.xl,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorContainer: {
    backgroundColor: COLORS.dangerLight,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  roleSelectCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  roleSelectActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  roleEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  roleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  roleTitleActive: {
    color: COLORS.primary,
  },
  registerBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    marginTop: SPACING.md,
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
    fontWeight: '500',
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
