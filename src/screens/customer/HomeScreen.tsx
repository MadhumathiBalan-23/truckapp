import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Image, SafeAreaView } from 'react-native';
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
  const [date, setDate] = useState('2026-09-02');
  const [time, setTime] = useState('10:00 AM');

  const handleSearch = () => {
    navigation.navigate('SearchTrucks', {
      pickup,
      drop,
      date,
      time,
    });
  };

  const handleCategoryPress = (category: TruckType) => {
    navigation.navigate('SearchTrucks', {
      pickup,
      drop,
      date,
      time,
    });
    // This will open search results, filters can be applied
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header segment */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Good Morning, {user?.name || 'User'}</Text>
            <View style={COMMON_STYLES.flexRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>Koyambedu Metro, Chennai</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => (navigation as any).navigate('Notifications')}
          >
            <Text style={styles.notificationEmoji}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Tagline */}
        <View style={styles.taglineCard}>
          <Text style={styles.taglineTitle}>Move anything. Anywhere. Instantly.</Text>
          <Text style={styles.taglineSub}>Affordable rental trucks at your fingertips.</Text>
        </View>

        {/* Search Panel */}
        <View style={styles.searchCard}>
          <Text style={styles.searchHeader}>Where do you need a truck?</Text>
          
          <View style={styles.inputField}>
            <Text style={styles.inputIcon}>🟢</Text>
            <TextInput
              style={styles.textInput}
              value={pickup}
              onChangeText={setPickup}
              placeholder="Pickup Location"
            />
          </View>

          <View style={styles.inputField}>
            <Text style={styles.inputIcon}>🔴</Text>
            <TextInput
              style={styles.textInput}
              value={drop}
              onChangeText={setDrop}
              placeholder="Drop Location"
            />
          </View>

          <View style={styles.timeRow}>
            <View style={[styles.inputField, { flex: 1, marginBottom: 0 }]}>
              <Text style={styles.inputIcon}>📅</Text>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={setDate}
                placeholder="Date"
              />
            </View>
            <View style={[styles.inputField, { flex: 1, marginBottom: 0 }]}>
              <Text style={styles.inputIcon}>⏰</Text>
              <TextInput
                style={styles.textInput}
                value={time}
                onChangeText={setTime}
                placeholder="Time"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Find Available Trucks</Text>
          </TouchableOpacity>
        </View>

        {/* Truck Categories Wheel */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Truck Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(cat.id)}
              >
                <View style={styles.categoryEmojiBg}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </View>
                <Text style={styles.categoryLabel} numberOfLines={1}>{cat.id}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Drivers Near You / Trucks Near You */}
        <View style={[styles.sectionContainer, { marginBottom: SPACING.xxl }]}>
          <Text style={styles.sectionTitle}>Available Trucks Near You</Text>
          {trucks.length === 0 ? (
            <Text style={styles.emptyText}>No registered trucks available at the moment.</Text>
          ) : (
            trucks.slice(0, 3).map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onPress={() => navigation.navigate('TruckDetails', { truckId: truck.id })}
                onBookNow={() =>
                  navigation.navigate('TruckDetails', { truckId: truck.id })
                }
              />
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greetingText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  locationPin: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
    position: 'relative',
  },
  notificationEmoji: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  taglineCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  taglineTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
  taglineSub: {
    color: COLORS.textLight,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  searchCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  searchHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.sm,
  },
  inputIcon: {
    fontSize: 14,
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  searchBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionContainer: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  categoryScroll: {
    paddingRight: SPACING.xl,
    gap: SPACING.sm,
  },
  categoryCard: {
    width: 80,
    alignItems: 'center',
  },
  categoryEmojiBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
    color: COLORS.textMuted,
    paddingVertical: SPACING.md,
  },
});
