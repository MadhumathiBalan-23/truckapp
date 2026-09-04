import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { VendorNavigator } from './VendorNavigator';
import { DriverNavigator } from './DriverNavigator';
import { AdminNavigator } from './AdminNavigator';
import { MobileFrame } from '../components/common/MobileFrame';
import { COLORS } from '../utils/theme';

export const RootNavigator: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = Boolean(user && token);
  const initAuth = useAuthStore((state) => state.initAuth);
  const rehydrated = useAuthStore((state) => state.rehydrated);

  useEffect(() => {
    initAuth();
  }, []);

  if (!rehydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const renderNavigator = () => {
    if (!isAuthenticated || !user) {
      return <AuthNavigator />;
    }

    switch (user.role) {
      case 'CUSTOMER':
        return <CustomerNavigator />;
      case 'VENDOR':
        return <VendorNavigator />;
      case 'DRIVER':
        return <DriverNavigator />;
      case 'ADMIN':
        return <AdminNavigator />;
      default:
        return <AuthNavigator />;
    }
  };

  return (
    <NavigationContainer>
      <MobileFrame>
        {renderNavigator()}
      </MobileFrame>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
