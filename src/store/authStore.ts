import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/user';
import { MOCK_USERS } from '../data/mockUsers';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  rehydrated: boolean;
  initAuth: () => void;
  setRehydrated: (rehydrated: boolean) => void;
  login: (emailOrMobile: string, password: string) => Promise<boolean>;
  register: (name: string, mobile: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'INACTIVE') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      rehydrated: false,

      initAuth: () => {
        set({ rehydrated: true });
      },

      setRehydrated: (rehydrated) => set({ rehydrated }),

      login: async (emailOrMobile, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Find user by email or mobile
          const foundUserKey = Object.keys(MOCK_USERS).find((key) => {
            const user = MOCK_USERS[key];
            return (
              (user.email.toLowerCase() === emailOrMobile.toLowerCase() || user.mobile === emailOrMobile) &&
              user.passwordHash === password
            );
          });

          if (!foundUserKey) {
            set({ isLoading: false, error: 'Invalid credentials. Try again!' });
            return false;
          }

          const targetUser = MOCK_USERS[foundUserKey];

          if (targetUser.status === 'INACTIVE') {
            set({ isLoading: false, error: 'Your account has been deactivated. Please contact support.' });
            return false;
          }

          const userData: User = {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            mobile: targetUser.mobile,
            role: targetUser.role,
            status: targetUser.status,
            createdAt: targetUser.createdAt,
          };

          set({
            token: 'jwt_mock_token_for_' + targetUser.id,
            user: userData,
            isLoading: false,
          });
          return true;
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Something went wrong during login' });
          return false;
        }
      },

      register: async (name, mobile, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Check if email or mobile exists in MOCK_USERS
          const exists = Object.values(MOCK_USERS).some(
            (u) => u.email.toLowerCase() === email.toLowerCase() || u.mobile === mobile
          );

          if (exists) {
            set({ isLoading: false, error: 'User with this email or mobile already exists!' });
            return false;
          }

          const newId = `USR${String(Object.keys(MOCK_USERS).length + 1).padStart(3, '0')}`;

          // Mutate the mock database directly for session persistence
          MOCK_USERS[newId] = {
            id: newId,
            name,
            email,
            mobile,
            role,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            passwordHash: password,
          };

          const userData: User = {
            id: newId,
            name,
            email,
            mobile,
            role,
            status: 'ACTIVE',
            createdAt: MOCK_USERS[newId].createdAt,
          };

          set({
            token: 'jwt_mock_token_for_' + newId,
            user: userData,
            isLoading: false,
          });
          return true;
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Registration failed' });
          return false;
        }
      },

      logout: async () => {
        set({ token: null, user: null, error: null });
      },

      clearError: () => set({ error: null }),

      // Admin user management helper
      updateUserStatus: (userId, status) => {
        if (MOCK_USERS[userId]) {
          MOCK_USERS[userId].status = status;
          // In case the currently logged-in user status changed (for mock tests)
          const currentUser = get().user;
          if (currentUser && currentUser.id === userId) {
            set({
              user: { ...currentUser, status },
              error: status === 'INACTIVE' ? 'Your account has been deactivated.' : null,
            });
          }
        }
      },
    }),
    {
      name: 'truckgo-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setRehydrated(true);
      },
    }
  )
);
