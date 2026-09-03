import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar as RNStatusBar,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { useBookingStore } from '../../store/bookingStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Simulated route coordinates (Chennai → Coimbatore route waypoints)
const ROUTE_COORDS = [
  { latitude: 13.0827, longitude: 80.2707 }, // Chennai
  { latitude: 12.9716, longitude: 80.1514 },
  { latitude: 12.8231, longitude: 79.6923 },
  { latitude: 12.5268, longitude: 78.2141 },
  { latitude: 11.6643, longitude: 78.1460 },
  { latitude: 11.3410, longitude: 77.7172 },
  { latitude: 11.0168, longitude: 76.9558 }, // Coimbatore
];

export const TrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bookingId = (route.params as any)?.bookingId;
  const booking = useBookingStore((state) =>
    state.bookings.find((b) => b.id === bookingId)
  );

  const [driverIndex, setDriverIndex] = useState(0);
  const [tripStatus, setTripStatus] = useState<'PICKING_UP' | 'IN_TRANSIT' | 'ARRIVING'>('PICKING_UP');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);

  const pickup = ROUTE_COORDS[0];
  const drop = ROUTE_COORDS[ROUTE_COORDS.length - 1];
  const driverPos = ROUTE_COORDS[driverIndex];

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverIndex((prev) => {
        const next = prev + 1;
        if (next >= ROUTE_COORDS.length - 1) {
          setTripStatus('ARRIVING');
          clearInterval(interval);
          return ROUTE_COORDS.length - 1;
        }
        if (next > 1) setTripStatus('IN_TRANSIT');
        return next;
      });
    }, 3000);

    // Animate bottom sheet up
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();

    return () => clearInterval(interval);
  }, []);

  // Auto-fit map to markers
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(ROUTE_COORDS, {
        edgePadding: { top: 80, right: 40, bottom: 260, left: 40 },
        animated: true,
      });
    }
  }, [driverIndex]);

  const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0;

  const etaMinutes = Math.max(5, (ROUTE_COORDS.length - 1 - driverIndex) * 12);
  const progressPct = Math.round((driverIndex / (ROUTE_COORDS.length - 1)) * 100);

  const statusConfig = {
    PICKING_UP: { label: 'Driver Heading to Pickup', color: COLORS.warning, emoji: '🚛' },
    IN_TRANSIT: { label: 'Shipment In Transit', color: COLORS.info, emoji: '📦' },
    ARRIVING: { label: 'Arriving at Destination', color: COLORS.success, emoji: '✅' },
  };
  const currentStatus = statusConfig[tripStatus];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Google Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 12.0,
          longitude: 79.0,
          latitudeDelta: 4,
          longitudeDelta: 4,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Route Polyline */}
        <Polyline
          coordinates={ROUTE_COORDS}
          strokeWidth={4}
          strokeColor={COLORS.primary}
        />

        {/* Pickup Marker */}
        <Marker coordinate={pickup} title="Pickup" description="Koyambedu, Chennai">
          <View style={styles.markerGreen}>
            <Text style={styles.markerTxt}>P</Text>
          </View>
        </Marker>

        {/* Drop Marker */}
        <Marker coordinate={drop} title="Drop" description="Gandhipuram, Coimbatore">
          <View style={styles.markerRed}>
            <Text style={styles.markerTxt}>D</Text>
          </View>
        </Marker>

        {/* Driver Marker (Live) */}
        <Marker coordinate={driverPos} title="Driver" description="Live Location">
          <View style={styles.driverMarker}>
            <Text style={styles.driverMarkerTxt}>🚛</Text>
          </View>
        </Marker>
      </MapView>

      {/* Fixed Top Bar Overlay */}
      <View style={[styles.floatingTopBar, { top: topInset + 8 }]}>
        <TouchableOpacity style={styles.floatBackBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.floatBackTxt}>‹</Text>
        </TouchableOpacity>
        <View style={styles.floatCenter}>
          <Text style={styles.floatBrand}>TRUKORA</Text>
          <Text style={styles.floatTitle}>Live Tracking</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveRedDot} />
          <Text style={styles.liveTxt}>LIVE</Text>
        </View>
      </View>

      {/* Bottom Trip Details Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }] },
        ]}
      >
        {/* Status Bar */}
        <View style={[styles.statusRow, { borderColor: currentStatus.color }]}>
          <Text style={styles.statusEmoji}>{currentStatus.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusLabel, { color: currentStatus.color }]}>{currentStatus.label}</Text>
            <Text style={styles.statusSub}>ETA: {etaMinutes} mins • {progressPct}% completed</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPct}%`, backgroundColor: currentStatus.color }]} />
        </View>

        {/* Route Info */}
        <View style={styles.routeInfoRow}>
          <View style={styles.routePoint}>
            <View style={styles.routeGreenDot} />
            <View>
              <Text style={styles.routeLabel}>PICKUP</Text>
              <Text style={styles.routePlace} numberOfLines={1}>{booking?.pickupLocation || 'Koyambedu, Chennai'}</Text>
            </View>
          </View>
          <View style={styles.routeArrow}><Text style={{ color: COLORS.textLight }}>→</Text></View>
          <View style={styles.routePoint}>
            <View style={styles.routeRedDot} />
            <View>
              <Text style={styles.routeLabel}>DROP</Text>
              <Text style={styles.routePlace} numberOfLines={1}>{booking?.dropLocation || 'Gandhipuram, Coimbatore'}</Text>
            </View>
          </View>
        </View>

        {/* Driver Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarTxt}>🧑‍✈️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>Rajesh Kumar</Text>
            <Text style={styles.driverSub}>TN 38 AB 1234 • Tata 407</Text>
          </View>
          <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
            <Text style={styles.callBtnTxt}>📞 Call</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  map: { flex: 1 },
  markerGreen: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.success,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.md,
    borderWidth: 2, borderColor: COLORS.white,
  },
  markerRed: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.danger,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.md,
    borderWidth: 2, borderColor: COLORS.white,
  },
  markerTxt: { color: COLORS.white, fontSize: 13, fontWeight: '900' },
  driverMarker: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.secondaryDark,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.lg,
    borderWidth: 2, borderColor: COLORS.primary,
  },
  driverMarkerTxt: { fontSize: 22 },
  floatingTopBar: {
    position: 'absolute', left: SPACING.lg, right: SPACING.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.secondaryDark, borderRadius: 16,
    paddingHorizontal: SPACING.md, height: 48, ...SHADOWS.lg,
  },
  floatBackBtn: {
    width: 30, height: 30, borderRadius: 10, backgroundColor: '#1E293B',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155',
  },
  floatBackTxt: { fontSize: 20, fontWeight: '600', color: COLORS.white, marginTop: -2 },
  floatCenter: { alignItems: 'center' },
  floatBrand: { fontSize: 8, fontWeight: '900', color: COLORS.primary, letterSpacing: 2.5 },
  floatTitle: { fontSize: 13, fontWeight: '700', color: COLORS.white, marginTop: -1 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(239,68,68,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)',
  },
  liveRedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveTxt: { fontSize: 10, fontWeight: '900', color: '#EF4444' },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: SPACING.lg, paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
    ...SHADOWS.lg,
  },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.background, borderRadius: 14, padding: SPACING.md,
    borderWidth: 1.5, marginBottom: SPACING.sm,
  },
  statusEmoji: { fontSize: 24 },
  statusLabel: { fontSize: 14, fontWeight: '800' },
  statusSub: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 1 },
  progressBarBg: {
    height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: SPACING.md, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 3 },
  routeInfoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  routeGreenDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success },
  routeRedDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.danger },
  routeArrow: { paddingHorizontal: 6 },
  routeLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.5 },
  routePlace: { fontSize: 12, fontWeight: '700', color: COLORS.secondary },
  driverCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.secondaryDark, borderRadius: 14, padding: SPACING.md,
  },
  driverAvatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#1E293B',
    justifyContent: 'center', alignItems: 'center',
  },
  driverAvatarTxt: { fontSize: 20 },
  driverName: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  driverSub: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  callBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  callBtnTxt: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
});
