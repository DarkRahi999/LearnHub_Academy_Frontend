import { API_URLS } from "@/config/configURL";
import { 
  SystemSetting, 
  CreateSystemSettingData, 
  UpdateSystemSettingData,
  SystemSettingValue,
  SettingCategory 
} from "@/interface/system-settings";
import axios from "axios";

// Create axios instance with auth interceptor
const systemSettingsApi = axios.create({
  baseURL: API_URLS.systemSettings.getAll,
});

// Add request interceptor to include auth token
systemSettingsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
systemSettingsApi.interceptors.response.use(
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

//W---------={ GET ALL SETTINGS }=----------
export const getAllSystemSettings = async (category?: SettingCategory): Promise<SystemSetting[]> => {
  try {
    const params = category ? { category } : {};
    const response = await systemSettingsApi.get<SystemSetting[]>('', { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error fetching system settings:", err.response?.data || err.message);
    throw error;
  }
};

//W---------={ GET PUBLIC SETTINGS }=----------
export const getPublicSystemSettings = async (): Promise<SystemSetting[]> => {
  try {
    const response = await axios.get<SystemSetting[]>(API_URLS.systemSettings.getPublic);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error fetching public system settings:", err.response?.data || err.message);
    throw error;
  }
};

//W---------={ GET SETTINGS BY CATEGORY }=----------
export const getSystemSettingsByCategory = async (category: SettingCategory): Promise<SystemSetting[]> => {
  try {
    const response = await systemSettingsApi.get<SystemSetting[]>(`/categories/${category}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error fetching settings for category ${category}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ GET SETTING BY KEY }=----------
export const getSystemSettingByKey = async (key: string): Promise<SystemSetting> => {
  try {
    const response = await systemSettingsApi.get<SystemSetting>(`/${key}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error fetching setting ${key}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ GET SETTING VALUE }=----------
export const getSystemSettingValue = async (key: string): Promise<unknown> => {
  try {
    const response = await systemSettingsApi.get<SystemSettingValue>(`/${key}/value`);
    return response.data.value;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error fetching setting value ${key}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ CREATE SETTING }=----------
export const createSystemSetting = async (settingData: CreateSystemSettingData): Promise<SystemSetting> => {
  try {
    const response = await systemSettingsApi.post<SystemSetting>('', settingData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error creating system setting:", err.response?.data || err.message);
    throw error;
  }
};

//W---------={ UPDATE SETTING }=----------
export const updateSystemSetting = async (key: string, settingData: UpdateSystemSettingData): Promise<SystemSetting> => {
  try {
    const response = await systemSettingsApi.put<SystemSetting>(`/${key}`, settingData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error updating system setting ${key}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ UPDATE SETTING VALUE }=----------
export const updateSystemSettingValue = async (key: string, value: unknown): Promise<void> => {
  try {
    await systemSettingsApi.put(`/${key}/value`, { value });
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error updating setting value ${key}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ DELETE SETTING }=----------
export const deleteSystemSetting = async (key: string): Promise<void> => {
  try {
    await systemSettingsApi.delete(`/${key}`);
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(`Error deleting system setting ${key}:`, err.response?.data || err.message);
    throw error;
  }
};

//W---------={ INITIALIZE DEFAULT SETTINGS }=----------
export const initializeDefaultSystemSettings = async (): Promise<void> => {
  try {
    await systemSettingsApi.post('/initialize');
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Error initializing default system settings:", err.response?.data || err.message);
    throw error;
  }
};

//W---------={ GROUP SETTINGS BY CATEGORY }=----------
export const groupSettingsByCategory = (settings: SystemSetting[]): Record<SettingCategory, SystemSetting[]> => {
  const grouped: Record<SettingCategory, SystemSetting[]> = {
    [SettingCategory.GENERAL]: [],
    [SettingCategory.EMAIL]: [],
    [SettingCategory.NOTIFICATION]: [],
    [SettingCategory.SECURITY]: [],
    [SettingCategory.MAINTENANCE]: [],
    [SettingCategory.APPEARANCE]: [],
  };

  settings.forEach(setting => {
    if (grouped[setting.category]) {
      grouped[setting.category].push(setting);
    }
  });

  return grouped;
};
