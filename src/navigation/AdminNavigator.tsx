import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from './types';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { TruckApprovalScreen } from '../screens/admin/TruckApprovalScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { COLORS } from '../utils/theme';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminNavigator: React.FC = () => {
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
          if (route.name === 'Dashboard') iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          else if (route.name === 'Users') iconName = focused ? 'account-group' : 'account-group-outline';
          else if (route.name === 'Trucks') iconName = focused ? 'truck' : 'truck-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'store' : 'store-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account-box' : 'account-box-outline';
          return (
            <View style={ts.iconWrap}>
              <MaterialCommunityIcons name={iconName} size={24} color={focused ? COLORS.primary : '#94A3B8'} />
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
