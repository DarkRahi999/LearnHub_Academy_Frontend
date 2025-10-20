import { UserProfile } from '@/interface/user';
import { API_BASE_URL } from '@/config/configURL';

export interface AdminSearchParams {
  search?: string;
  page: number;
  limit: number;
}

export interface AdminResponse {
  admins: UserProfile[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PromoteDemoteRequest {
  userId: string;
}

export interface AdminActionResponse {
  user: UserProfile;
  message: string;
}

class AdminService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllAdmins(params: AdminSearchParams): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    searchParams.append('page', params.page.toString());
    searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/auth/admins?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch admins');
    }

    return response.json();
  }

  async promoteToAdmin(userId: string): Promise<AdminActionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/admins/promote`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to promote user to admin');
    }

    return response.json();
  }

  async demoteAdmin(userId: string): Promise<AdminActionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/admins/demote`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to demote admin to user');
    }

    return response.json();
  }

  async getAdminStats(): Promise<{ totalAdmins: number; activeAdmins: number }> {
    try {
      const response = await this.getAllAdmins({ page: 1, limit: 1000 });
      const totalAdmins = response.total;
      const activeAdmins = response.admins.filter(admin => !admin.isBlocked).length;
      
      return { totalAdmins, activeAdmins };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return { totalAdmins: 0, activeAdmins: 0 };
    }
  }
}

export const adminService = new AdminService();
export default adminService;