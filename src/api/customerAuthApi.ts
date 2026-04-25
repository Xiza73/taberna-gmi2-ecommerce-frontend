/**
 * Cliente HTTP para auth de customer (`/auth/*`).
 *
 * Equivalente al `staffAuthApi.ts` del backoffice pero apuntando a los
 * endpoints customer-facing del back. Las firmas son finales — la
 * implementación de las pantallas vive en `features/auth/*`.
 */

import type {
  AuthTokens,
  ChangePasswordInput,
  CustomerMe,
  ForgotPasswordInput,
  GoogleAuthInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '@/types/auth';
import { apiClient } from './client';
import { clearTokens, setTokens } from './tokens';

export const customerAuthApi = {
  async register(input: RegisterInput): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>('/auth/register', input, {
      skipAuth: true,
    });
    setTokens(tokens);
    return tokens;
  },

  async login(input: LoginInput): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>('/auth/login', input, {
      skipAuth: true,
    });
    setTokens(tokens);
    return tokens;
  },

  async loginWithGoogle(input: GoogleAuthInput): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>('/auth/google', input, {
      skipAuth: true,
    });
    setTokens(tokens);
    return tokens;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  me(): Promise<CustomerMe> {
    return apiClient.get<CustomerMe>('/auth/me');
  },

  forgotPassword(input: ForgotPasswordInput): Promise<void> {
    return apiClient.post<void>('/auth/forgot-password', input, { skipAuth: true });
  },

  resetPassword(input: ResetPasswordInput): Promise<void> {
    return apiClient.post<void>('/auth/reset-password', input, { skipAuth: true });
  },

  updateProfile(input: UpdateProfileInput): Promise<CustomerMe> {
    return apiClient.patch<CustomerMe>('/customers/profile', input);
  },

  changePassword(input: ChangePasswordInput): Promise<void> {
    return apiClient.patch<void>('/customers/change-password', input);
  },
};
