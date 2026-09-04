import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerParamList } from '../../navigation/types';
import { useTruckStore } from '../../store/truckStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { StatusBadge } from '../../components/common/StatusBadge';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type DetailsRouteProp = RouteProp<CustomerParamList, 'TruckDetails'>;
type DetailsNavigationProp = NativeStackNavigationProp<CustomerParamList>;

export const TruckDetailsScreen: React.FC = () => {
  const navigation = useNavigation<DetailsNavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const getTruckById = useTruckStore((state) => state.getTruckById);
  const truck = getTruckById(route.params.truckId);

  if (!truck) {
    return (
      <SafeAreaView style={COMMON_STYLES.safeArea}>
        <Header title="Truck Details" onBack={() => navigation.goBack()} />
        <View style={styles.errorView}>
          <Text style={styles.errorText}>Truck not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Removed unspash dependency
  const fallbackImg = require('../../../assets/truck_hero.png');

  const handleBookNow = () => {
    navigation.navigate('BookingForm', {
      truckId: truck.id,
      pickupLocation: 'Koyambedu, Chennai',
      dropLocation: 'Gandhipuram, Coimbatore',
      date: '2026-09-02',
      time: '10:00 AM'
    });
  };

  const mapRef = useRef<MapView>(null);

  // Focus map on open
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: 13.0827,
          longitude: 80.2707,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }, 1000);
      }, 500);
    }
  }, []);

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title={`${truck.brand} ${truck.model}`} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={fallbackImg} style={styles.image} resizeMode="cover" />

        <View style={styles.detailsCard}>
          <View style={COMMON_STYLES.flexRowBetween}>
            <View>
              <Text style={styles.plate}>{truck.truckNumber}</Text>
              <Text style={styles.model}>{truck.brand} {truck.model}</Text>
            </View>
            <StatusBadge status={truck.status} />
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>📦</Text>
              <Text style={styles.badgeText}>{truck.capacity} Max</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🚚</Text>
              <Text style={styles.badgeText}>{truck.truckType}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>⭐</Text>
              <Text style={styles.badgeText}>{truck.rating} Rating</Text>
            </View>
          </View>

          <View style={COMMON_STYLES.divider} />

          {/* Proper Google Map Location */}
          <View style={COMMON_STYLES.flexRowBetween}>
             <Text style={styles.sectionHeader}>Current Location</Text>
             <Text style={styles.locationCityTxt}>{truck.currentLocation}</Text>
          </View>
          
          <View style={styles.mapWrap}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 13.0827,
                longitude: 80.2707,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{ latitude: 13.0827, longitude: 80.2707 }}
                title={truck.brand}
                description={truck.currentLocation}
              >
                 <View style={styles.markerContainer}>
                    <Text style={styles.markerStr}>📍</Text>
                 </View>
              </Marker>
            </MapView>
            
            <View style={styles.mapOverlayHint}>
               <Text style={styles.mapOverlayTxt}>Live GPS Active</Text>
            </View>
          </View>

          <View style={COMMON_STYLES.divider} />

          {/* Specifications */}
          <Text style={styles.sectionHeader}>Specifications</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Manufacturing Year</Text>
              <Text style={styles.specValue}>{truck.year}</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Fuel Type</Text>
              <Text style={styles.specValue}>{truck.fuelType}</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Body Type</Text>
              <Text style={styles.specValue}>{truck.bodyType}</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Base Location</Text>
              <Text style={styles.specValue}>{truck.currentLocation}</Text>
            </View>
          </View>

          <View style={COMMON_STYLES.divider} />

          {/* Rental Rates */}
          <Text style={styles.sectionHeader}>Rental Rates</Text>
          <View style={styles.rateRow}>
            <View style={styles.rateCard}>
              <Text style={styles.rateTitle}>Price Per KM</Text>
              <Text style={styles.rateAmount}>₹{truck.pricePerKm}</Text>
              <Text style={styles.rateSub}>Ideal for short trips</Text>
            </View>
            <View style={styles.rateCard}>
              <Text style={styles.rateTitle}>Price Per Day</Text>
              <Text style={styles.rateAmount}>₹{truck.pricePerDay}</Text>
              <Text style={styles.rateSub}>Ideal for long trips</Text>
            </View>
          </View>

          <View style={COMMON_STYLES.divider} />

          {/* Driver details */}
          <Text style={styles.sectionHeader}>Driver Status</Text>
          <View style={COMMON_STYLES.flexRow}>
            <View style={[styles.indicator, { backgroundColor: truck.driverAvailable ? COLORS.success : COLORS.danger }]} />
            <Text style={styles.driverText}>
              {truck.driverAvailable
                ? 'Professional driver is certified & attached to this vehicle'
                : 'No driver currently assigned to this vehicle'}
            </Text>
          </View>
        </View>

        {/* Empty padding at bottom to avoid floating button overlay */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Booking Section */}
      <View style={styles.bookingFooter}>
        <View>
          <Text style={styles.footerLabel}>Base price starting at</Text>
          <Text style={styles.footerPrice}>₹{truck.pricePerDay} <Text style={styles.footerPer}>/ day</Text></Text>
        </View>

        {truck.status === 'APPROVED' ? (
          <TouchableOpacity style={styles.bookBtn} onPress={handleBookNow}>
            <Text style={styles.bookBtnText}>BOOK NOW</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.bookBtn, { backgroundColor: COLORS.border }]}>
            <Text style={[styles.bookBtnText, { color: COLORS.textMuted }]}>NOT AVAILABLE</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xl,
  },
  image: {
    height: 220,
    width: '100%',
  },
  detailsCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  plate: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  model: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    justifyContent: 'space-between',
  },
  specCell: {
    width: '48%',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  specLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  rateRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  rateCard: {
    flex: 1,
    backgroundColor: COLORS.infoLight,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 14,
    padding: SPACING.md,
    alignItems: 'center',
  },
  rateTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  rateAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A8A',
    marginVertical: 4,
  },
  rateSub: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: '600',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  driverText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    fontWeight: '600',
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
  bookingFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
    ...SHADOWS.lg,
  },
  footerLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  footerPer: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  bookBtnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  locationCityTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  mapWrap: {
    height: 180,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    padding: 2,
    backgroundColor: 'white',
    borderRadius: 20,
    ...SHADOWS.md,
  },
  markerStr: {
    fontSize: 22,
  },
  mapOverlayHint: {
     position: 'absolute',
     bottom: 10,
     right: 10,
     backgroundColor: 'rgba(255,255,255,0.9)',
     paddingHorizontal: 8,
     paddingVertical: 5,
     borderRadius: 12,
  },
  mapOverlayTxt: {
     fontSize: 10,
     fontWeight: '800',
     color: COLORS.success,
  }
});
