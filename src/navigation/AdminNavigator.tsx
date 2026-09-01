import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from './types';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { TruckApprovalScreen } from '../screens/admin/TruckApprovalScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen'; // shared panel
import { COLORS } from '../utils/theme';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminNavigator: React.FC = () => {
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
          let label = '🛠️';
          if (route.name === 'Dashboard') label = '📊';
          if (route.name === 'Users') label = '👥';
          if (route.name === 'Trucks') label = '🚛';
          if (route.name === 'Profile') label = '👤';
          return <Text style={{ fontSize: 20, color }}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Users" component={UserManagementScreen} />
      <Tab.Screen name="Trucks" component={TruckApprovalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
