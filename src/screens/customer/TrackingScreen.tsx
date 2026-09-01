import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerParamList } from '../../navigation/types';
import { useBookingStore } from '../../store/bookingStore';
import { driverService } from '../../services/driverService';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';

type TrackingRouteProp = RouteProp<CustomerParamList, 'LiveTracking'>;
type TrackingNavigationProp = NativeStackNavigationProp<CustomerParamList>;

export const TrackingScreen: React.FC = () => {
  const navigation = useNavigation<TrackingNavigationProp>();
  const route = useRoute<TrackingRouteProp>();
  
  const getBookingById = useBookingStore((state) => state.getBookingById);
  const liveCoordinates = useBookingStore((state) => state.liveCoordinates);
  const booking = getBookingById(route.params.bookingId);

  const [simProgress, setSimProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const coords = booking ? liveCoordinates[booking.id] : null;

  // Simulate movement over time if simulation active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating && booking) {
      interval = setInterval(() => {
        setSimProgress((prev) => {
          const next = prev + 0.05;
          if (next >= 1.0) {
            setIsSimulating(false);
            driverService.updateTripStatus(booking.id, 'REACHED_DESTINATION', 'Driver reached destination.');
            return 1.0;
          }
          driverService.simulateMovement(booking.id, next);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, booking]);

  if (!booking) {
    return (
      <SafeAreaView style={COMMON_STYLES.safeArea}>
        <Header title="Track Truck" onBack={() => navigation.goBack()} />
        <View style={styles.errorView}><Text style={styles.errorText}>Booking not found</Text></View>
      </SafeAreaView>
    );
  }

  const handleCallDriver = () => {
    if (!booking.driverMobile) {
      Alert.alert('Info', 'Driver is not yet assigned to this shipment.');
      return;
    }
    Alert.alert('Calling Driver', `Dialing ${booking.driverName} (${booking.driverMobile})...`);
  };

  const handleMessageDriver = () => {
    if (!booking.driverMobile) {
      Alert.alert('Info', 'Driver is not yet assigned.');
      return;
    }
    Alert.alert('Message Sent', `SMS sent to ${booking.driverName}`);
  };

  const toggleSimulation = () => {
    if (booking.status === 'TRIP_COMPLETED') {
      Alert.alert('Finished', 'Trip is already completed.');
      return;
    }
    if (booking.status === 'BOOKING_REQUESTED') {
      Alert.alert('Simulation Note', 'Booking is still in REQUESTED state. Please accept and assign driver from Vendor Dashboard first!');
      return;
    }
    setSimProgress(0);
    setIsSimulating(!isSimulating);
  };

  // Timeline nodes helper
  const TIMELINE_STATES = [
    { key: 'BOOKING_REQUESTED', label: 'Requested' },
    { key: 'VENDOR_ACCEPTED', label: 'Accepted' },
    { key: 'DRIVER_ASSIGNED', label: 'Assigned' },
    { key: 'DRIVER_REACHED_PICKUP', label: 'Arrived' },
    { key: 'LOADING_STARTED', label: 'Loading' },
    { key: 'TRUCK_IN_TRANSIT', label: 'Transit' },
    { key: 'REACHED_DESTINATION', label: 'Arrived Drop' },
    { key: 'TRIP_COMPLETED', label: 'Completed' },
  ];

  const getTimelineIndex = (status: string) => {
    return TIMELINE_STATES.findIndex((state) => state.key === status);
  };

  const currentIdx = getTimelineIndex(booking.status);

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Live Tracking" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Dynamic Route Canvas Simulation */}
        <View style={styles.mapCard}>
          <Text style={styles.mapHeader}>ROUTE TRAFFIC RADAR</Text>
          
          <View style={styles.radarContainer}>
            {/* Start Node */}
            <View style={[styles.radarPin, { left: 40, top: 120 }]}>
              <View style={[styles.pinDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.pinLabel}>Pickup</Text>
            </View>

            {/* End Node */}
            <View style={[styles.radarPin, { right: 40, top: 40 }]}>
              <View style={[styles.pinDot, { backgroundColor: COLORS.info }]} />
              <Text style={styles.pinLabel}>Drop</Text>
            </View>

            {/* Simulated Road Path */}
            <View style={styles.roadPath} />

            {/* Animated Moving Truck Indicator */}
            {booking.status === 'TRIP_COMPLETED' ? (
              <View style={[styles.truckMarkerContainer, { right: 40, top: 40 }]}>
                <Text style={styles.truckEmojiMarker}>🚩</Text>
              </View>
            ) : booking.status === 'TRUCK_IN_TRANSIT' || isSimulating ? (
              <View
                style={[
                  styles.truckMarkerContainer,
                  {
                    left: 40 + (250 - 40) * simProgress,
                    top: 120 + (40 - 120) * simProgress - 15,
                  },
                ]}
              >
                <Text style={styles.truckEmojiMarker}>🚚</Text>
              </View>
            ) : currentIdx >= 3 ? (
              <View style={[styles.truckMarkerContainer, { left: 40, top: 120 }]}>
                <Text style={styles.truckEmojiMarker}>🚚</Text>
              </View>
            ) : null}

            {/* Inner HUD info */}
            <View style={styles.hudOverlay}>
              <Text style={styles.hudCoordinates}>
                Lat: {coords?.latitude.toFixed(4) || '13.0727'} • Lng:{' '}
                {coords?.longitude.toFixed(4) || '80.2007'}
              </Text>
              <Text style={styles.hudEta}>
                {booking.status === 'TRIP_COMPLETED'
                  ? 'Delivered'
                  : booking.status === 'TRUCK_IN_TRANSIT'
                  ? 'ETA: 15 mins'
                  : 'ETA: Pending'}
              </Text>
            </View>
          </View>

          {/* Simulator actions */}
          {booking.status !== 'TRIP_COMPLETED' && booking.status !== 'BOOKING_REQUESTED' && (
            <TouchableOpacity
              style={[styles.simBtn, isSimulating ? { backgroundColor: COLORS.warning } : null]}
              onPress={toggleSimulation}
            >
              <Text style={styles.simBtnTxt}>
                {isSimulating ? '⏸️ PAUSE ROUTE SIMULATOR' : '▶️ PLAY ROUTE SIMULATOR (120 KM)'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dispatch Driver Info Card */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>DISPATCH & VEHICLE INFO</Text>
          
          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>🧑‍✈️</Text>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{booking.driverName || 'Awaiting Driver Assignment'}</Text>
              <Text style={styles.driverSub}>
                {booking.driverName ? 'Verified Professional' : 'Vendor is arranging driver'}
              </Text>
            </View>

            <StatusBadge status={booking.status} />
          </View>

          <View style={styles.vehicleSection}>
            <Text style={styles.vehicleName}>
              Vehicle: {booking.truckDetails.brand} {booking.truckDetails.model}
            </Text>
            <Text style={styles.vehiclePlate}>Plate No: {booking.truckDetails.truckNumber}</Text>
          </View>

          {booking.driverName && (
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.contactBtn} onPress={handleCallDriver}>
                <Text style={styles.contactBtnTxt}>📞 CALL DRIVER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactBtn, styles.contactBtnOutline]} onPress={handleMessageDriver}>
                <Text style={[styles.contactBtnTxt, { color: COLORS.secondary }]}>💬 CHAT</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Timeline Progress Tracker */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>SHIPMENT TIMELINE</Text>
          
          <View style={styles.timelineContainer}>
            {TIMELINE_STATES.map((state, index) => {
              const done = index <= currentIdx;
              const isCurrent = index === currentIdx;

              return (
                <View key={state.key} style={styles.timelineNode}>
                  <View style={styles.timelineIndicators}>
                    <View
                      style={[
                        styles.indicatorDot,
                        done ? styles.indicatorDotDone : null,
                        isCurrent ? styles.indicatorDotCurrent : null,
                      ]}
                    />
                    {index < TIMELINE_STATES.length - 1 && (
                      <View style={[styles.indicatorLine, index < currentIdx ? styles.indicatorLineDone : null]} />
                    )}
                  </View>
                  
                  <View style={styles.timelineDetails}>
                    <Text style={[styles.timelineLabel, done ? styles.timelineLabelDone : null]}>
                      {state.label}
                    </Text>
                    {isCurrent && (
                      <Text style={styles.timelineNote}>
                        {booking.statusTimeline[booking.statusTimeline.length - 1]?.note || 'Updated'}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
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
  scrollContainer: {
    padding: SPACING.lg,
  },
  mapCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  mapHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  radarContainer: {
    height: 200,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    position: 'relative',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  radarPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  pinLabel: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roadPath: {
    position: 'absolute',
    top: 122,
    left: 45,
    width: 250,
    height: 3,
    backgroundColor: '#475569',
    transform: [{ rotate: '-17.5deg' }], // rotate to match nodes
    transformOrigin: 'left top',
  },
  truckMarkerContainer: {
    position: 'absolute',
    zIndex: 20,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  truckEmojiMarker: {
    fontSize: 13,
  },
  hudOverlay: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  hudCoordinates: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  hudEta: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  simBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simBtnTxt: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  driverName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  driverSub: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  vehicleSection: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 10,
  },
  vehicleName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  vehiclePlate: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  contactBtnTxt: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  timelineContainer: {
    paddingLeft: SPACING.xs,
  },
  timelineNode: {
    flexDirection: 'row',
  },
  timelineIndicators: {
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CBD5E1', // gray-300
    zIndex: 10,
  },
  indicatorDotDone: {
    backgroundColor: COLORS.success,
  },
  indicatorDotCurrent: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.25 }],
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  indicatorLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  indicatorLineDone: {
    backgroundColor: COLORS.success,
  },
  timelineDetails: {
    flex: 1,
    paddingBottom: 22,
    marginTop: -2,
  },
  timelineLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  timelineLabelDone: {
    color: COLORS.text,
  },
  timelineNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
});
