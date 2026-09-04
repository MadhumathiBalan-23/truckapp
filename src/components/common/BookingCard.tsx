import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Booking } from '../../types/booking';
import { StatusBadge } from './StatusBadge';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  actionText?: string;
  onActionPress?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  actionText,
  onActionPress,
}) => {
  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.idText}>BOOKING #{booking.id}</Text>
          <Text style={styles.dateText}>{formatDate(booking.pickupDate)} • {booking.pickupTime}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View style={styles.addressSection}>
        <View style={styles.routeDotContainer}>
          <View style={styles.dotPickup} />
          <View style={styles.routeLine} />
          <View style={styles.dotDrop} />
        </View>
        <View style={styles.addressTextContainer}>
          <Text style={styles.addressText} numberOfLines={1}>
            {booking.pickupLocation}
          </Text>
          <Text style={[styles.addressText, { marginTop: 22 }]} numberOfLines={1}>
            {booking.dropLocation}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.truckText}>{booking.truckDetails.brand} {booking.truckDetails.model} ({booking.truckDetails.truckNumber})</Text>
          <Text style={styles.priceText}>Total: ₹{booking.priceDetails.total}</Text>
        </View>

        {actionText && onActionPress && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={(e) => {
              e.stopPropagation();
              onActionPress();
            }}
          >
            <Text style={styles.actionText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 2,
  },
  addressSection: {
    flexDirection: 'row',
    marginVertical: SPACING.sm,
    paddingLeft: SPACING.xs,
  },
  routeDotContainer: {
    alignItems: 'center',
    marginRight: SPACING.md,
    paddingVertical: 5,
  },
  dotPickup: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  dotDrop: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.info,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  truckText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
