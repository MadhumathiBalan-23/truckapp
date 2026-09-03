import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverParamList } from '../../navigation/types';
import { useBookingStore } from '../../store/bookingStore';
import { driverService } from '../../services/driverService';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';

type ActiveTripRouteProp = RouteProp<DriverParamList, 'ActiveTrip'>;
type ActiveTripNavigationProp = NativeStackNavigationProp<DriverParamList>;

export const ActiveTripScreen: React.FC = () => {
  const navigation = useNavigation<ActiveTripNavigationProp>();
  const route = useRoute<ActiveTripRouteProp>();

  const getBookingById = useBookingStore((state) => state.getBookingById);
  const booking = getBookingById(route.params.bookingId);

  const [loading, setLoading] = useState(false);

  if (!booking) {
    return (
      <SafeAreaView style={COMMON_STYLES.safeArea}>
        <Header title="Trip Checklist" onBack={() => navigation.goBack()} />
        <View style={styles.errorView}><Text style={styles.errorText}>No active assignment.</Text></View>
      </SafeAreaView>
    );
  }

  const handleStatusTransition = async (nextStatus: any, note: string) => {
    setLoading(true);
    try {
      await driverService.updateTripStatus(booking.id, nextStatus, note);
      setLoading(false);
      Alert.alert('Status Updated', `Shipment status in now: ${nextStatus.replace(/_/g, ' ')}`);
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Failed to update delivery event.');
    }
  };

  const handleCallCustomer = () => {
    Alert.alert('Calling Client', `Dialing ${booking.customerName} (${booking.customerMobile})...`);
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title={`Trip Registry #${booking.id}`} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Core Workflow Transition Panel */}
        <View style={[COMMON_STYLES.card, { borderColor: COLORS.primary, borderWidth: 1 }]}>
          <Text style={styles.cardHeader}>DISPATCH CONTROL BOARD</Text>
          <Text style={styles.statusTitle}>Current Status</Text>
          <View style={styles.badgeRow}>
            <StatusBadge status={booking.status} />
          </View>

          {/* Conditional Workflow Execution Triggers */}
          <View style={styles.controlSection}>
            {booking.status === 'DRIVER_ASSIGNED' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleStatusTransition('DRIVER_REACHED_PICKUP', 'Driver arrived at pickup warehouse.')}
              >
                <Text style={styles.actionBtnTxt}>📍 MARK ARRIVED AT PICKUP</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'DRIVER_REACHED_PICKUP' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleStatusTransition('LOADING_STARTED', 'Cargo loading process initiated.')}
              >
                <Text style={styles.actionBtnTxt}>📦 MARK LOADING STARTED</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'LOADING_STARTED' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleStatusTransition('TRUCK_IN_TRANSIT', 'Truck dispatched. In transit to destination.')}
              >
                <Text style={styles.actionBtnTxt}>🛣️ DISPATCH - START TRANSIT</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'TRUCK_IN_TRANSIT' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleStatusTransition('REACHED_DESTINATION', 'Loaded vehicle reached consignee drop-off.')}
              >
                <Text style={styles.actionBtnTxt}>🏠 MARK ARRIVED AT DROP-OFF</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'REACHED_DESTINATION' && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                onPress={() => {
                  // Complete trip, trigger payment completion if cash booking
                  handleStatusTransition('TRIP_COMPLETED', 'Shipment completed, goods handed over.');
                }}
              >
                <Text style={styles.actionBtnTxt}>🏁 VERIFY DELIVERY & COMPLETE</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'TRIP_COMPLETED' && (
              <View style={styles.completedBanner}>
                <Text style={styles.completedEmoji}>🎉</Text>
                <Text style={styles.completedTitle}>Cargo Job Completed</Text>
                <Text style={styles.completedSub}>This cargo shipment has been cleared and delivered.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Client details card */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>CONSIGNOR / CLIENT DEALS</Text>
          
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.custName}>{booking.customerName}</Text>
              <Text style={styles.custSub}>Client Account</Text>
            </View>
            
            <TouchableOpacity style={styles.callBtn} onPress={handleCallCustomer}>
              <Text style={styles.callBtnTxt}>📞 CALL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.addressLabel}>📤 PICKUP POINT</Text>
          <Text style={styles.addressVal}>{booking.pickupLocation}</Text>

          <Text style={styles.addressLabel}>📥 DELIVERY DESTINATION</Text>
          <Text style={styles.addressVal}>{booking.dropLocation}</Text>
        </View>

        {/* Load Summary */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>MANIFEST LOG</Text>
          <View style={styles.manifestRow}>
            <Text style={styles.manifestLabel}>Cargo Type</Text>
            <Text style={styles.manifestVal}>{booking.loadType}</Text>
          </View>
          <View style={styles.manifestRow}>
            <Text style={styles.manifestLabel}>Gross Weight</Text>
            <Text style={styles.manifestVal}>{booking.estimatedWeight}</Text>
          </View>
          {booking.additionalInstructions !== '' && (
            <View style={styles.manifestRow}>
              <Text style={styles.manifestLabel}>Driver Instructions</Text>
              <Text style={styles.manifestVal}>{booking.additionalInstructions}</Text>
            </View>
          )}
          <View style={styles.manifestRow}>
            <Text style={styles.manifestLabel}>Payment Terms</Text>
            <Text style={styles.manifestVal}>
              ₹{booking.priceDetails.total} ({booking.paymentMethod} • {booking.paymentStatus})
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  container: {
    padding: SPACING.lg,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  statusTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
  },
  controlSection: {
    marginTop: SPACING.xs,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  actionBtnTxt: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
  completedBanner: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: SPACING.md,
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
  },
  completedSub: {
    fontSize: 12.5,
    color: '#065F46',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarTxt: {
    fontSize: 18,
  },
  custName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  custSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  callBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: 8,
  },
  callBtnTxt: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  addressLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  addressVal: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  manifestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  manifestLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  manifestVal: {
    fontSize: 13.5,
    color: COLORS.text,
    fontWeight: '700',
  },
});
