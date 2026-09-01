import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerParamList } from '../../navigation/types';
import { useBookingStore } from '../../store/bookingStore';
import { paymentService } from '../../services/paymentService';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

type PaymentRouteProp = RouteProp<CustomerParamList, 'Payment'>;
type PaymentNavigationProp = NativeStackNavigationProp<CustomerParamList>;

type MethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<PaymentNavigationProp>();
  const route = useRoute<PaymentRouteProp>();
  
  const getBookingById = useBookingStore((state) => state.getBookingById);
  const booking = getBookingById(route.params.bookingId);

  const [paymentMethod, setPaymentMethod] = useState<MethodType>('UPI');
  const [loading, setLoading] = useState(false);

  if (!booking) {
    return (
      <SafeAreaView style={COMMON_STYLES.safeArea}>
        <Header title="Payment" onBack={() => navigation.goBack()} />
        <View style={styles.errorView}><Text style={styles.errorText}>Booking not found</Text></View>
      </SafeAreaView>
    );
  }

  const handlePayNow = async () => {
    setLoading(true);

    try {
      const success = await paymentService.processPayment(
        booking.id,
        paymentMethod,
        booking.priceDetails.total
      );

      setLoading(false);

      if (success) {
        Alert.alert('Payment Successful', 'Your booking request is now active and sent to the vendor!', [
          {
            text: 'Track Order',
            onPress: () => navigation.navigate('LiveTracking', { bookingId: booking.id }),
          },
        ]);
      } else {
        Alert.alert('Error', 'Payment transaction failed. Please retry.');
      }
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Failed to communicate with payment processor.');
    }
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Secure Checkout" onBack={() => navigation.goBack()} />

      <View style={COMMON_STYLES.container}>
        {/* Receipt Overview */}
        <View style={styles.receiptCard}>
          <Text style={styles.receiptHeader}>PAYMENT SUMMARY</Text>
          <Text style={styles.bookingId}>Booking Reference: #{booking.id}</Text>
          <Text style={styles.routeLabel}>
            {booking.pickupLocation.split(',')[0]} → {booking.dropLocation.split(',')[0]}
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.priceRow}>
            <Text style={styles.label}>Truck fare</Text>
            <Text style={styles.value}>₹{booking.priceDetails.truckCharge}</Text>
          </View>
          {booking.priceDetails.driverCharge > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.label}>Driver allowance</Text>
              <Text style={styles.value}>₹{booking.priceDetails.driverCharge}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.label}>Taxes & Platform Fees</Text>
            <Text style={styles.value}>
              ₹{booking.priceDetails.tax + booking.priceDetails.platformFee}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.priceRow, { marginTop: 4 }]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{booking.priceDetails.total}</Text>
          </View>
        </View>

        {/* Payment options */}
        <Text style={styles.methodHeader}>Select Payment Mode</Text>

        <View style={styles.methodsContainer}>
          {(['UPI', 'CARD', 'NET_BANKING', 'CASH'] as MethodType[]).map((method) => {
            const isSelected = paymentMethod === method;
            let iconText = '📱';
            let label = 'UPI / PhonePe / GPay';
            
            if (method === 'CARD') { iconText = '💳'; label = 'Debit / Credit Card'; }
            if (method === 'NET_BANKING') { iconText = '🏦'; label = 'Net Banking'; }
            if (method === 'CASH') { iconText = '💵'; label = 'Pay on Delivery / Cash'; }

            return (
              <TouchableOpacity
                key={method}
                style={[styles.methodCard, isSelected ? styles.methodCardActive : null]}
                onPress={() => setRole => setPaymentMethod(method)}
                activeOpacity={0.8}
              >
                <Text style={styles.methodIcon}>{iconText}</Text>
                <Text style={[styles.methodLabel, isSelected ? styles.methodLabelActive : null]}>
                  {label}
                </Text>
                <View style={[styles.radioCircle, isSelected ? styles.radioSelected : null]} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        <Button
          title={`PAY NOW ₹${booking.priceDetails.total}`}
          onPress={handlePayNow}
          loading={loading}
          style={styles.payBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  receiptCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
    marginBottom: SPACING.xl,
  },
  receiptHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  bookingId: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  routeLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '850',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  methodHeader: {
    fontSize: 15,
    fontWeight: '850',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  methodsContainer: {
    gap: SPACING.sm,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: SPACING.lg,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  methodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  methodIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  methodLabelActive: {
    color: COLORS.primary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  payBtn: {
    height: 52,
    borderRadius: 14,
    marginBottom: SPACING.md,
  },
});
