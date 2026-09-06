import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EarningsScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const allBookings = useBookingStore((state) => state.bookings);
  
  const bookings = React.useMemo(() => {
    const vId = user?.id || 'USR002';
    return allBookings.filter(b => b.truckDetails.ownerId === vId);
  }, [allBookings, user?.id]);

  // Calculate earnings analytics
  const paidJobs = bookings.filter((b) => b.status === 'TRIP_COMPLETED');
  const onlineRevenue = paidJobs
    .filter((b) => b.paymentStatus === 'COMPLETED')
    .reduce((sum, b) => sum + b.priceDetails.truckCharge, 0);

  const cashRevenue = paidJobs
    .filter((b) => b.paymentStatus === 'PENDING' && b.paymentMethod === 'CASH')
    .reduce((sum, b) => sum + b.priceDetails.truckCharge, 0);

  const totalEarnings = onlineRevenue + cashRevenue;
  const platformFeesDeducted = Math.round(totalEarnings * 0.10); // 10% Platform fee simulation
  const netPayable = totalEarnings - platformFeesDeducted;

  const handleRequestPayout = () => {
    if (netPayable <= 0) {
      Alert.alert('Payout Request', 'You do not have any pending balance to withdraw.');
      return;
    }
    Alert.alert('Payout Request Saved', 'Your withdrawal request of ₹' + netPayable + ' is sent to Admin auditing.');
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="My Wallet & Earnings" />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.walletHeader}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceValue}>₹{netPayable.toLocaleString('en-IN')}</Text>
          
          <View style={styles.walletDetailsRow}>
            <View>
              <Text style={styles.walletDetailsLabel}>Gross Bookings</Text>
              <Text style={styles.walletDetailsVal}>₹{totalEarnings}</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View>
              <Text style={styles.walletDetailsLabel}>Platform Cut (10%)</Text>
              <Text style={styles.walletDetailsVal}>₹{platformFeesDeducted}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.payoutBtn} onPress={handleRequestPayout}>
            <Text style={styles.payoutBtnTxt}>WITHDRAW TO BANK ACCOUNT</Text>
          </TouchableOpacity>
        </View>

        {/* Breakdown Card */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.sectionHeader}>PAYMENT MODE DETAILS</Text>
          
          <View style={styles.breakdownRow}>
            <View>
              <Text style={styles.breakdownLabel}>Online Receipts (UPI/Card)</Text>
              <Text style={styles.breakdownValue}>₹{onlineRevenue}</Text>
            </View>
            <StatusBadge status="COMPLETED" />
          </View>
          
          <View style={COMMON_STYLES.divider} />

          <View style={styles.breakdownRow}>
            <View>
              <Text style={styles.breakdownLabel}>Cash Collected (COD)</Text>
              <Text style={styles.breakdownValue}>₹{cashRevenue}</Text>
            </View>
            <StatusBadge status="PENDING" />
          </View>
        </View>

        {/* Transaction History list */}
        <Text style={styles.listTitle}>Recent Logistics Payouts</Text>
        
        {paidJobs.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyTxt}>No transaction payouts logged yet.</Text>
          </View>
        ) : (
          paidJobs.map((item) => (
            <View key={item.id} style={styles.transCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.transId}>Ref: #{item.id}</Text>
                <Text style={styles.transRoute}>
                  {item.pickupLocation.split(',')[0]} → {item.dropLocation.split(',')[0]}
                </Text>
                <Text style={styles.transDate}>Paid via: {item.paymentMethod}</Text>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.transAmount}>+₹{item.priceDetails.truckCharge}</Text>
                <Text style={[styles.transStatus, item.paymentStatus === 'COMPLETED' ? styles.statusGreen : styles.statusRed]}>
                  {item.paymentStatus}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: SPACING.lg,
  },
  balanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  walletHeader: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 2,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginVertical: SPACING.sm,
  },
  walletDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  walletDetailsLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  walletDetailsVal: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  dividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
  },
  payoutBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutBtnTxt: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 12.5,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  breakdownLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  breakdownValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '800',
    marginTop: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  emptyView: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTxt: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  transCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  transId: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  transRoute: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: 2,
  },
  transDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  transAmount: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#059669',
  },
  transStatus: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusGreen: {
    color: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  statusRed: {
    color: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
});
