import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { BookingCard } from '../../components/BookingCard';

export const DriverHistoryScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const getDriverBookings = useBookingStore((state) => state.getDriverBookings);
  const bookings = getDriverBookings(user?.name || 'Arun Kumar');

  const completedTrips = bookings.filter((b) => b.status === 'TRIP_COMPLETED' || b.status === 'CANCELLED');

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Trip Logbook" />

      <FlatList
        data={completedTrips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>📜</Text>
            <Text style={styles.emptyTitle}>Logbook is empty</Text>
            <Text style={styles.emptySub}>You have no completed delivery records in your logs yet.</Text>
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
