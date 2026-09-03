import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useTruckStore } from '../../store/truckStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { TruckCard } from '../../components/TruckCard';
import { TruckType } from '../../types/truck';

type HomeScreenNavigationProp = NativeStackNavigationProp<CustomerParamList>;

const CATEGORIES: { id: TruckType; emoji: string }[] = [
  { id: 'Mini Truck', emoji: '🛻' },
  { id: 'Light Truck', emoji: '🚚' },
  { id: 'Medium Truck', emoji: '🚛' },
  { id: 'Heavy Truck', emoji: '🏗️' },
  { id: 'Container Truck', emoji: '📦' },
  { id: 'Refrigerated Truck', emoji: '❄️' },
  { id: 'Trailer', emoji: '🚜' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useAuthStore((state) => state.user);
  const allTrucks = useTruckStore((state) => state.trucks);
  const trucks = React.useMemo(() => allTrucks.filter((t) => t.status === 'APPROVED'), [allTrucks]);

  const [pickup, setPickup] = useState('Koyambedu, Chennai');
  const [drop, setDrop] = useState('Gandhipuram, Coimbatore');
  const [date, setDate] = useState('2026-09-04');
  const [time, setTime] = useState('10:00 AM');

  const handleSearch = () => {
    navigation.navigate('SearchTrucks', { pickup, drop, date, time });
  };

  const handleCategoryPress = (category: TruckType) => {
    navigation.navigate('SearchTrucks', { pickup, drop, date, time });
  };

  const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0;

  return (
    <View style={styles.rootContainer}>
      <StatusBar style="light" />

      {/* ══════ FIXED TOP HEADER (Never Scrolls) ══════ */}
      <View style={[styles.fixedTopHeader, { paddingTop: topInset }]}>
        <View style={styles.headerContent}>
          <View style={styles.brandCol}>
            <Text style={styles.brandNameFixed}>TRUKORA</Text>
            <Text style={styles.brandSub}>Freight Network</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.locationChip}>
              <Text style={styles.locIcon}>📍</Text>
              <Text style={styles.locText} numberOfLines={1}>Chennai</Text>
            </View>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => (navigation as any).navigate('Notifications')}
              activeOpacity={0.8}
            >
              <Text style={styles.bellEmoji}>🔔</Text>
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.accentLine} />
      </View>

      {/* ══════ SCROLLABLE CONTENT ══════ */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={true}
      >
        {/* Greeting + Tagline */}
        <View style={styles.greetSection}>
          <Text style={styles.greetHi}>Hello, {user?.name || 'Customer'} 👋</Text>
          <Text style={styles.greetTagline}>Move anything. Anywhere. Instantly.</Text>
        </View>

        {/* Route Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Book Freight Ride</Text>

          <View style={styles.routeRow}>
            <View style={styles.dotsCol}>
              <View style={styles.greenDot} />
              <View style={styles.dotLine} />
              <View style={styles.redSquare} />
            </View>
            <View style={styles.inputsCol}>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={pickup}
                  onChangeText={setPickup}
                  placeholder="Pickup Location"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={drop}
                  onChangeText={setDrop}
                  placeholder="Drop Location"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            </View>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.fieldEmoji}>📅</Text>
              <TextInput style={styles.dateInput} value={date} onChangeText={setDate} placeholder="Date" placeholderTextColor={COLORS.textLight} />
            </View>
            <View style={styles.dateField}>
              <Text style={styles.fieldEmoji}>⏰</Text>
              <TextInput style={styles.dateInput} value={time} onChangeText={setTime} placeholder="Time" placeholderTextColor={COLORS.textLight} />
            </View>
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
            <Text style={styles.searchBtnTxt}>Find Available Trucks →</Text>
          </TouchableOpacity>
        </View>

        {/* Fleet Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fleet Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.catCard} onPress={() => handleCategoryPress(cat.id)} activeOpacity={0.8}>
                <View style={styles.catCircle}>
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                </View>
                <Text style={styles.catLabel} numberOfLines={1}>{cat.id}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Available Trucks */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Available Near You</Text>
          {trucks.length === 0 ? (
            <Text style={styles.emptyTxt}>No trucks available at the moment.</Text>
          ) : (
            trucks.slice(0, 4).map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onPress={() => navigation.navigate('TruckDetails', { truckId: truck.id })}
                onBookNow={() => navigation.navigate('TruckDetails', { truckId: truck.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fixedTopHeader: {
    backgroundColor: COLORS.secondaryDark,
    zIndex: 100,
    ...SHADOWS.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
  },
  brandCol: {},
  brandNameFixed: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2.5,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginTop: -1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  locIcon: { fontSize: 12 },
  locText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  bellEmoji: { fontSize: 16 },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  accentLine: {
    height: 2,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    paddingTop: SPACING.md,
  },
  greetSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  greetHi: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  greetTagline: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  searchTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: SPACING.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dotsCol: {
    width: 22,
    alignItems: 'center',
    marginRight: 8,
  },
  greenDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.success,
  },
  dotLine: {
    width: 2,
    height: 32,
    backgroundColor: COLORS.border,
    marginVertical: 3,
  },
  redSquare: {
    width: 11,
    height: 11,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
  inputsCol: {
    flex: 1,
    gap: 6,
  },
  inputBox: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 46,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  dateField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  fieldEmoji: {
    fontSize: 13,
    marginRight: 6,
  },
  dateInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  searchBtnTxt: {
    color: COLORS.white,
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: SPACING.md,
  },
  catScroll: {
    paddingRight: SPACING.xl,
    gap: 8,
    marginBottom: SPACING.md,
  },
  catCard: {
    width: 78,
    alignItems: 'center',
  },
  catCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  catEmoji: { fontSize: 26 },
  catLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: 5,
    textAlign: 'center',
  },
  emptyTxt: {
    fontStyle: 'italic',
    color: COLORS.textMuted,
    paddingVertical: SPACING.md,
  },
});
