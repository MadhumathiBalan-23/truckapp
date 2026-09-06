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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
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
    }, 4000);

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
        edgePadding: { top: 120, right: 40, bottom: 280, left: 40 },
        animated: true,
      });
    }
  }, [driverIndex]);

  const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0;

  const etaMinutes = Math.max(2, (ROUTE_COORDS.length - 1 - driverIndex) * 15);
  const progressPct = Math.round((driverIndex / (ROUTE_COORDS.length - 1)) * 100);

  const statusConfig = {
    PICKING_UP: { label: 'Driver Heading to Pickup', color: COLORS.warning, icon: 'truck-fast' },
    IN_TRANSIT: { label: 'Shipment In Transit', color: COLORS.info, icon: 'map-marker-path' },
    ARRIVING: { label: 'Approaching Destination', color: COLORS.success, icon: 'check-all' },
  };
  const currentStatus = statusConfig[tripStatus];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Google Map overlay for live tracking */}
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
        {/* Route Polyline (dashed) */}
        <Polyline
          coordinates={ROUTE_COORDS}
          strokeWidth={4}
          strokeColor={COLORS.primary}
          lineDashPattern={[1]}
        />

        {/* Pickup Marker */}
        <Marker coordinate={pickup} title="Pickup" description={booking?.pickupLocation || "Pickup"}>
          <View style={styles.markerGreen}>
            <MaterialCommunityIcons name="store-marker-outline" size={16} color={COLORS.white} />
          </View>
        </Marker>

        {/* Drop Marker */}
        <Marker coordinate={drop} title="Drop Off" description={booking?.dropLocation || "Destination"}>
          <View style={styles.markerRed}>
            <MaterialCommunityIcons name="flag-checkered" size={16} color={COLORS.white} />
          </View>
        </Marker>

        {/* Driver Marker (Live) */}
        <Marker coordinate={driverPos} title="Driver" description="Active Freight">
          <View style={styles.driverMarker}>
            <MaterialCommunityIcons name="truck" size={18} color={COLORS.primary} />
          </View>
        </Marker>
      </MapView>

      {/* Uber-like Neat Top Bar Overlay */}
      <View style={[styles.floatingTopBar, { top: topInset + 12 }]}>
        <TouchableOpacity style={styles.floatBackBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.secondaryDark} />
        </TouchableOpacity>
        <View style={styles.floatCenter}>
          <Text style={styles.floatTitle}>Live Freight Tracking</Text>
        </View>
        <TouchableOpacity style={styles.floatActionBtn} activeOpacity={0.8}>
           <MaterialCommunityIcons name="share-variant" size={20} color={COLORS.secondaryDark} />
        </TouchableOpacity>
      </View>

      <View style={[styles.liveBadge, { top: topInset + 72 }]}>
         <View style={styles.liveRedDot} />
         <Text style={styles.liveTxt}>GPS ACTIVE</Text>
      </View>

      {/* Advanced Neat Bottom Action Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }] },
        ]}
      >
        <View style={styles.dragHandle} />

        {/* Live Status Bar */}
        <View style={[styles.statusRow, { borderColor: `${currentStatus.color}40`, backgroundColor: `${currentStatus.color}10` }]}>
          <MaterialCommunityIcons name={currentStatus.icon as any} size={28} color={currentStatus.color} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={[styles.statusLabel, { color: currentStatus.color }]}>{currentStatus.label}</Text>
            <Text style={styles.statusSub}>Arriving in {etaMinutes} mins • {progressPct}% Route Finished</Text>
          </View>
        </View>

        {/* Dynamic Progress Indicator */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPct}%`, backgroundColor: currentStatus.color }]} />
        </View>

        {/* Detailed Route Points */}
        <View style={styles.routeInfoBlock}>
          <View style={styles.routePoint}>
            <MaterialCommunityIcons name="circle-slice-8" size={12} color={COLORS.success} />
            <View style={styles.routeTextBlock}>
              <Text style={styles.routeLabel}>ORIGIN LOCATION</Text>
              <Text style={styles.routePlace} numberOfLines={1}>{booking?.pickupLocation || 'Anna Nagar, Chennai'}</Text>
            </View>
          </View>
          
          <View style={styles.routeConnectorBorder} />

          <View style={styles.routePoint}>
             <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.danger} style={{ marginLeft: -1 }} />
            <View style={styles.routeTextBlock}>
              <Text style={styles.routeLabel}>DESTINATION</Text>
              <Text style={styles.routePlace} numberOfLines={1}>{booking?.dropLocation || 'RS Puram, Coimbatore'}</Text>
            </View>
          </View>
        </View>

        <View style={COMMON_STYLES.divider} />

        {/* Driver Contact Context */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <MaterialCommunityIcons name="card-account-details-outline" size={24} color={COLORS.secondaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>{booking?.driverName || 'Verified Pilot'}</Text>
            <Text style={styles.driverSub}>Tata BharatBenz • {booking?.truckDetails?.truckNumber || 'TN 38 AB 1234'}</Text>
          </View>
          <View style={styles.contactActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons name="message-processing" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtnCta}>
              <MaterialCommunityIcons name="phone" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  map: { flex: 1 },
  markerGreen: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.success,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.md,
    borderWidth: 2, borderColor: '#fff'
  },
  markerRed: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.danger,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.md,
    borderWidth: 2, borderColor: '#fff'
  },
  driverMarker: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.lg,
    borderWidth: 2, borderColor: COLORS.primary,
  },
  floatingTopBar: {
    position: 'absolute', left: SPACING.lg, right: SPACING.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, borderRadius: 30,
    paddingHorizontal: SPACING.sm, height: 50, ...SHADOWS.lg,
  },
  floatBackBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  floatCenter: { alignItems: 'center' },
  floatTitle: { fontSize: 16, fontWeight: '800', color: COLORS.secondaryDark },
  floatActionBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  liveBadge: {
    position: 'absolute', right: SPACING.xl,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
    ...SHADOWS.md,
  },
  liveRedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  liveTxt: { fontSize: 10, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.lg, paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl,
    ...SHADOWS.lg,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  dragHandle: {
    width: 40, height: 5, backgroundColor: '#CBD5E1', borderRadius: 3,
    alignSelf: 'center', marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: SPACING.md,
    borderWidth: 1, marginBottom: SPACING.md,
  },
  statusLabel: { fontSize: 15, fontWeight: '800' },
  statusSub: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  progressBarBg: {
    height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginBottom: SPACING.lg, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 3 },
  routeInfoBlock: {
    paddingHorizontal: SPACING.xs,
  },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routeConnectorBorder: {
    width: 2, height: 20, backgroundColor: '#E2E8F0',
    marginLeft: 5, marginVertical: 4,
  },
  routeTextBlock: { flex: 1, marginTop: -2 },
  routeLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1 },
  routePlace: { fontSize: 15, fontWeight: '700', color: COLORS.secondaryDark, marginTop: 2 },
  driverCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: SPACING.sm,
  },
  driverAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  driverName: { fontSize: 15, fontWeight: '800', color: COLORS.secondaryDark },
  driverSub: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', marginTop: 1 },
  contactActions: {
    flexDirection: 'row', gap: 10,
  },
  iconBtn: {
     width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF7ED',
     borderWidth: 1, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'
  },
  iconBtnCta: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.md
  }
});
