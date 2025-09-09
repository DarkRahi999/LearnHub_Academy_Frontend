export const API_BASE_URL = "http://localhost:8080/api";

export const API_URLS = {
  signup: {
    byId: (id: number) => `${API_BASE_URL}/signup/${id}`,
    create: `${API_BASE_URL}/signup`,
    update: (id: number) => `${API_BASE_URL}/signup/${id}`,
    delete: (id: number) => `${API_BASE_URL}/signup/${id}`,
  },
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    register: `${API_BASE_URL}/auth/register`,
  },
};
