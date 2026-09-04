import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Truck } from '../../types/truck';
import { StatusBadge } from './StatusBadge';

interface TruckCardProps {
  truck: Truck;
  onPress?: () => void;
  onBookNow?: () => void;
}

export const TruckCard: React.FC<TruckCardProps> = ({ truck, onPress, onBookNow }) => {
  // Use guaranteed local image asset
  const imageSource = require('../../../assets/truck_card.png');

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} style={styles.card}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.badgeContainer}>
        <StatusBadge status={truck.status} />
      </View>

      <View style={styles.contentContainer}>
        <View style={COMMON_STYLES.flexRowBetween}>
          <Text style={styles.modelName}>{truck.brand} {truck.model}</Text>
          <View style={COMMON_STYLES.flexRow}>
            <Text style={styles.ratingText}>⭐ {truck.rating || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.truckType}>{truck.truckType} • {truck.capacity}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Plate</Text>
            <Text style={styles.detailValue}>{truck.truckNumber}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rate/KM</Text>
            <Text style={styles.detailValue}>₹{truck.pricePerKm}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rate/Day</Text>
            <Text style={styles.detailValue}>₹{truck.pricePerDay}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={COMMON_STYLES.flexRowBetween}>
          <View style={COMMON_STYLES.flexRow}>
            <View style={[styles.indicator, { backgroundColor: truck.driverAvailable ? COLORS.success : COLORS.danger }]} />
            <Text style={styles.driverText}>
              {truck.driverAvailable ? 'Driver Available' : 'No Driver'}
            </Text>
          </View>

          {onBookNow && truck.status === 'APPROVED' && (
            <TouchableOpacity onPress={(e) => { e.stopPropagation(); onBookNow(); }} style={styles.bookBtn}>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    height: 150,
    width: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  truckType: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.sm,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  driverText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  bookBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
