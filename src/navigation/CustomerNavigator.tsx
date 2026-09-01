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
import { COLORS } from '../utils/theme';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerParamList>();

const CustomerTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color }) => {
          let label = '👤';
          if (route.name === 'Home') label = '🏠';
          if (route.name === 'Bookings') label = '📋';
          if (route.name === 'Profile') label = '👤';
          return <Text style={{ fontSize: 20, color }}>{label}</Text>;
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
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
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
