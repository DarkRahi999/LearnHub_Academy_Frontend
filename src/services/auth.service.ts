import { API_URLS } from "@/config/configURL";
import { UserLogin, UserProfile, AuthResponse, UpdateAvatarDto } from "@/interface/user";
import axios from "axios";

// Create axios instance with default config
const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_API_URL || process.env.Backend_API_URL || 'http://localhost:8001',
});

// Add request interceptor to include auth token
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// LOGIN
export const loginUser = async (credentials: UserLogin): Promise<AuthResponse> => {
  try {
    const res = await authApi.post<AuthResponse>(API_URLS.auth.login, credentials);
    
    // Store token and user data in localStorage
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error logging in:", err.response?.data || err.message);
    throw error;
  }
};

// LOGOUT
export const logoutUser = async (): Promise<void> => {
  try {
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Call logout endpoint if available
    await authApi.post(API_URLS.auth.logout);
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error logging out:", err.response?.data || err.message);

    // Even if logout fails on server, clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};

// GET USER PROFILE
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const res = await authApi.get<{ user: UserProfile }>(API_URLS.auth.profile);
    return res.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error fetching user profile:", err.response?.data || err.message);
    throw error;
  }
};

// UPDATE AVATAR
export const updateUserAvatar = async (avatarData: UpdateAvatarDto): Promise<UserProfile> => {
  try {
    const res = await authApi.patch<{ user: UserProfile }>(API_URLS.auth.profile, avatarData);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error updating avatar:", err.response?.data || err.message);
    throw error;
  }
};

export const updateUserProfile = async (payload: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const res = await authApi.patch<{ user: UserProfile }>(API_URLS.auth.profile, payload);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error updating profile:", err.response?.data || err.message);
    throw error;
  }
};

// CHECK AUTH STATUS
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

// GET CURRENT USER
export const getCurrentUser = (): UserProfile | null => {
  try {
    // Check both possible storage keys for backward compatibility
    const userStr = localStorage.getItem('user') || localStorage.getItem('user_data');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// REFRESH TOKEN
export const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await authApi.post<{ access_token: string }>('/auth/refresh');
    const newToken = res.data.access_token;
    localStorage.setItem('access_token', newToken);
    return newToken;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error refreshing token:", err.response?.data || err.message);
    // If refresh fails, logout user
    logoutUser();
    return null;
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const res = await authApi.post<{ message: string }>(API_URLS.auth.forgotPassword, { email });
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error requesting password reset:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to send password reset OTP');
  }
};

// VERIFY OTP
export const verifyOtp = async (data: { email: string; otp: string }): Promise<{ message: string }> => {
  try {
    const res = await authApi.post<{ message: string }>(API_URLS.auth.verifyOtp, data);
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error verifying OTP:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to verify OTP');
  }
};

// RESET PASSWORD
export const resetPassword = async (data: { email: string; otp: string; newPassword: string; confirmPassword: string }): Promise<{ message: string }> => {
  try {
    const res = await authApi.post<{ message: string }>(API_URLS.auth.resetPassword, data);
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error resetting password:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to reset password');
  }
};
