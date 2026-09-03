import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useTruckStore } from '../../store/truckStore';
import { useBookingStore } from '../../store/bookingStore';
import { MOCK_USERS } from '../../data/mockUsers';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';

type AdminDashboardNavigationProp = NativeStackNavigationProp<AdminParamList>;

export const AdminDashboard: React.FC = () => {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  
  const trucks = useTruckStore((state) => state.trucks);
  const bookings = useBookingStore((state) => state.bookings);

  const pendingTrucksCount = trucks.filter((t) => t.status === 'PENDING').length;
  const approvedTrucksCount = trucks.filter((t) => t.status === 'APPROVED').length;
  
  // Calculate platform metrics
  const totalBookings = bookings.length;
  const totalGMV = bookings.reduce((sum, b) => sum + b.priceDetails.total, 0);

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Control Center" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Board */}
        <View style={styles.adminCard}>
          <Text style={styles.adminSub}>PLATFORM ADMINISTRATOR</Text>
          <Text style={styles.adminTitle}>TruckGo Root Panel</Text>
          <Text style={styles.adminDesc}>Audit workspace accounts, verify commercial vehicles, and oversee system bookings.</Text>
        </View>

        {/* Analytics Grid */}
        <Text style={styles.sectionTitle}>Platform Analytics</Text>
        <View style={styles.grid}>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>👥</Text>
            <Text style={styles.cellValue}>{Object.keys(MOCK_USERS).length}</Text>
            <Text style={styles.cellLabel}>Active Accounts</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>🚛</Text>
            <Text style={styles.cellValue}>{trucks.length}</Text>
            <Text style={styles.cellLabel}>Registered Fleet</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>📋</Text>
            <Text style={styles.cellValue}>{totalBookings}</Text>
            <Text style={styles.cellLabel}>Total Bookings</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellEmoji}>💰</Text>
            <Text style={styles.cellValue}>₹{totalGMV}</Text>
            <Text style={styles.cellLabel}>Net Logistics GMV</Text>
          </View>
        </View>

        {/* Administration Tasks list */}
        <Text style={styles.sectionTitle}>Verify Workspace Queue</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => (navigation as any).navigate('Users')}
          >
            <View style={styles.menuIconBg}>
              <Text style={styles.menuIcon}>👥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>User Workspace Accounts</Text>
              <Text style={styles.menuDesc}>Monitor and audit drivers, vendors, and customers.</Text>
            </View>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, pendingTrucksCount > 0 ? styles.menuItemPending : null]}
            onPress={() => (navigation as any).navigate('Trucks')}
          >
            <View style={[styles.menuIconBg, { backgroundColor: COLORS.warningLight }]}>
              <Text style={styles.menuIcon}>🚛</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Fleet Verification Center</Text>
              <Text style={styles.menuDesc}>Verify RC, insurance, and approve truck registrations.</Text>
            </View>
            {pendingTrucksCount > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{pendingTrucksCount} New</Text>
              </View>
            )}
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => (navigation as any).navigate('Bookings')}
          >
            <View style={[styles.menuIconBg, { backgroundColor: COLORS.infoLight }]}>
              <Text style={styles.menuIcon}>📋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Master Booking Ledger</Text>
              <Text style={styles.menuDesc}>Audit customer invoices and payout statements.</Text>
            </View>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* System Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Operational System Metrics</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Approved Fleets</Text>
            <Text style={styles.summaryVal}>{approvedTrucksCount} Trucks</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active Dispatch Rate</Text>
            <Text style={styles.summaryVal}>
              {bookings.filter(b => b.status === 'TRUCK_IN_TRANSIT').length} Shipments Transit
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  adminCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  adminSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 2,
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 2,
  },
  adminDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
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
    marginBottom: SPACING.xs,
  },
  cellEmoji: {
    fontSize: 22,
    marginBottom: SPACING.xs,
  },
  cellValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  cellLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  menuItemPending: {
    backgroundColor: '#FFFBEB', // amber-50 layout warning
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  menuDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  arrowText: {
    fontSize: 20,
    color: COLORS.textMuted,
    fontWeight: 'bold',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pendingBadgeText: {
    color: COLORS.white,
    fontSize: 10.5,
    fontWeight: '800',
  },
  summaryCard: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  summaryTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '700',
  },
});
