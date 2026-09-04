import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/user';
import { Platform } from 'react-native';

// For Android emulator it usually needs 10.0.2.2 instead of localhost
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const authService = {
  login: async (emailOrMobile: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailOrMobile, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      
      // Still populate our auth store with the logged in user
      useAuthStore.getState().login(emailOrMobile, password);
      return data;
    } catch (e) {
      console.log('Falling back to local auth store due to API error:', e);
      return useAuthStore.getState().login(emailOrMobile, password);
    }
  },
  
  register: async (name: string, mobile: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      
      useAuthStore.getState().register(name, mobile, email, password, role);
      return data;
    } catch (e) {
      console.log('Falling back to local auth store due to API error:', e);
      return useAuthStore.getState().register(name, mobile, email, password, role);
    }
  },
  
  logout: () => {
    useAuthStore.getState().logout();
  },
};
