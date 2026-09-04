import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [emailMobile, setEmailMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const handleRequestOtp = () => {
    if (!emailMobile.trim()) {
      Alert.alert('Error', 'Please enter your email or mobile number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      Alert.alert('Demo Notice', 'A mock verification code 123456 has been sent.');
    }, 800);
  };

  const handleResetPassword = () => {
    if (otp !== '123456') {
      Alert.alert('Error', 'Invalid verification code. Enter 123456 for demo.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Password has been reset successfully. Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
        </View>

        <View style={styles.formCard}>
          {!otpSent ? (
            <>
              <Text style={styles.description}>
                Enter your mobile number or email address. We will send you a 6-digit OTP to reset your password.
              </Text>
              
              <Input
                label="Email / Mobile"
                value={emailMobile}
                onChangeText={setEmailMobile}
                placeholder="customer@truckgo.com"
                keyboardType="email-address"
              />

              <Button
                title="Send Code"
                onPress={handleRequestOtp}
                loading={loading}
                style={styles.actionBtn}
              />
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Enter the 6-digit OTP that was sent (Use code: 123456).
              </Text>

              <Input
                label="verification code"
                value={otp}
                onChangeText={setOtp}
                placeholder="123456"
                keyboardType="numeric"
                maxLength={6}
              />

              <Input
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="••••••"
                secureTextEntry
              />

              <Button
                title="Confirm Reset"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.actionBtn}
              />

              <TouchableOpacity style={styles.resendBtn} onPress={() => setOtpSent(false)}>
                <Text style={styles.resendText}>Back to Email/Mobile input</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
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
  description: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.lg,
    fontWeight: '500',
  },
  actionBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    marginTop: SPACING.md,
  },
  resendBtn: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
