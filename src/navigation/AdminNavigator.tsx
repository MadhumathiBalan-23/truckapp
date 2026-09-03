import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from './types';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { TruckApprovalScreen } from '../screens/admin/TruckApprovalScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { COLORS } from '../utils/theme';
import { View, Text, StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminNavigator: React.FC = () => {
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
          else if (route.name === 'Users') icon = '👥';
          else if (route.name === 'Trucks') icon = '🚛';
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
      <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Users" component={UserManagementScreen} />
      <Tab.Screen name="Trucks" component={TruckApprovalScreen} options={{ tabBarLabel: 'Approve' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
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
