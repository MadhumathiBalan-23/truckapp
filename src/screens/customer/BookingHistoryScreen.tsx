import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerParamList } from '../../navigation/types';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { BookingCard } from '../../components/common/BookingCard';
import { Booking } from '../../types/booking';

type HistoryNavigationProp = NativeStackNavigationProp<CustomerParamList>;

type TabType = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export const BookingHistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryNavigationProp>();
  const user = useAuthStore((state) => state.user);
  
  const allBookings = useBookingStore((state) => state.bookings);
  const userId = user?.id || 'USR001';
  const bookings = React.useMemo(
    () => allBookings.filter((b) => b.customerId === userId),
    [allBookings, userId]
  );

  const [activeTab, setActiveTab] = useState<TabType>('ACTIVE');

  const filterBookings = () => {
    switch (activeTab) {
      case 'UPCOMING':
        return bookings.filter((b) => b.status === 'BOOKING_REQUESTED');
      case 'ACTIVE':
        return bookings.filter(
          (b) =>
            b.status !== 'BOOKING_REQUESTED' &&
            b.status !== 'TRIP_COMPLETED' &&
            b.status !== 'CANCELLED'
        );
      case 'COMPLETED':
        return bookings.filter((b) => b.status === 'TRIP_COMPLETED');
      case 'CANCELLED':
        return bookings.filter((b) => b.status === 'CANCELLED');
      default:
        return [];
    }
  };

  const filteredList = filterAndSort(filterBookings());

  function filterAndSort(list: Booking[]) {
    // Sort newest first
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const renderTab = (type: TabType, label: string) => {
    const isActive = activeTab === type;
    const count = bookings.filter((b) => {
      if (type === 'UPCOMING') return b.status === 'BOOKING_REQUESTED';
      if (type === 'ACTIVE') return b.status !== 'BOOKING_REQUESTED' && b.status !== 'TRIP_COMPLETED' && b.status !== 'CANCELLED';
      if (type === 'COMPLETED') return b.status === 'TRIP_COMPLETED';
      return b.status === 'CANCELLED';
    }).length;

    return (
      <TouchableOpacity
        style={[styles.tabButton, isActive ? styles.tabButtonActive : null]}
        onPress={() => setActiveTab(type)}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : null]}>
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="My Bookings" />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {renderTab('UPCOMING', 'Pending')}
        {renderTab('ACTIVE', 'Active')}
        {renderTab('COMPLETED', 'Done')}
        {renderTab('CANCELLED', 'Closed')}
      </View>

      {/* List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => {
              if (item.status === 'BOOKING_REQUESTED') {
                navigation.navigate('Payment', { bookingId: item.id });
              } else {
                navigation.navigate('LiveTracking', { bookingId: item.id });
              }
            }}
            actionText={
              item.status === 'BOOKING_REQUESTED'
                ? 'Pay Fare'
                : item.status === 'TRIP_COMPLETED'
                ? 'Rate Job'
                : 'Track location'
            }
            onActionPress={() => {
              if (item.status === 'BOOKING_REQUESTED') {
                navigation.navigate('Payment', { bookingId: item.id });
              } else if (item.status === 'TRIP_COMPLETED') {
                // Rate Job
                navigation.navigate('LiveTracking', { bookingId: item.id });
              } else {
                navigation.navigate('LiveTracking', { bookingId: item.id });
              }
            }}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySub}>You do not have any jobs listed in this section.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
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
  },
});
