import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';

interface OtpVerificationModalProps {
  visible: boolean;
  mobileNumber: string;
  onClose: () => void;
  onVerify: (otpCode: string) => Promise<boolean>;
  onResendOtp: () => Promise<void>;
  title?: string;
  subtitle?: string;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  visible,
  mobileNumber,
  onClose,
  onVerify,
  onResendOtp,
  title = 'Verify Mobile Number',
  subtitle,
}) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(true);

  const inputRef0 = useRef<TextInput>(null);
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3];

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setOtpDigits(['', '', '', '']);
      setErrorMsg(null);
      setLoading(false);
      setTimerSeconds(30);
      setCanResend(false);
      setShowSmsBanner(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => inputRef0.current?.focus(), 300);
    }
  }, [visible]);

  // Countdown timer logic
  useEffect(() => {
    let interval: any;
    if (visible && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [visible, timerSeconds]);

  const handleDigitChange = (text: string, index: number) => {
    setErrorMsg(null);
    const cleaned = text.replace(/[^0-9]/g, '');

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (cleaned.length > 0 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleQuickAutoFill = () => {
    setOtpDigits(['1', '2', '3', '4']);
    setErrorMsg(null);
    inputRef3.current?.focus();
  };

  const handleVerify = async () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 4) {
      setErrorMsg('Please enter all 4 digits of the OTP code');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const success = await onVerify(fullOtp);
    setLoading(false);
    if (!success) {
      setErrorMsg('Invalid OTP code. Enter 1234 for demo login.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimerSeconds(30);
    setCanResend(false);
    setErrorMsg(null);
    setShowSmsBanner(true);
    await onResendOtp();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>

          {/* Simulated SMS Notification Banner */}
          {showSmsBanner && (
            <TouchableOpacity
              style={styles.smsBanner}
              activeOpacity={0.9}
              onPress={handleQuickAutoFill}
            >
              <View style={styles.smsHeaderRow}>
                <Text style={styles.smsIcon}>💬</Text>
                <Text style={styles.smsTitle}>MESSAGES • Just Now</Text>
              </View>
              <Text style={styles.smsBody}>
                Your Trukora verification OTP is <Text style={styles.smsCodeHighlight}>1234</Text>. Valid for 10 mins. Tap to auto-fill.
              </Text>
            </TouchableOpacity>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📱</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              {subtitle || `Enter 4-digit code sent to `}
              <Text style={styles.phoneHighlight}>+91 {mobileNumber}</Text>
            </Text>
          </View>

          {/* Error display */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          )}

          {/* 4 Digit Boxes */}
          <View style={styles.otpRow}>
            {otpDigits.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputRefs[idx]}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  errorMsg ? styles.otpInputError : null,
                ]}
                value={digit}
                onChangeText={(text) => handleDigitChange(text, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Quick Demo Fill Helper */}
          <TouchableOpacity style={styles.autoFillBtn} onPress={handleQuickAutoFill}>
            <Text style={styles.autoFillText}>⚡ Tap here to Auto-fill "1234"</Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyBtn, loading ? styles.verifyBtnDisabled : null]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.verifyBtnText}>Verify & Proceed →</Text>
            )}
          </TouchableOpacity>

          {/* Timer & Resend */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend OTP Code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend code available in <Text style={styles.timerBold}>{timerSeconds}s</Text>
              </Text>
            )}
          </View>

          {/* Cancel Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 47, 0.75)', // Deep midnight blue backdrop
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  smsBanner: {
    width: '100%',
    backgroundColor: '#0F172A', // Deep Blue Navy SMS banner
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  smsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  smsIcon: {
    fontSize: 14,
  },
  smsTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  smsBody: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
  },
  smsCodeHighlight: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 13.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  phoneHighlight: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  errorBox: {
    width: '100%',
    backgroundColor: COLORS.dangerLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: SPACING.md,
  },
  otpInput: {
    width: 56,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  otpInputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  autoFillBtn: {
    backgroundColor: '#FFF2E8',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FFD8BF',
  },
  autoFillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  verifyBtn: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  verifyBtnDisabled: {
    opacity: 0.7,
  },
  verifyBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  resendContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  timerBold: {
    fontWeight: '700',
    color: COLORS.secondary,
  },
  resendLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  closeBtn: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  closeBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
