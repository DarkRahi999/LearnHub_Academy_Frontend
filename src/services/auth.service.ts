import { API_URLS } from "@/config/configURL";
import { UserLogin, UserProfile, AuthResponse, UpdateAvatarDto } from "@/interface/user";
import axios from "axios";

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_URLS.auth.login.split('/auth')[0], // Get base URL
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
  (response) => response,
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

// ---------------- { LOGIN } ----------------
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

// ---------------- { LOGOUT } ----------------
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

// ---------------- { GET USER PROFILE } ----------------
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

// ---------------- { UPDATE AVATAR } ----------------
export const updateUserAvatar = async (avatarData: UpdateAvatarDto): Promise<UserProfile> => {
  try {
    const res = await authApi.patch<{ user: UserProfile }>(API_URLS.auth.updateAvatar, avatarData);
    
    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    return res.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error updating avatar:", err.response?.data || err.message);
    throw error;
  }
};

// ---------------- { CHECK AUTH STATUS } ----------------
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

// ---------------- { GET CURRENT USER } ----------------
export const getCurrentUser = (): UserProfile | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// ---------------- { REFRESH TOKEN } ----------------
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
