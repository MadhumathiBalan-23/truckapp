import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerParamList } from '../../navigation/types';
import { useTruckStore } from '../../store/truckStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { TruckCard } from '../../components/TruckCard';
import { Header } from '../../components/Header';
import { TruckType } from '../../types/truck';

type SearchRouteProp = RouteProp<CustomerParamList, 'SearchTrucks'>;
type SearchNavigationProp = NativeStackNavigationProp<CustomerParamList>;

export const SearchTruckScreen: React.FC = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const route = useRoute<SearchRouteProp>();
  const allTrucks = useTruckStore((state) => state.trucks);
  const trucks = React.useMemo(() => allTrucks.filter((t) => t.status === 'APPROVED'), [allTrucks]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [onlyDriver, setOnlyDriver] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'none'>('none');

  const filterAndSortTrucks = () => {
    let result = [...trucks];

    // Filter by search query (by brand, model, number, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.brand.toLowerCase().includes(q) ||
          t.model.toLowerCase().includes(q) ||
          t.truckNumber.toLowerCase().includes(q) ||
          t.currentLocation.toLowerCase().includes(q)
      );
    }

    // Filter by truck type
    if (selectedType) {
      result = result.filter((t) => t.truckType === selectedType);
    }

    // Filter by driver availability
    if (onlyDriver) {
      result = result.filter((t) => t.driverAvailable);
    }

    // Sort outputs
    if (sortBy === 'price') {
      result.sort((a, b) => a.pricePerKm - b.pricePerKm);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const filteredTrucks = filterAndSortTrucks();

  const categories: TruckType[] = [
    'Mini Truck',
    'Light Truck',
    'Medium Truck',
    'Heavy Truck',
    'Container Truck',
    'Refrigerated Truck',
    'Trailer',
  ];

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Search Trucks" onBack={() => navigation.goBack()} />

      <View style={styles.filterSection}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by brand, number, or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>❌</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          <TouchableOpacity
            style={[styles.chip, onlyDriver ? styles.chipActive : null]}
            onPress={() => setOnlyDriver(!onlyDriver)}
          >
            <Text style={[styles.chipText, onlyDriver ? styles.chipTextActive : null]}>
              🧑‍✈️ Driver Available
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, sortBy === 'price' ? styles.chipActive : null]}
            onPress={() => setSortBy(sortBy === 'price' ? 'none' : 'price')}
          >
            <Text style={[styles.chipText, sortBy === 'price' ? styles.chipTextActive : null]}>
              💰 Price: Low to High
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, sortBy === 'rating' ? styles.chipActive : null]}
            onPress={() => setSortBy(sortBy === 'rating' ? 'none' : 'rating')}
          >
            <Text style={[styles.chipText, sortBy === 'rating' ? styles.chipTextActive : null]}>
              ⭐ Rating: High to Low
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Categories Chips Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            style={[styles.categoryChip, selectedType === null ? styles.categoryChipActive : null]}
            onPress={() => setSelectedType(null)}
          >
            <Text style={[styles.categoryTxt, selectedType === null ? styles.categoryTxtActive : null]}>
              All Categories
            </Text>
          </TouchableOpacity>
          {categories.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.categoryChip, selectedType === type ? styles.categoryChipActive : null]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[styles.categoryTxt, selectedType === type ? styles.categoryTxtActive : null]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredTrucks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TruckCard
            truck={item}
            onPress={() => navigation.navigate('TruckDetails', { truckId: item.id })}
            onBookNow={() => {
              // Extract values from home screen inputs or fall back to default
              const pStr = route.params?.pickup || 'Koyambedu, Chennai';
              const dStr = route.params?.drop || 'Gandhipuram, Coimbatore';
              const dt = route.params?.date || '2026-09-02';
              const tm = route.params?.time || '10:00 AM';

              navigation.navigate('BookingForm', {
                truckId: item.id,
                pickupLocation: pStr,
                dropLocation: dStr,
                date: dt,
                time: tm,
              });
            }}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>🚐</Text>
            <Text style={styles.emptyTitle}>No matching trucks found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters or search keywords</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  clearIcon: {
    fontSize: 12,
    marginLeft: 6,
  },
  chipScroll: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  chipTextActive: {
    color: COLORS.primary,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
  },
  categoryChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: COLORS.secondary,
  },
  categoryTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  categoryTxtActive: {
    color: COLORS.white,
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
    paddingHorizontal: SPACING.xxl,
  },
});
