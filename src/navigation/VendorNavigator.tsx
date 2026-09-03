import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VendorParamList, VendorTabParamList } from './types';
import { VendorDashboard } from '../screens/vendor/VendorDashboard';
import { MyTrucksScreen } from '../screens/vendor/MyTrucksScreen';
import { VendorBookingsScreen } from '../screens/vendor/VendorBookingsScreen';
import { EarningsScreen } from '../screens/vendor/EarningsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { RegisterTruckScreen } from '../screens/vendor/RegisterTruckScreen';
import { COLORS } from '../utils/theme';
import { View, Text, StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator<VendorTabParamList>();
const Stack = createNativeStackNavigator<VendorParamList>();

const VendorTabNavigator: React.FC = () => {
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
          let icon = '📊';
          if (route.name === 'Dashboard') icon = '📊';
          else if (route.name === 'MyTrucks') icon = '🚛';
          else if (route.name === 'Bookings') icon = '📋';
          else if (route.name === 'Earnings') icon = '💰';
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
      <Tab.Screen name="Dashboard" component={VendorDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="MyTrucks" component={MyTrucksScreen} options={{ tabBarLabel: 'Fleet' }} />
      <Tab.Screen name="Bookings" component={VendorBookingsScreen} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ tabBarLabel: 'Earn' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const VendorNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="VendorTabs"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}
    >
      <Stack.Screen name="VendorTabs" component={VendorTabNavigator} />
      <Stack.Screen name="RegisterTruck" component={RegisterTruckScreen} />
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
