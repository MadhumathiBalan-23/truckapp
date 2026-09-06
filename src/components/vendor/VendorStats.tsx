import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Just re-import correctly based on current TS path mapping
import { COMMON_STYLES as CommonStyles, COLORS as Colors, SPACING as Spacing } from '../../utils/theme';

export const VendorStats = ({ earnings, activeTrucks }: { earnings: number, activeTrucks: number }) => {
  return (
    <View style={CommonStyles.card}>
      <Text style={styles.title}>Vendor Performance</Text>
      <View style={CommonStyles.flexRowBetween}>
        <View>
          <Text style={styles.label}>Today's Earnings</Text>
          <Text style={styles.value}>₹{earnings}</Text>
        </View>
        <View>
          <Text style={styles.label}>Active Trucks</Text>
          <Text style={styles.value}>{activeTrucks}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
});
