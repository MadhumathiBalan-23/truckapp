import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { MobileFrame } from '../../components/MobileFrame';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [emailMobile, setEmailMobile] = useState('customer@truckgo.com');
  const [password, setPassword] = useState('123456');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorLocal(null);
    clearError();
    
    if (!emailMobile.trim()) {
      setErrorLocal('Please enter Email or Mobile Number');
      return;
    }
    if (!password) {
      setErrorLocal('Please enter Password');
      return;
    }

    const success = await login(emailMobile, password);
    if (!success) {
      // Error is caught from the store
    }
  };

  // Shortcut login helper for demo verification
  const handleQuickLogin = async (email: string, pass: string) => {
    setEmailMobile(email);
    setPassword(pass);
    await login(email, pass);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.logoSection}>
          <Text style={styles.logoIcon}>🚚</Text>
          <Text style={styles.logoText}>TruckGo</Text>
          <Text style={styles.tagline}>Book Trucks. Move Goods. Track Everything.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardHeader}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to your TruckGo workspace</Text>

          {(errorLocal || authError) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {errorLocal || authError}</Text>
            </View>
          )}

          <Input
            label="Email or Mobile Number"
            value={emailMobile}
            onChangeText={setEmailMobile}
            placeholder="enter customer@truckgo.com"
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
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <View style={styles.signupPrompt}>
            <Text style={styles.promptText}>New to TruckGo?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Credentials Panel */}
        <View style={styles.demoPanel}>
          <Text style={styles.demoTitle}>Quick Demo Logins</Text>
          <View style={styles.demoGrid}>
            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => handleQuickLogin('customer@truckgo.com', '123456')}
            >
              <Text style={styles.demoChipEmoji}>👤</Text>
              <Text style={styles.demoChipText}>Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => handleQuickLogin('vendor@truckgo.com', '123456')}
            >
              <Text style={styles.demoChipEmoji}>🏢</Text>
              <Text style={styles.demoChipText}>Vendor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => handleQuickLogin('driver@truckgo.com', '123456')}
            >
              <Text style={styles.demoChipEmoji}>🧑‍✈️</Text>
              <Text style={styles.demoChipText}>Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => handleQuickLogin('admin@truckgo.com', 'admin123')}
            >
              <Text style={styles.demoChipEmoji}>🛠️</Text>
              <Text style={styles.demoChipText}>Admin</Text>
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
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoIcon: {
    fontSize: 50,
    marginBottom: SPACING.xs,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.xl,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.lg,
    fontWeight: '500',
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  loginButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    gap: 6,
  },
  promptText: {
    color: COLORS.textMuted,
    fontSize: 14.5,
    fontWeight: '500',
  },
  signupText: {
    color: COLORS.primary,
    fontSize: 14.5,
    fontWeight: '700',
  },
  demoPanel: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: 6,
    ...SHADOWS.sm,
  },
  demoChipEmoji: {
    fontSize: 14,
  },
  demoChipText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
  },
});
