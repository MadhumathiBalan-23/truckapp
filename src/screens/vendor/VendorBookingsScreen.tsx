import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Modal } from 'react-native';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { BookingCard } from '../../components/BookingCard';
import { Booking } from '../../types/booking';

type TabViewType = 'PENDING_JOBS' | 'ACTIVE_JOBS' | 'COMPLETED_JOBS';

export const VendorBookingsScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  const getVendorBookings = useBookingStore((state) => state.getVendorBookings);
  const updateBookingStatus = useBookingStore((state) => state.updateBookingStatus);
  const bookings = getVendorBookings(user?.id || 'USR002');

  const [activeTab, setActiveTab] = useState<TabViewType>('PENDING_JOBS');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [driverSelectVisible, setDriverSelectVisible] = useState(false);

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'PENDING_JOBS':
        return bookings.filter((b) => b.status === 'BOOKING_REQUESTED');
      case 'ACTIVE_JOBS':
        return bookings.filter(
          (b) =>
            b.status !== 'BOOKING_REQUESTED' &&
            b.status !== 'TRIP_COMPLETED' &&
            b.status !== 'CANCELLED'
        );
      case 'COMPLETED_JOBS':
        return bookings.filter((b) => b.status === 'TRIP_COMPLETED' || b.status === 'CANCELLED');
      default:
        return [];
    }
  };

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'VENDOR_ACCEPTED', 'Vendor accepted booking request.');
    Alert.alert('Success', 'Booking accepted! Now assign a driver to start the delivery.');
  };

  const handleAssignDriverClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDriverSelectVisible(true);
  };

  const handleSelectDriver = (driverName: string, driverMobile: string) => {
    if (!selectedBooking) return;

    useBookingStore.getState().assignDriverToBooking(selectedBooking.id, driverName, driverMobile);
    setDriverSelectVisible(false);
    setSelectedBooking(null);
    Alert.alert('Success', `Driver ${driverName} has been assigned to transport this booking.`);
  };

  const mockDrivers = [
    { name: 'Arun Kumar', mobile: '9944012345' },
    { name: 'Vijay Anand', mobile: '8833012345' },
    { name: 'Ganesh Moorthy', mobile: '7722012345' },
  ];

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Fleet Booking Registry" />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'PENDING_JOBS' ? styles.tabActive : null]}
          onPress={() => setActiveTab('PENDING_JOBS')}
        >
          <Text style={[styles.tabTxt, activeTab === 'PENDING_JOBS' ? styles.tabTxtActive : null]}>
            Pending ({bookings.filter((b) => b.status === 'BOOKING_REQUESTED').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ACTIVE_JOBS' ? styles.tabActive : null]}
          onPress={() => setActiveTab('ACTIVE_JOBS')}
        >
          <Text style={[styles.tabTxt, activeTab === 'ACTIVE_JOBS' ? styles.tabTxtActive : null]}>
            Ongoing ({bookings.filter((b) => b.status !== 'BOOKING_REQUESTED' && b.status !== 'TRIP_COMPLETED' && b.status !== 'CANCELLED').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'COMPLETED_JOBS' ? styles.tabActive : null]}
          onPress={() => setActiveTab('COMPLETED_JOBS')}
        >
          <Text style={[styles.tabTxt, activeTab === 'COMPLETED_JOBS' ? styles.tabTxtActive : null]}>
            History ({bookings.filter((b) => b.status === 'TRIP_COMPLETED' || b.status === 'CANCELLED').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={getFilteredBookings().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            actionText={
              item.status === 'BOOKING_REQUESTED'
                ? 'ACCEPT JOB'
                : item.status === 'VENDOR_ACCEPTED'
                ? 'ASSIGN DRIVER'
                : undefined
            }
            onActionPress={() => {
              if (item.status === 'BOOKING_REQUESTED') {
                handleAcceptBooking(item.id);
              } else if (item.status === 'VENDOR_ACCEPTED') {
                handleAssignDriverClick(item);
              }
            }}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySub}>No logistics requests in this category.</Text>
          </View>
        }
      />

      {/* Driver Assignment Modal */}
      <Modal visible={driverSelectVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Driver to Dispatch</Text>
            <Text style={styles.modalSub}>Select a verified driver for Booking #{selectedBooking?.id}</Text>

            {mockDrivers.map((driver) => (
              <TouchableOpacity
                key={driver.mobile}
                style={styles.driverItem}
                onPress={() => handleSelectDriver(driver.name, driver.mobile)}
              >
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarTxt}>🧑‍✈️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverMobile}>{driver.mobile}</Text>
                </View>
                <Text style={styles.selectArrow}>➔</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setDriverSelectVisible(false)}>
              <Text style={styles.closeBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabTxt: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabTxtActive: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: SPACING.lg,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  driverAvatarTxt: {
    fontSize: 18,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  driverMobile: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  selectArrow: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  closeBtn: {
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  closeBtnTxt: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
});
