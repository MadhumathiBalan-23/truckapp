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

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createNativeStackNavigator<DriverParamList>();

const DriverTabNavigator: React.FC = () => {
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
          else if (route.name === 'Trips') icon = '📦';
          else if (route.name === 'History') icon = '📜';
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
      <Tab.Screen name="Dashboard" component={DriverDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Trips" component={DriverTripsScreen} />
      <Tab.Screen name="History" component={DriverHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
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
