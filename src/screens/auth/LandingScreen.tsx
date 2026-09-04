import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthParamList } from '../../navigation/types';
import { useTruckStore } from '../../store/truckStore';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { TruckCard } from '../../components/common/TruckCard';
import { TruckType } from '../../types/truck';
import { UserRole } from '../../types/user';

type LandingScreenNavigationProp = NativeStackNavigationProp<AuthParamList, 'Landing'>;

const CATEGORIES: { id: TruckType; emoji: string }[] = [
  { id: 'Mini Truck', emoji: '🛻' },
  { id: 'Light Truck', emoji: '🚚' },
  { id: 'Medium Truck', emoji: '🚛' },
  { id: 'Heavy Truck', emoji: '🏗️' },
  { id: 'Container Truck', emoji: '📦' },
  { id: 'Refrigerated Truck', emoji: '❄️' },
  { id: 'Trailer', emoji: '🚜' },
];

export const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const allTrucks = useTruckStore((state) => state.trucks);
  const trucks = React.useMemo(() => allTrucks.filter((t) => t.status === 'APPROVED'), [allTrucks]);

  const [pickup, setPickup] = useState('Koyambedu, Chennai');
  const [drop, setDrop] = useState('Gandhipuram, Coimbatore');
  const [date, setDate] = useState('2026-09-04');

  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [intendedAction, setIntendedAction] = useState<string>('book a truck');

  const triggerProtectedAction = (actionName: string, _role: UserRole = 'CUSTOMER') => {
    setIntendedAction(actionName);
    setAuthModalVisible(true);
  };

  const handleSearch = () => {
    navigation.navigate('SearchTrucks', { pickup, drop, date });
  };

  const handleCategoryPress = (_category: TruckType) => {
    navigation.navigate('SearchTrucks', { pickup, drop, date });
  };

  const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ══════ FIXED TOP HEADER BAR ══════ */}
      <View style={[styles.fixedHeader, { paddingTop: topInset }]}>
        <View style={styles.headerInner}>
          <View style={styles.brandCol}>
            <Text style={styles.brandText}>TRUKORA</Text>
            <Text style={styles.brandTag}>Freight Marketplace</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.signInTxt}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Text style={styles.registerTxt}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.accentLine} />
      </View>

      {/* ══════ SCROLLABLE BODY ══════ */}
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={true}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeTxt}>⚡ INSTANT DISPATCH</Text>
          </View>
          <Text style={styles.heroTitle}>Book Verified Trucks.{'\n'}Anywhere in India.</Text>
          <Text style={styles.heroSub}>Transparent rates · Verified drivers · Live GPS tracking</Text>

          <View style={styles.chipRow}>
            <TouchableOpacity style={styles.bookChip} onPress={() => triggerProtectedAction('book cargo', 'CUSTOMER')} activeOpacity={0.85}>
              <Text style={styles.chipEmoji}>📦</Text>
              <Text style={styles.chipTxt}>Book Cargo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.vendChip} onPress={() => triggerProtectedAction('register vehicle', 'VENDOR')} activeOpacity={0.85}>
              <Text style={styles.chipEmoji}>🚛</Text>
              <Text style={styles.chipTxtW}>Register Fleet</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Search Available Fleet</Text>

          <View style={styles.routeRow}>
            <View style={styles.dotsCol}>
              <View style={styles.greenDot} />
              <View style={styles.dotLine} />
              <View style={styles.redSq} />
            </View>
            <View style={styles.inputsCol}>
              <View style={styles.inputBox}>
                <TextInput style={styles.inputTxt} value={pickup} onChangeText={setPickup} placeholder="Pickup Location" placeholderTextColor={COLORS.textLight} />
              </View>
              <View style={styles.inputBox}>
                <TextInput style={styles.inputTxt} value={drop} onChangeText={setDrop} placeholder="Drop Location" placeholderTextColor={COLORS.textLight} />
              </View>
            </View>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.dateIcon}>📅</Text>
            <TextInput style={styles.inputTxt} value={date} onChangeText={setDate} placeholder="Pickup Date" placeholderTextColor={COLORS.textLight} />
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
            <Text style={styles.searchBtnTxt}>Find Available Trucks →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
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

        {/* Trucks */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Verified Fleets</Text>
          {trucks.slice(0, 4).map((truck) => (
            <TruckCard
              key={truck.id}
              truck={truck}
              onPress={() => navigation.navigate('TruckDetails', { truckId: truck.id })}
              onBookNow={() => triggerProtectedAction(`book ${truck.brand} ${truck.truckNumber}`, 'CUSTOMER')}
            />
          ))}
        </View>
      </ScrollView>

      {/* Gated Auth Modal */}
      <Modal visible={authModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <View style={styles.modalHead}>
              <Text style={styles.modalIcon}>🔒</Text>
              <Text style={styles.modalTitle}>Sign In Required</Text>
            </View>
            <Text style={styles.modalSub}>Sign in with mobile OTP or register to {intendedAction}.</Text>

            <TouchableOpacity style={styles.modalPrimary} onPress={() => { setAuthModalVisible(false); navigation.navigate('Login'); }}>
              <Text style={styles.modalPrimaryTxt}>📱 Sign In with Mobile OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalSecondary} onPress={() => { setAuthModalVisible(false); navigation.navigate('Register'); }}>
              <Text style={styles.modalSecondaryTxt}>✨ Create New Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalClose} onPress={() => setAuthModalVisible(false)}>
              <Text style={styles.modalCloseTxt}>Continue Browsing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  fixedHeader: {
    backgroundColor: COLORS.secondaryDark,
    zIndex: 100,
    ...SHADOWS.md,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
  },
  brandCol: {},
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2.5,
  },
  brandTag: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginTop: -1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  signInBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  signInTxt: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
  registerBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  registerTxt: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
  accentLine: { height: 2, backgroundColor: COLORS.primary },
  scrollBody: { paddingTop: SPACING.md },
  heroBanner: {
    backgroundColor: COLORS.secondaryDark,
    marginHorizontal: SPACING.lg,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,101,0,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  heroBadgeTxt: { color: COLORS.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontSize: 20, fontWeight: '900', color: COLORS.white, lineHeight: 25 },
  heroSub: { fontSize: 12, color: '#94A3B8', marginTop: 4, marginBottom: SPACING.md },
  chipRow: { flexDirection: 'row', gap: 8 },
  bookChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 10, gap: 6,
  },
  vendChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 10, gap: 6,
  },
  chipEmoji: { fontSize: 16 },
  chipTxt: { fontSize: 12, fontWeight: '800', color: COLORS.secondary },
  chipTxtW: { fontSize: 12, fontWeight: '800', color: COLORS.white },
  searchCard: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: SPACING.lg,
    marginHorizontal: SPACING.lg, ...SHADOWS.lg, borderWidth: 1,
    borderColor: COLORS.border, marginBottom: SPACING.lg,
  },
  searchTitle: { fontSize: 17, fontWeight: '900', color: COLORS.secondary, marginBottom: SPACING.md },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  dotsCol: { width: 22, alignItems: 'center', marginRight: 8 },
  greenDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.success },
  dotLine: { width: 2, height: 32, backgroundColor: COLORS.border, marginVertical: 3 },
  redSq: { width: 11, height: 11, borderRadius: 3, backgroundColor: COLORS.danger },
  inputsCol: { flex: 1, gap: 6 },
  inputBox: {
    backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 12, paddingHorizontal: SPACING.md, height: 46, justifyContent: 'center',
  },
  inputTxt: { fontSize: 14, fontWeight: '700', color: COLORS.secondary, flex: 1 },
  dateBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background,
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12,
    paddingHorizontal: SPACING.md, height: 46, marginBottom: SPACING.md,
  },
  dateIcon: { fontSize: 14, marginRight: 6 },
  searchBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, height: 50,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.md,
  },
  searchBtnTxt: { color: COLORS.white, fontSize: 14.5, fontWeight: '900', letterSpacing: 0.4 },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xs },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.secondary, marginBottom: SPACING.md },
  catScroll: { paddingRight: SPACING.xl, gap: 8, marginBottom: SPACING.md },
  catCard: { width: 78, alignItems: 'center' },
  catCircle: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5,
    borderColor: COLORS.border, ...SHADOWS.sm,
  },
  catEmoji: { fontSize: 26 },
  catLabel: { fontSize: 11, fontWeight: '700', color: COLORS.secondary, marginTop: 5, textAlign: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(15,23,42,0.75)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: SPACING.xl, paddingBottom: 40,
  },
  modalHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  modalIcon: { fontSize: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.secondary },
  modalSub: { fontSize: 13.5, color: COLORS.textMuted, lineHeight: 18, marginBottom: SPACING.lg },
  modalPrimary: {
    backgroundColor: COLORS.primary, height: 50, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm,
  },
  modalPrimaryTxt: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  modalSecondary: {
    backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border,
    height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  modalSecondaryTxt: { color: COLORS.secondary, fontSize: 14, fontWeight: '800' },
  modalClose: { alignItems: 'center', paddingVertical: 4 },
  modalCloseTxt: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
});
