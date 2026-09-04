import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        {message && <Text style={styles.messageText}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={COLORS.primary} />
      {message && <Text style={styles.messageTextInline}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  messageText: {
    marginTop: SPACING.md,
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  messageTextInline: {
    marginLeft: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
});
