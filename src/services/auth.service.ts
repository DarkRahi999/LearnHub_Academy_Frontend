import { API_URLS } from "@/config/configURL";
import { UserLogin, UserProfile, AuthResponse, UpdateAvatarDto } from "@/interface/user";
import axios from "axios";

//W---------={ Create axios instance with default config }=----------
const authApi = axios.create({
  baseURL: API_URLS.auth.login.split('/auth')[0],
});

//W---------={ Add request interceptor to include auth token }=----------
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//W---------={ Add response interceptor to handle token refresh }=----------
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
 //W---------={ Token expired or invalid, redirect to login }=----------
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//W-----------------------={ LOGIN }=--------------------------
export const loginUser = async (credentials: UserLogin): Promise<AuthResponse> => {
  try {
    const res = await authApi.post<AuthResponse>(API_URLS.auth.login, credentials);
    
 //W---------={ Store token and user data in localStorage }=----------
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error logging in:", err.response?.data || err.message);
    throw error;
  }
};

//W------------------------={ LOGOUT }=--------------------------
export const logoutUser = async (): Promise<void> => {
  try {
 //W---------={ Clear local storage }=----------
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
 //W---------={ Call logout endpoint if available }=----------
    await authApi.post(API_URLS.auth.logout);
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error logging out:", err.response?.data || err.message);

 //W---------={ Even if logout fails on server, clear local storage }=----------
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};

//W------------------={ GET USER PROFILE }=---------------------
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

//W--------------------------={ UPDATE AVATAR }=------------------------
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

//W------------------------={ CHECK AUTH STATUS }=------------------------
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

//W------------------------={ GET CURRENT USER }=------------------------
export const getCurrentUser = (): UserProfile | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

//W------------------------={ REFRESH TOKEN }=-------------------------
export const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await authApi.post<{ access_token: string }>('/auth/refresh');
    const newToken = res.data.access_token;
    localStorage.setItem('access_token', newToken);
    return newToken;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error refreshing token:", err.response?.data || err.message);
 //W---------{ If refresh fails, logout user }----------
    logoutUser();
    return null;
  }
};

//W------------------------={ FORGOT PASSWORD }=-------------------------
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

//W-----------------------={ RESET PASSWORD }=--------------------------
export const resetPassword = async (email: string, otp: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> => {
  try {
    const res = await authApi.post<{ message: string }>(API_URLS.auth.resetPassword, { 
      email, 
      otp, 
      newPassword, 
      confirmPassword 
    });
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error resetting password:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to reset password');
  }
};
