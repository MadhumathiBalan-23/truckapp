import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverParamList } from '../../navigation/types';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { BookingCard } from '../../components/common/BookingCard';

type TripsNavigationProp = NativeStackNavigationProp<DriverParamList>;

export const DriverTripsScreen: React.FC = () => {
  const navigation = useNavigation<TripsNavigationProp>();
  const user = useAuthStore((state) => state.user);
  
  const allBookings = useBookingStore((state) => state.bookings);
  const driverName = user?.name || 'Arun Kumar';
  const bookings = React.useMemo(
    () => allBookings.filter((b) => b.driverName === driverName),
    [allBookings, driverName]
  );

  const ongoingTrips = bookings.filter(
    (b) => b.status !== 'TRIP_COMPLETED' && b.status !== 'CANCELLED'
  );

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Cargo Assignments" />

      <FlatList
        data={ongoingTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            actionText="Control Center"
            onActionPress={() => navigation.navigate('ActiveTrip', { bookingId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>No active dispatches</Text>
            <Text style={styles.emptySub}>You have no assigned delivery cargo items at this moment.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: SPACING.lg,
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
