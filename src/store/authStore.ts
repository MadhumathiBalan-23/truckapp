import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, ROLE_PRIVILEGES } from '../types/user';
import { MOCK_USERS } from '../data/mockUsers';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  rehydrated: boolean;
  activeOtpCode: string | null;
  otpTargetMobile: string | null;
  
  initAuth: () => void;
  setRehydrated: (rehydrated: boolean) => void;
  login: (emailOrMobile: string, password: string) => Promise<boolean>;
  sendOtp: (mobile: string) => Promise<{ success: boolean; otp: string; message: string }>;
  verifyOtpAndLogin: (mobile: string, otpCode: string, targetRole?: UserRole) => Promise<boolean>;
  register: (name: string, mobile: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  registerWithOtp: (name: string, mobile: string, email: string, password: string, role: UserRole, otpCode: string) => Promise<boolean>;
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
      activeOtpCode: null,
      otpTargetMobile: null,

      initAuth: () => {
        set({ rehydrated: true });
      },

      setRehydrated: (rehydrated) => set({ rehydrated }),

      // Password based login
      login: async (emailOrMobile, password) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 600));

          const cleanMobileOrEmail = emailOrMobile.trim();
          const foundUserKey = Object.keys(MOCK_USERS).find((key) => {
            const user = MOCK_USERS[key];
            return (
              (user.email.toLowerCase() === cleanMobileOrEmail.toLowerCase() || user.mobile === cleanMobileOrEmail) &&
              user.passwordHash === password
            );
          });

          if (!foundUserKey) {
            set({ isLoading: false, error: 'Invalid credentials. Please check details or use OTP Login.' });
            return false;
          }

          const targetUser = MOCK_USERS[foundUserKey];

          if (targetUser.status === 'INACTIVE') {
            set({ isLoading: false, error: 'Your account has been deactivated. Please contact admin.' });
            return false;
          }

          const roleMeta = ROLE_PRIVILEGES[targetUser.role];
          const userData: User = {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            mobile: targetUser.mobile,
            mobileVerified: true,
            role: targetUser.role,
            status: targetUser.status,
            createdAt: targetUser.createdAt,
            privileges: targetUser.privileges || roleMeta?.permissions || [],
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

      // Request OTP to Mobile Number
      sendOtp: async (mobile: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const cleanMobile = mobile.replace(/[^0-9]/g, '');

          if (cleanMobile.length < 10) {
            set({ isLoading: false, error: 'Please enter a valid 10-digit mobile number' });
            return { success: false, otp: '', message: 'Invalid mobile number' };
          }

          // Generate or use static demo OTP for testing ease
          const simulatedOtp = '1234';
          set({
            activeOtpCode: simulatedOtp,
            otpTargetMobile: cleanMobile,
            isLoading: false,
          });

          return {
            success: true,
            otp: simulatedOtp,
            message: `OTP sent successfully to +91 ${cleanMobile}`,
          };
        } catch (err: any) {
          set({ isLoading: false, error: 'Failed to send OTP' });
          return { success: false, otp: '', message: err?.message || 'Failed to send OTP' };
        }
      },

      // Verify OTP & Login directly via Mobile Number
      verifyOtpAndLogin: async (mobile: string, otpCode: string, targetRole?: UserRole) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 700));
          const cleanMobile = mobile.replace(/[^0-9]/g, '');

          if (otpCode !== '1234' && otpCode !== get().activeOtpCode) {
            set({ isLoading: false, error: 'Invalid OTP Code entered! Use 1234 for demo testing.' });
            return false;
          }

          // Search for existing user with this mobile number
          let foundUserKey = Object.keys(MOCK_USERS).find((key) => MOCK_USERS[key].mobile === cleanMobile);

          const roleToAssign: UserRole = targetRole || (foundUserKey ? MOCK_USERS[foundUserKey].role : 'CUSTOMER');
          const rolePermissions = ROLE_PRIVILEGES[roleToAssign].permissions;

          // Auto-create user if not found for smooth seamless testing under target role
          if (!foundUserKey) {
            const newId = `USR${String(Object.keys(MOCK_USERS).length + 1).padStart(3, '0')}`;
            MOCK_USERS[newId] = {
              id: newId,
              name: `${roleToAssign.charAt(0) + roleToAssign.slice(1).toLowerCase()} User (${cleanMobile.slice(-4)})`,
              email: `${roleToAssign.toLowerCase()}${cleanMobile}@truckgo.com`,
              mobile: cleanMobile,
              mobileVerified: true,
              role: roleToAssign,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              passwordHash: '123456',
              privileges: rolePermissions,
            };
            foundUserKey = newId;
          } else if (targetRole && MOCK_USERS[foundUserKey].role !== targetRole) {
            // Update role if explicitly selected for this login session
            MOCK_USERS[foundUserKey].role = targetRole;
            MOCK_USERS[foundUserKey].privileges = rolePermissions;
          }

          const targetUser = MOCK_USERS[foundUserKey];

          if (targetUser.status === 'INACTIVE') {
            set({ isLoading: false, error: 'Your account has been deactivated.' });
            return false;
          }

          const roleMeta = ROLE_PRIVILEGES[targetUser.role];
          const userData: User = {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            mobile: targetUser.mobile,
            mobileVerified: true,
            role: targetUser.role,
            status: targetUser.status,
            createdAt: targetUser.createdAt,
            privileges: targetUser.privileges || roleMeta?.permissions || [],
          };

          set({
            token: 'jwt_mock_token_for_' + targetUser.id,
            user: userData,
            isLoading: false,
            activeOtpCode: null,
            otpTargetMobile: null,
          });
          return true;
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'OTP verification failed' });
          return false;
        }
      },

      // Standard Registration
      register: async (name, mobile, email, password, role) => {
        return get().registerWithOtp(name, mobile, email, password, role, '1234');
      },

      // OTP verified Registration
      registerWithOtp: async (name, mobile, email, password, role, otpCode) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));

          if (otpCode !== '1234' && otpCode !== get().activeOtpCode) {
            set({ isLoading: false, error: 'Invalid OTP Code entered. Use 1234.' });
            return false;
          }

          const cleanMobile = mobile.replace(/[^0-9]/g, '');

          // Check if email or mobile exists in MOCK_USERS
          const exists = Object.values(MOCK_USERS).some(
            (u) => u.email.toLowerCase() === email.toLowerCase() || u.mobile === cleanMobile
          );

          if (exists) {
            set({ isLoading: false, error: 'User with this email or mobile already exists!' });
            return false;
          }

          const newId = `USR${String(Object.keys(MOCK_USERS).length + 1).padStart(3, '0')}`;
          const roleMeta = ROLE_PRIVILEGES[role];

          // Store new registered user in mock database
          MOCK_USERS[newId] = {
            id: newId,
            name,
            email,
            mobile: cleanMobile,
            mobileVerified: true,
            role,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            passwordHash: password,
            privileges: roleMeta?.permissions || [],
          };

          const userData: User = {
            id: newId,
            name,
            email,
            mobile: cleanMobile,
            mobileVerified: true,
            role,
            status: 'ACTIVE',
            createdAt: MOCK_USERS[newId].createdAt,
            privileges: roleMeta?.permissions || [],
          };

          set({
            token: 'jwt_mock_token_for_' + newId,
            user: userData,
            isLoading: false,
            activeOtpCode: null,
            otpTargetMobile: null,
          });
          return true;
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Registration failed' });
          return false;
        }
      },

      logout: async () => {
        set({ token: null, user: null, error: null, activeOtpCode: null, otpTargetMobile: null });
      },

      clearError: () => set({ error: null }),

      updateUserStatus: (userId, status) => {
        if (MOCK_USERS[userId]) {
          MOCK_USERS[userId].status = status;
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
