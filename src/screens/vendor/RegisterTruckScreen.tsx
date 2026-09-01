import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VendorParamList } from '../../navigation/types';
import { useTruckStore } from '../../store/truckStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { TruckType } from '../../types/truck';

type RegisterTruckNavigationProp = NativeStackNavigationProp<VendorParamList>;

export const RegisterTruckScreen: React.FC = () => {
  const navigation = useNavigation<RegisterTruckNavigationProp>();
  const addTruck = useTruckStore((state) => state.addTruck);
  const user = useAuthStore((state) => state.user);

  const [truckNumber, setTruckNumber] = useState('');
  const [truckType, setTruckType] = useState<TruckType>('Mini Truck');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [capacity, setCapacity] = useState('1.5 Tons');
  const [fuelType, setFuelType] = useState<'Diesel' | 'Petrol' | 'CNG' | 'EV'>('Diesel');
  const [bodyType, setBodyType] = useState<'Open' | 'Closed' | 'Container' | 'Flatbed'>('Container');
  const [pricePerKm, setPricePerKm] = useState('18');
  const [pricePerDay, setPricePerDay] = useState('2500');
  const [currentLocation, setCurrentLocation] = useState('Koyambedu, Chennai');
  const [driverAvailable, setDriverAvailable] = useState(true);

  // Document attachments state
  const [rcBookUploaded, setRcBookUploaded] = useState(false);
  const [insuranceUploaded, setInsuranceUploaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!truckNumber.trim()) return Alert.alert('Error', 'Truck Number is required');
    if (!brand.trim()) return Alert.alert('Error', 'Brand is required');
    if (!model.trim()) return Alert.alert('Error', 'Model is required');
    if (!pricePerKm.trim()) return Alert.alert('Error', 'Price per KM is required');
    if (!pricePerDay.trim()) return Alert.alert('Error', 'Price per Day is required');
    
    if (!rcBookUploaded || !insuranceUploaded) {
      return Alert.alert('Verification Alert', 'Please upload RC Book and Insurance documents for verification.');
    }

    setLoading(true);

    try {
      const success = await addTruck({
        vendorId: user?.id || 'USR002',
        truckNumber,
        truckType,
        brand,
        model,
        year: parseInt(year) || 2024,
        capacity,
        fuelType,
        bodyType,
        pricePerKm: parseFloat(pricePerKm) || 15,
        pricePerDay: parseFloat(pricePerDay) || 2000,
        currentLocation,
        driverAvailable,
        documents: {
          rcBook: 'uploads/rc_book_sim.pdf',
          insurance: 'uploads/insurance_sim.pdf',
          images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'],
        },
      });

      setLoading(false);

      if (success) {
        Alert.alert(
          'Registration Success',
          'Your truck has been submitted. It will appear on search lists once approved by TruckGo admin.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', 'Registration request failed. Please check credentials.');
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err?.message || 'Server error occurred.');
    }
  };

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
      <Header title="Fleet Registration" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* Core Specs */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>VEHICLE SPECIFICATIONS</Text>
          
          <Input
            label="Registration plate number"
            value={truckNumber}
            onChangeText={setTruckNumber}
            placeholder="e.g. TN 38 AB 1234"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Manufacturer Brand" value={brand} onChangeText={setBrand} placeholder="Mahindra" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Model Name" value={model} onChangeText={setModel} placeholder="Bolero Pik-up" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Year" value={year} onChangeText={setYear} keyboardType="numeric" placeholder="2024" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Gross Capacity" value={capacity} onChangeText={setCapacity} placeholder="1.7 Ton" />
            </View>
          </View>
        </View>

        {/* Truck Type Selection */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>FLEET CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {categories.map((type) => {
              const isSel = truckType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, isSel ? styles.typeChipActive : null]}
                  onPress={() => setTruckType(type)}
                >
                  <Text style={[styles.typeChipTxt, isSel ? styles.typeChipTxtActive : null]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Rates & Base location */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>COMMERCIAL DETAILS</Text>
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Price Per KM (₹)" value={pricePerKm} onChangeText={setPricePerKm} keyboardType="numeric" placeholder="18" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Price Per Day (₹)" value={pricePerDay} onChangeText={setPricePerDay} keyboardType="numeric" placeholder="2500" />
            </View>
          </View>

          <Input
            label="Base / Current Location"
            value={currentLocation}
            onChangeText={setCurrentLocation}
            placeholder="Koyambedu, Chennai"
          />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Assign Driver</Text>
              <Text style={styles.switchDesc}>Driver included with vehicle rental</Text>
            </View>
            <Switch
              value={driverAvailable}
              onValueChange={setDriverAvailable}
              trackColor={{ false: '#767577', true: COLORS.primaryLight }}
              thumbColor={driverAvailable ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Document verification */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.cardHeader}>COMPLIANCE DOCUMENTS</Text>
          <Text style={styles.docDesc}>Upload scanned files to verify vehicle legitimacy.</Text>

          <View style={styles.docRow}>
            <TouchableOpacity
              style={[styles.uploadCard, rcBookUploaded ? styles.uploadCardDone : null]}
              onPress={() => setRcBookUploaded(true)}
            >
              <Text style={styles.uploadIcon}>{rcBookUploaded ? '✅' : '📄'}</Text>
              <Text style={styles.uploadText}>{rcBookUploaded ? 'RC Verified' : 'Upload RC Book'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadCard, insuranceUploaded ? styles.uploadCardDone : null]}
              onPress={() => setInsuranceUploaded(true)}
            >
              <Text style={styles.uploadIcon}>{insuranceUploaded ? '✅' : '🛡️'}</Text>
              <Text style={styles.uploadText}>{insuranceUploaded ? 'Insurance Uploaded' : 'Upload Insurance'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="SUBMIT FLEET FOR VERIFICATION"
          onPress={handleRegister}
          loading={loading}
          style={styles.submitBtn}
        />
        
        {/* Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '705',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  horizontalScroll: {
    gap: SPACING.xs,
    paddingRight: SPACING.lg,
  },
  typeChip: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 8,
  },
  typeChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  typeChipTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  typeChipTxtActive: {
    color: COLORS.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  switchLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  switchDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  docDesc: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  docRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  uploadCard: {
    flex: 1,
    height: 90,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  uploadCardDone: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
    borderStyle: 'solid',
  },
  uploadIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  uploadText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    marginVertical: SPACING.md,
  },
});
