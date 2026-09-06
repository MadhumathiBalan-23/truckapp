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
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<VendorTabParamList>();
const Stack = createNativeStackNavigator<VendorParamList>();

const VendorTabNavigator: React.FC = () => {
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
          let iconName: any = 'chart-bar';
          if (route.name === 'Dashboard') iconName = 'chart-box-outline';
          else if (route.name === 'MyTrucks') iconName = focused ? 'truck' : 'truck-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'store' : 'store-outline';
          else if (route.name === 'Earnings') iconName = focused ? 'cash-multiple' : 'cash';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
          
          if (route.name === 'Dashboard' && focused) iconName = 'chart-box';
          
          return (
            <View style={ts.iconWrap}>
              <MaterialCommunityIcons name={iconName} size={24} color={focused ? COLORS.primary : '#94A3B8'} />
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

      {/* Hidden nested pages that still render the footer */}
      <Tab.Screen name="RegisterTruck" component={RegisterTruckScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
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
