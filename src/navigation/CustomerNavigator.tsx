import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerParamList, CustomerTabParamList } from './types';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { SearchTruckScreen } from '../screens/customer/SearchTruckScreen';
import { TruckDetailsScreen } from '../screens/customer/TruckDetailsScreen';
import { BookingScreen } from '../screens/customer/BookingScreen';
import { PaymentScreen } from '../screens/customer/PaymentScreen';
import { TrackingScreen } from '../screens/customer/TrackingScreen';
import { BookingHistoryScreen } from '../screens/customer/BookingHistoryScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { COLORS, SHADOWS } from '../utils/theme';
import { View, Text, StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerParamList>();

const CustomerTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: ts.label,
        tabBarStyle: ts.bar,
        tabBarIcon: ({ focused }) => {
          let icon = '👤';
          if (route.name === 'Home') icon = '🏠';
          else if (route.name === 'Bookings') icon = '📋';
          else if (route.name === 'Profile') icon = '👤';
          return (
            <View style={ts.iconWrap}>
              <Text style={ts.icon}>{icon}</Text>
              {focused && <View style={ts.dot} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const CustomerNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CustomerTabs"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}
    >
      <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />
      <Stack.Screen name="SearchTrucks" component={SearchTruckScreen} />
      <Stack.Screen name="TruckDetails" component={TruckDetailsScreen} />
      <Stack.Screen name="BookingForm" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="LiveTracking" component={TrackingScreen} />
    </Stack.Navigator>
  );
};

const ts = StyleSheet.create({
  bar: {
    backgroundColor: '#0A192F',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 62,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 0,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  icon: {
    fontSize: 22,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
});
