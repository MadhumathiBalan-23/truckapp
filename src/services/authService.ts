import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/user';

export const authService = {
  login: (emailOrMobile: string, password: string) =>
    useAuthStore.getState().login(emailOrMobile, password),
  register: (name: string, mobile: string, email: string, password: string, role: UserRole) =>
    useAuthStore.getState().register(name, mobile, email, password, role),
  logout: () =>
    useAuthStore.getState().logout(),
};
