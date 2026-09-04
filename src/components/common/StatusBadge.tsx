import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import { BookingStatus } from '../../types/booking';

interface StatusBadgeProps {
  status: string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  const getBadgeColors = () => {
    switch (status) {
      // Truck Verification statuses
      case 'APPROVED':
        return { bg: COLORS.successLight, text: COLORS.success, label: 'Approved' };
      case 'PENDING':
      case 'PENDING_VERIFICATION':
        return { bg: COLORS.warningLight, text: COLORS.warning, label: 'Pending Verification' };
      case 'REJECTED':
        return { bg: COLORS.dangerLight, text: COLORS.danger, label: 'Rejected' };

      // Booking statuses
      case 'BOOKING_REQUESTED':
        return { bg: COLORS.warningLight, text: COLORS.warning, label: 'Requested' };
      case 'VENDOR_ACCEPTED':
      case 'ACCEPTED':
        return { bg: COLORS.infoLight, text: COLORS.info, label: 'Accepted' };
      case 'DRIVER_ASSIGNED':
        return { bg: '#F1F5F9', text: COLORS.secondary, label: 'Driver Assigned' };
      case 'DRIVER_REACHED_PICKUP':
        return { bg: '#E0F2FE', text: '#0369A1', label: 'Reached Pickup' };
      case 'LOADING_STARTED':
        return { bg: '#FEF3C7', text: '#D97706', label: 'Loading started' };
      case 'TRUCK_IN_TRANSIT':
        return { bg: '#F0F9FF', text: '#0284C7', label: 'In Transit' };
      case 'REACHED_DESTINATION':
        return { bg: '#ECFDF5', text: '#059669', label: 'Reached Drop' };
      case 'TRIP_COMPLETED':
        return { bg: COLORS.successLight, text: COLORS.success, label: 'Completed' };
      case 'CANCELLED':
        return { bg: COLORS.dangerLight, text: COLORS.danger, label: 'Cancelled' };

      default:
        return { bg: '#F1F5F9', text: COLORS.textMuted, label: status };
    }
  };

  const { bg, text, label } = getBadgeColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
