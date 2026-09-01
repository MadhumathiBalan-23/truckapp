import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VendorParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useTruckStore } from '../../store/truckStore';
import { useBookingStore } from '../../store/bookingStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { BookingCard } from '../../components/BookingCard';

type VendorDashboardNavigationProp = NativeStackNavigationProp<VendorParamList>;

export const VendorDashboard: React.FC = () => {
  const navigation = useNavigation<VendorDashboardNavigationProp>();
  const user = useAuthStore((state) => state.user);
  
  const allTrucks = useTruckStore((state) => state.trucks);
  const allBookings = useBookingStore((state) => state.bookings);
  const vendorId = user?.id || 'USR002';

  const trucks = React.useMemo(
    () => allTrucks.filter((t) => t.vendorId === vendorId),
    [allTrucks, vendorId]
  );
  const bookings = React.useMemo(
    () => allBookings.filter((b) => b.vendorId === vendorId),
    [allBookings, vendorId]
  );

  // Calculate metrics
  const totalTrucks = trucks.length;
  const availableTrucks = trucks.filter((t) => t.status === 'APPROVED' && t.driverAvailable).length;
  const activeBookings = bookings.filter(
    (b) => b.status !== 'TRIP_COMPLETED' && b.status !== 'CANCELLED'
  ).length;
  const completedTrips = bookings.filter((b) => b.status === 'TRIP_COMPLETED').length;
  
  const totalEarnings = bookings
    .filter((b) => b.status === 'TRIP_COMPLETED' && b.paymentStatus === 'COMPLETED')
    .reduce((sum, b) => sum + b.priceDetails.truckCharge, 0);

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Vendor Dashboard" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Block */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeSub}>LOGISTICS PARTNER DECK</Text>
          <Text style={styles.welcomeTitle}>{user?.name || 'Balaji Logistics'}</Text>
          <Text style={styles.welcomeDesc}>Manage fleet, assign drivers, and track performance payouts.</Text>
        </View>

        {/* Analytics Grid */}
        <View style={styles.grid}>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>🚚</Text>
            <Text style={styles.cellValue}>{totalTrucks}</Text>
            <Text style={styles.cellLabel}>Total Trucks</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>🟢</Text>
            <Text style={styles.cellValue}>{availableTrucks}</Text>
            <Text style={styles.cellLabel}>Ready Fleets</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>📋</Text>
            <Text style={styles.cellValue}>{activeBookings}</Text>
            <Text style={styles.cellLabel}>Active Jobs</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>💵</Text>
            <Text style={styles.cellValue}>₹{totalEarnings}</Text>
            <Text style={styles.cellLabel}>Net Earnings</Text>
          </View>
        </View>

        {/* Quick Navigations */}
        <View style={styles.quickNavContainer}>
          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => (navigation as any).navigate('MyTrucks')}
          >
            <Text style={styles.quickNavTxt}>➕ ADD NEW TRUCK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickNavBtn, styles.quickNavBtnOutline]}
            onPress={() => (navigation as any).navigate('Bookings')}
          >
            <Text style={[styles.quickNavTxt, { color: COLORS.secondary }]}>📋 REGISTRY WORKLIST</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Workload */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Booking Activity</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('Bookings')}>
            <Text style={styles.viewAllText}>View All ›</Text>
          </TouchableOpacity>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No bookings requests received yet.</Text>
          </View>
        ) : (
          bookings.slice(0, 2).map((item) => (
            <BookingCard
              key={item.id}
              booking={item}
              onPress={() => (navigation as any).navigate('Bookings')}
            />
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  welcomeCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  welcomeSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 2,
  },
  welcomeDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  gridCell: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    alignItems: 'center',
  },
  cellEmoji: {
    fontSize: 22,
    marginBottom: SPACING.xs,
  },
  cellValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  cellLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  quickNavContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  quickNavBtn: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  quickNavBtnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  quickNavTxt: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '850',
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
