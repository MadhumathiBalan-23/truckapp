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
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerParamList>();

const CustomerTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: ts.label,
        tabBarStyle: ts.bar,
        tabBarItemStyle: { flex: 1 },
        tabBarIcon: ({ focused }) => {
          let iconName: any = 'account-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'store' : 'store-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
          return (
            <View style={ts.iconWrap}>
              <MaterialCommunityIcons name={iconName} size={24} color={focused ? COLORS.primary : '#94A3B8'} />
            </View>
          );
        },
      })}
    >
      {/* Standard Tab Buttons */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* Hidden nested pages that still render the footer */}
      <Tab.Screen name="SearchTrucks" component={SearchTruckScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="TruckDetails" component={TruckDetailsScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="BookingForm" component={BookingScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="Payment" component={PaymentScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="LiveTracking" component={TrackingScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
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
    </Stack.Navigator>
  );
};

const ts = StyleSheet.create({
  bar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    height: Platform.OS === 'ios' ? 85 : 68,
    paddingBottom: Platform.OS === 'ios' ? 22 : 12,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
