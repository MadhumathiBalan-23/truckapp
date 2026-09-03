import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerParamList } from '../../navigation/types';
import { useTruckStore } from '../../store/truckStore';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

type BookingRouteProp = RouteProp<CustomerParamList, 'BookingForm'>;
type BookingNavigationProp = NativeStackNavigationProp<CustomerParamList>;

export const BookingScreen: React.FC = () => {
  const navigation = useNavigation<BookingNavigationProp>();
  const route = useRoute<BookingRouteProp>();
  
  const getTruckById = useTruckStore((state) => state.getTruckById);
  const createBooking = useBookingStore((state) => state.createBooking);
  const user = useAuthStore((state) => state.user);

  const truck = getTruckById(route.params.truckId);

  const [pickup, setPickup] = useState(route.params.pickupLocation || '');
  const [drop, setDrop] = useState(route.params.dropLocation || '');
  const [date, setDate] = useState(route.params.date || '');
  const [time, setTime] = useState(route.params.time || '');
  
  const [loadType, setLoadType] = useState('Commercial goods');
  const [weight, setWeight] = useState('3 Tons');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  if (!truck) {
    return (
      <SafeAreaView style={COMMON_STYLES.safeArea}>
        <Header title="Book Truck" onBack={() => navigation.goBack()} />
        <View style={styles.errorView}><Text style={styles.errorText}>Truck not found</Text></View>
      </SafeAreaView>
    );
  }

  // Calculate pricing breakdown based on distance metrics
  const distance = 120; // Simulated constant metric KM for demo booking
  const truckCharge = distance * truck.pricePerKm;
  const driverCharge = truck.driverAvailable ? 1000 : 0;
  const platformFee = 150;
  const tax = Math.round((truckCharge + driverCharge) * 0.05); // 5% GST
  const total = truckCharge + driverCharge + platformFee + tax;

  const handleConfirmBooking = async () => {
    if (!pickup.trim()) return Alert.alert('Error', 'Pickup location is required');
    if (!drop.trim()) return Alert.alert('Error', 'Drop location is required');
    if (!date.trim()) return Alert.alert('Error', 'Pickup Date is required');
    if (!time.trim()) return Alert.alert('Error', 'Pickup Time is required');
    if (!loadType.trim()) return Alert.alert('Error', 'Load type is required');

    setLoading(true);

    try {
      const priceDetails = {
        distance,
        truckCharge,
        driverCharge,
        platformFee,
        tax,
        total,
      };

      const bookingId = await createBooking({
        customerId: user?.id || 'USR001',
        customerName: user?.name || 'Guest User',
        customerMobile: user?.mobile || '9876543210',
        truckId: truck.id,
        truckDetails: truck,
        pickupLocation: pickup,
        dropLocation: drop,
        pickupDate: date,
        pickupTime: time,
        truckType: truck.truckType,
        loadType,
        estimatedWeight: weight,
        additionalInstructions: instructions,
        priceDetails,
      });

      setLoading(false);
      
      // Auto transition to Payment details
      navigation.navigate('Payment', { bookingId });
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err?.message || 'Failed to submit booking request.');
    }
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Book Truck" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* Truck snapshot info */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>VEHICLE SELECTION</Text>
          <Text style={styles.truckName}>{truck.brand} {truck.model}</Text>
          <Text style={styles.truckSub}>{truck.truckType} • Max capacity: {truck.capacity}</Text>
          <Text style={styles.truckPlate}>{truck.truckNumber}</Text>
        </View>

        {/* Route Details */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>ROUTE DETAILS</Text>
          <Input label="Pickup Address" value={pickup} onChangeText={setPickup} placeholder="Enter pickup address" />
          <Input label="Delivery Destination" value={drop} onChangeText={setDrop} placeholder="Enter Drop address" />
          <View style={styles.row}>
            <View style={{ flex: 1 }}><Input label="Pickup Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" /></View>
            <View style={{ flex: 1 }}><Input label="Pickup Time" value={time} onChangeText={setTime} placeholder="10:00 AM" /></View>
          </View>
        </View>

        {/* Load Details */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>LOAD SPECIFICATIONS</Text>
          <Input label="Goods Category / Type" value={loadType} onChangeText={setLoadType} placeholder="e.g. Household shifting, Steel boxes" />
          <Input label="Estimated Load Weight" value={weight} onChangeText={setWeight} placeholder="e.g. 2.5 Tons" />
          <Input label="Delivery Notes / Instructions" value={instructions} onChangeText={setInstructions} placeholder="e.g. Handle with care, call before arrival" />
        </View>

        {/* Pricing breakdown */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>FARE BREAKDOWN</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Distance Charge (120 KM)</Text>
            <Text style={styles.priceValue}>₹{truckCharge}</Text>
          </View>
          
          {truck.driverAvailable && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Driver Allowance</Text>
              <Text style={styles.priceValue}>₹{driverCharge}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>TruckGo Platform Fee</Text>
            <Text style={styles.priceValue}>₹{platformFee}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST Taxes (5%)</Text>
            <Text style={styles.priceValue}>₹{tax}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.priceRow, { marginVertical: 4 }]}>
            <Text style={styles.totalLabel}>Estimate Fare</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        <Button
          title="CONFIRM BOOKING"
          onPress={handleConfirmBooking}
          loading={loading}
          style={styles.submitBtn}
        />
        
        {/* Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  truckName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  truckSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  truckPlate: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.xs,
  },
  priceLabel: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 13.5,
    color: COLORS.text,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    marginVertical: SPACING.md,
  },
  errorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
});
