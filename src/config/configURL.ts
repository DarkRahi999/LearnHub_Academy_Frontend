export const API_BASE_URL = process.env.Backend_API_URL || "http://localhost:8001/api";

export const API_URLS = {
  signup: {
    byId: (id: number) => `${API_BASE_URL}/auth/signup/${id}`,
    create: `${API_BASE_URL}/auth/signup`,
    update: (id: number) => `${API_BASE_URL}/auth/signup/${id}`,
    delete: (id: number) => `${API_BASE_URL}/auth/signup/${id}`,
  },
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/auth/profile`,
    register: `${API_BASE_URL}/auth/signup`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
  },
};
