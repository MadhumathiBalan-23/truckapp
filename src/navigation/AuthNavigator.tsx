import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthParamList } from './types';
import { LandingScreen } from '../screens/auth/LandingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { SearchTruckScreen } from '../screens/customer/SearchTruckScreen';
import { TruckDetailsScreen } from '../screens/customer/TruckDetailsScreen';

const Stack = createNativeStackNavigator<AuthParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SearchTrucks" component={SearchTruckScreen as any} />
      <Stack.Screen name="TruckDetails" component={TruckDetailsScreen as any} />
    </Stack.Navigator>
  );
};
