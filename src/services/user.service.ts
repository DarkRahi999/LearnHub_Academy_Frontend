import { API_URLS } from "@/config/configURL";
import { UserProfile, UserRole } from "@/interface/user";
import axios from "axios";

// Create axios instance with auth interceptor
const userApi = axios.create({
  baseURL: API_URLS.users.getAll.split('/auth')[0],
});

// Add request interceptor to include auth token
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh/errors
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//W---------={ User Management Interfaces }=----------
export interface UserSearchParams {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: UserProfile[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BulkActionRequest {
  userIds: string[];
  action: 'delete' | 'block' | 'unblock' | 'role_change';
  role?: UserRole;
}

export interface BulkActionResponse {
  message: string;
  results: {
    success: number;
    failed: number;
    errors: string[];
  };
}

//W---------={ GET ALL USERS }=----------
export const getAllUsers = async (params: UserSearchParams = {}): Promise<UserListResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.role) searchParams.append('role', params.role);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const url = `${API_URLS.users.getAll}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await userApi.get<UserListResponse>(url);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error fetching users:", err.response?.data || err.message);
    throw error;
  }
};

//W---------={ GET USER BY ID }=----------
export const getUserById = async (userId: number): Promise<UserProfile> => {
  try {
    const response = await userApi.get<{ user: UserProfile }>(API_URLS.users.getById(userId));
    return response.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error fetching user ${userId}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ UPDATE USER }=----------
export const updateUser = async (userId: number, userData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await userApi.put<{ user: UserProfile; message: string }>(
      API_URLS.users.update(userId), 
      userData
    );
    return response.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error updating user ${userId}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ UPDATE USER ROLE }=----------
export const updateUserRole = async (userId: number, role: UserRole): Promise<UserProfile> => {
  try {
    const response = await userApi.put<{ user: UserProfile; message: string }>(
      API_URLS.users.updateRole(userId), 
      { role }
    );
    return response.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error updating user role for ${userId}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ BLOCK/UNBLOCK USER }=----------
export const updateUserStatus = async (userId: number, isBlocked: boolean): Promise<UserProfile> => {
  try {
    const response = await userApi.put<{ user: UserProfile; message: string }>(
      API_URLS.users.updateStatus(userId), 
      { isBlocked }
    );
    return response.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error updating user status for ${userId}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ DELETE USER }=----------
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await userApi.delete<{ message: string }>(API_URLS.users.delete(userId));
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error deleting user ${userId}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ BULK USER ACTIONS }=----------
export const bulkUserAction = async (actionData: BulkActionRequest): Promise<BulkActionResponse> => {
  try {
    const response = await userApi.post<BulkActionResponse>(API_URLS.users.bulkAction, actionData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error performing bulk action:", err.response?.data || err.message);
    throw error;
  }
};

//W---------={ CREATE USER (ADMIN) }=----------
export interface CreateUserData {
  email: string;
  phone: string;
  firstName: string;
  lastName?: string;
  gender: string;
  role?: UserRole;
  dob?: string;
  nationality?: string;
  religion?: string;
  password: string;
  avatarUrl?: string;
}

export const createUser = async (userData: CreateUserData): Promise<UserProfile> => {
  try {
    const response = await userApi.post<{ user: UserProfile; message: string }>(
      API_URLS.users.create,
      {
        ...userData,
        acceptTerms: true // Always true for admin-created users
      }
    );
    return response.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error creating user:", err.response?.data || err.message);
    throw error;
  }
};

//W---------={ EXPORT USERS TO CSV }=----------
export const exportUsersToCSV = (users: UserProfile[]): void => {
  const headers = [
    'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 
    'Gender', 'Nationality', 'Religion', 'Blocked', 'Created At', 'Last Login'
  ];
  
  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      user.id,
      user.firstName || '',
      user.lastName || '',
      user.email,
      user.phone || '',
      user.role,
      user.gender || '',
      user.nationality || '',
      user.religion || '',
      (user as UserProfile & { isBlocked?: boolean }).isBlocked ? 'Yes' : 'No',
      (user as UserProfile & { createdAt?: string }).createdAt ? new Date((user as UserProfile & { createdAt: string }).createdAt).toLocaleDateString() : '',
      (user as UserProfile & { lastLoginAt?: string }).lastLoginAt ? new Date((user as UserProfile & { lastLoginAt: string }).lastLoginAt).toLocaleDateString() : 'Never'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

//W---------={ UTILITY FUNCTIONS }=----------
export const getUserRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.USER]: 'User',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.SUPER_ADMIN]: 'Super Admin'
  };
  return roleNames[role] || role;
};

export const getUserStatusDisplayName = (isBlocked: boolean): string => {
  return isBlocked ? 'Blocked' : 'Active';
};

export const formatLastLogin = (lastLoginAt: string | null): string => {
  if (!lastLoginAt) return 'Never';
  
  const date = new Date(lastLoginAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  
  return date.toLocaleDateString();
};