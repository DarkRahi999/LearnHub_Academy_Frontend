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
  users: {
    getAll: `${API_BASE_URL}/auth/users`,
    getById: (id: number) => `${API_BASE_URL}/auth/users/${id}`,
    create: `${API_BASE_URL}/auth/users/create`,
    update: (id: number) => `${API_BASE_URL}/auth/users/${id}`,
    updateRole: (id: number) => `${API_BASE_URL}/auth/users/${id}/role`,
    updateStatus: (id: number) => `${API_BASE_URL}/auth/users/${id}/status`,
    delete: (id: number) => `${API_BASE_URL}/auth/users/${id}`,
    bulkAction: `${API_BASE_URL}/auth/users/bulk-action`,
  },
  notices: {
    getAll: `${API_BASE_URL}/notices`,
    getById: (id: number) => `${API_BASE_URL}/notices/${id}`,
    create: `${API_BASE_URL}/notices`,
    update: (id: number) => `${API_BASE_URL}/notices/${id}`,
    delete: (id: number) => `${API_BASE_URL}/notices/${id}`,
  },
  posts: {
    getAll: `${API_BASE_URL}/posts`,
    getById: (id: number) => `${API_BASE_URL}/posts/${id}`,
    create: `${API_BASE_URL}/posts`,
    update: (id: number) => `${API_BASE_URL}/posts/${id}`,
    delete: (id: number) => `${API_BASE_URL}/posts/${id}`,
  },
  admins: {
    getAll: `${API_BASE_URL}/auth/admins`,
    promote: `${API_BASE_URL}/auth/admins/promote`,
    demote: `${API_BASE_URL}/auth/admins/demote`,
  },
};
