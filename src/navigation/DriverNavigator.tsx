import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DriverParamList, DriverTabParamList } from './types';
import { DriverDashboard } from '../screens/driver/DriverDashboard';
import { DriverTripsScreen } from '../screens/driver/DriverTripsScreen';
import { DriverHistoryScreen } from '../screens/driver/DriverHistoryScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { ActiveTripScreen } from '../screens/driver/ActiveTripScreen';
import { COLORS } from '../utils/theme';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createNativeStackNavigator<DriverParamList>();

const DriverTabNavigator: React.FC = () => {
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
          if (route.name === 'Dashboard') iconName = focused ? 'chart-box' : 'chart-box-outline';
          else if (route.name === 'Trips') iconName = focused ? 'package-variant-closed' : 'package-variant';
          else if (route.name === 'History') iconName = focused ? 'history' : 'clock-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
          return (
            <View style={ts.iconWrap}>
              <MaterialCommunityIcons name={iconName} size={24} color={focused ? COLORS.primary : '#94A3B8'} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DriverDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Trips" component={DriverTripsScreen} />
      <Tab.Screen name="History" component={DriverHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* Hidden nested pages that still render the footer */}
      <Tab.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
    </Tab.Navigator>
  );
};

export const DriverNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="DriverTabs"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}
    >
      <Stack.Screen name="DriverTabs" component={DriverTabNavigator} />
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
