import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { driverService } from '../../services/driverService';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { BookingCard } from '../../components/common/BookingCard';
import { Loading } from '../../components/common/Loading';

type DriverDashboardNavigationProp = NativeStackNavigationProp<DriverParamList>;

export const DriverDashboard: React.FC = () => {
  const navigation = useNavigation<DriverDashboardNavigationProp>();
  const user = useAuthStore((state) => state.user);
  
  const allBookings = useBookingStore((state) => state.bookings);
  const driverName = user?.name || 'Arun Kumar';
  const bookings = React.useMemo(
    () => allBookings.filter((b) => b.driverName === driverName),
    [allBookings, driverName]
  );

  const activeTrip = bookings.find(
    (b) => b.status !== 'TRIP_COMPLETED' && b.status !== 'CANCELLED'
  );

  const completedTripsCount = bookings.filter((b) => b.status === 'TRIP_COMPLETED').length;

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const navigateToActive = () => {
    if (!activeTrip) {
      Alert.alert('Info', 'No active trip assigned at this time.');
      return;
    }
    navigation.navigate('ActiveTrip', { bookingId: activeTrip.id });
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Driver Hub" />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </View>
      ) : (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} overScrollMode="never" bounces={true}>
        
        {/* Hero Banner */}
        <View style={styles.heroContainer}>
          <Image 
            source={require('../../../assets/truck_hero.png')}
            style={styles.heroImg}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.statusLabel}>DUTY STATUS</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusTxt}>Online & Available</Text>
            </View>
            <Text style={styles.driverGreeting}>Hello, {user?.name || 'Arun'}</Text>
            <Text style={styles.driverSub}>You have completed {completedTripsCount} deliveries.</Text>
          </View>
        </View>

        {/* Current Active Trip Card */}
        <Text style={styles.sectionHeader}>On-Duty Assignment</Text>
        
        {activeTrip ? (
          <View style={styles.activeTripCard}>
            <View style={COMMON_STYLES.flexRowBetween}>
              <Text style={styles.activeTitle}>Active Logistics Order</Text>
              <Text style={styles.activeId}>#{activeTrip.id}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.routeLabel}>Route Detail</Text>
            <Text style={styles.routeVal}>{activeTrip.pickupLocation.split(',')[0]} → {activeTrip.dropLocation.split(',')[0]}</Text>

            <Text style={styles.routeLabel}>Load Category</Text>
            <Text style={styles.routeVal}>{activeTrip.loadType} ({activeTrip.estimatedWeight})</Text>

            <TouchableOpacity style={styles.navigateBtn} onPress={navigateToActive}>
              <Text style={styles.navigateBtnTxt}>🚀 ENTER TRIP CONTROL CENTER</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💤</Text>
            <Text style={styles.emptyTitle}>You are off-duty</Text>
            <Text style={styles.emptySub}>No active cargo delivery jobs are assigned to you.</Text>
          </View>
        )}

        {/* Quick Navigations */}
        <Text style={styles.sectionHeader}>Menu</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCell}
            onPress={() => (navigation as any).navigate('Trips')}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuLabel}>Cargo Worklist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuCell}
            onPress={() => (navigation as any).navigate('History')}
          >
            <Text style={styles.menuIcon}>📜</Text>
            <Text style={styles.menuLabel}>Trip Logbook</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  heroContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  heroImg: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.75)', // Elegant Slate Semi-transparent overlay
  },
  heroContent: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  statusLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusTxt: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '700',
  },
  driverGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: SPACING.md,
  },
  driverSub: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  activeTripCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
    marginBottom: SPACING.xl,
  },
  activeTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  activeId: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  routeLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  routeVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  navigateBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  navigateBtnTxt: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  menuGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  menuCell: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  menuIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
});
