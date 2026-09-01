import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VendorParamList, VendorTabParamList } from './types';
import { VendorDashboard } from '../screens/vendor/VendorDashboard';
import { MyTrucksScreen } from '../screens/vendor/MyTrucksScreen';
import { VendorBookingsScreen } from '../screens/vendor/VendorBookingsScreen';
import { EarningsScreen } from '../screens/vendor/EarningsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen'; // shared panel
import { RegisterTruckScreen } from '../screens/vendor/RegisterTruckScreen';
import { COLORS } from '../utils/theme';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<VendorTabParamList>();
const Stack = createNativeStackNavigator<VendorParamList>();

const VendorTabNavigator: React.FC = () => {
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
          let label = '🏢';
          if (route.name === 'Dashboard') label = '📊';
          if (route.name === 'MyTrucks') label = '🚛';
          if (route.name === 'Bookings') label = '📋';
          if (route.name === 'Earnings') label = '💵';
          if (route.name === 'Profile') label = '👤';
          return <Text style={{ fontSize: 20, color }}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={VendorDashboard} />
      <Tab.Screen name="MyTrucks" component={MyTrucksScreen} />
      <Tab.Screen name="Bookings" component={VendorBookingsScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const VendorNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="VendorTabs"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="VendorTabs" component={VendorTabNavigator} />
      <Stack.Screen name="RegisterTruck" component={RegisterTruckScreen} />
    </Stack.Navigator>
  );
};
