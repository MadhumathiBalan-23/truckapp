import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DriverParamList, DriverTabParamList } from './types';
import { DriverDashboard } from '../screens/driver/DriverDashboard';
import { DriverTripsScreen } from '../screens/driver/DriverTripsScreen';
import { DriverHistoryScreen } from '../screens/driver/DriverHistoryScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen'; // shared panel
import { ActiveTripScreen } from '../screens/driver/ActiveTripScreen';
import { COLORS } from '../utils/theme';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createNativeStackNavigator<DriverParamList>();

const DriverTabNavigator: React.FC = () => {
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
          let label = '🧑‍✈️';
          if (route.name === 'Dashboard') label = '📊';
          if (route.name === 'Trips') label = '📦';
          if (route.name === 'History') label = '📜';
          if (route.name === 'Profile') label = '👤';
          return <Text style={{ fontSize: 20, color }}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DriverDashboard} />
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
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="DriverTabs" component={DriverTabNavigator} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
    </Stack.Navigator>
  );
};
