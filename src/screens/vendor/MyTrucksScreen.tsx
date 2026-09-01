import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VendorParamList } from '../../navigation/types';
import { useTruckStore } from '../../store/truckStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { TruckCard } from '../../components/TruckCard';

type MyTrucksNavigationProp = NativeStackNavigationProp<VendorParamList>;

export const MyTrucksScreen: React.FC = () => {
  const navigation = useNavigation<MyTrucksNavigationProp>();
  const user = useAuthStore((state) => state.user);
  
  const allTrucks = useTruckStore((state) => state.trucks);
  const vendorId = user?.id || 'USR002';
  const trucks = React.useMemo(
    () => allTrucks.filter((t) => t.vendorId === vendorId),
    [allTrucks, vendorId]
  );

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="My Fleet Registry" />

      {/* Floating Add Button */}
      <View style={styles.headerRow}>
        <Text style={styles.countText}>{trucks.length} Vehicles Listed</Text>
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => (navigation as any).navigate('RegisterTruck')}
        >
          <Text style={styles.floatingBtnText}>+ REGISTER</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trucks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TruckCard
            truck={item}
            onPress={() => {
              // Edit or details
            }}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>🚛</Text>
            <Text style={styles.emptyTitle}>No trucks registered yet</Text>
            <Text style={styles.emptySub}>Register your trucks to start receiving cargo bookings.</Text>
            
            <TouchableOpacity
              style={styles.registerFirstBtn}
              onPress={() => (navigation as any).navigate('RegisterTruck')}
            >
              <Text style={styles.registerFirstBtnTxt}>Add First Vehicle</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  floatingBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    ...SHADOWS.sm,
  },
  floatingBtnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 12,
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
    paddingHorizontal: SPACING.xl,
  },
  registerFirstBtn: {
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 12,
  },
  registerFirstBtnTxt: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13.5,
  },
});
