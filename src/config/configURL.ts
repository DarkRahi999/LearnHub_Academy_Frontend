export const API_BASE_URL = "http://localhost:8080";

//W---------{ User Endpoints }----------
export const USER_URLS = {
  getAll: `${API_BASE_URL}/users`,
  byId: (id: number) => `${API_BASE_URL}/users/${id}`,
  create: `${API_BASE_URL}/users`,
  update: (id: number) => `${API_BASE_URL}/users/${id}`,
  delete: (id: number) => `${API_BASE_URL}/users/${id}`,
};
