import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isOutline = type === 'outline';
  const isSecondary = type === 'secondary';
  const isDanger = type === 'danger';

  const getButtonStyles = () => {
    const base: ViewStyle[] = [styles.button];

    if (type === 'primary') base.push({ backgroundColor: COLORS.primary });
    if (isSecondary) base.push({ backgroundColor: COLORS.secondary });
    if (isDanger) base.push({ backgroundColor: COLORS.danger });
    if (isOutline) base.push({ backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary });

    if (size === 'sm') base.push({ paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md });
    if (size === 'lg') base.push({ paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl });

    if (disabled || loading) {
      base.push({ opacity: 0.6 });
    }

    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text];

    if (isOutline) base.push({ color: COLORS.primary });
    else base.push({ color: COLORS.white });

    if (size === 'sm') base.push({ fontSize: 13, fontWeight: '600' });
    if (size === 'lg') base.push({ fontSize: 16, fontWeight: '700' });

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} size="small" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
