/**
 * Authentication utilities
 */

import { apiPost, apiGet } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "HEAD_CLIENT_SUCCESS" | "HEAD_EAS" | "EA" | "CLIENT";
  isActive: boolean;
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
  redirect?: boolean;
}

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return apiPost<LoginResponse>("/api/auth/sign-in/email", credentials);
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await apiPost("/api/auth/sign-out");
};

/**
 * Get current user session
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await apiGet<{ user: User | null }>("/api/auth/get-session");
    return response.user;
  } catch {
    return null;
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiPost("/api/auth/forgot-password", { email });
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await apiPost("/api/auth/reset-password", { token, password: newPassword });
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<void> => {
  await apiGet(`/api/auth/verify-email?token=${token}`);
};

