// Use NEXT_PUBLIC_ prefix for environment variables accessible in browser
export const API_BASE_URL = process.env.NEXT_PUBLIC_Backend_API_URL || process.env.Backend_API_URL || 'http://localhost:8001';

export const API_URLS = {
  signup: {
    byId: (id: number) => `${API_BASE_URL}/api/auth/signup/${id}`,
    create: `${API_BASE_URL}/api/auth/signup`,
    update: (id: number) => `${API_BASE_URL}/api/auth/signup/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/auth/signup/${id}`,
  },
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    profile: `${API_BASE_URL}/api/auth/profile`,
    register: `${API_BASE_URL}/api/auth/signup`,
    forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
  },
  users: {
    getAll: `${API_BASE_URL}/api/auth/users`,
    getById: (id: number) => `${API_BASE_URL}/api/auth/users/${id}`,
    create: `${API_BASE_URL}/api/auth/users/create`,
    update: (id: number) => `${API_BASE_URL}/api/auth/users/${id}`,
    updateRole: (id: number) => `${API_BASE_URL}/api/auth/users/${id}/role`,
    updateStatus: (id: number) => `${API_BASE_URL}/api/auth/users/${id}/status`,
    delete: (id: number) => `${API_BASE_URL}/api/auth/users/${id}`,
    bulkAction: `${API_BASE_URL}/api/auth/users/bulk-action`,
  },
  notices: {
    getAll: `${API_BASE_URL}/api/notices`,
    getById: (id: number) => `${API_BASE_URL}/api/notices/${id}`,
    create: `${API_BASE_URL}/api/notices`,
    update: (id: number) => `${API_BASE_URL}/api/notices/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/notices/${id}`,
    getUnreadCount: `${API_BASE_URL}/api/notices/unread/count`,
  },
  admins: {
    getAll: `${API_BASE_URL}/api/auth/admins`,
    promote: `${API_BASE_URL}/api/auth/admins/promote`,
    demote: `${API_BASE_URL}/api/auth/admins/demote`,
  },
  courses: {
    getAll: `${API_BASE_URL}/api/courses`,
    getById: (id: number) => `${API_BASE_URL}/api/courses/${id}`,
    create: `${API_BASE_URL}/api/courses`,
    update: (id: number) => `${API_BASE_URL}/api/courses/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/courses/${id}`,
  },
  books: {
    getAll: `${API_BASE_URL}/api/books`,
    getById: (id: number) => `${API_BASE_URL}/api/books/${id}`,
    create: `${API_BASE_URL}/api/books`,
    update: (id: number) => `${API_BASE_URL}/api/books/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/books/${id}`,
  },
};