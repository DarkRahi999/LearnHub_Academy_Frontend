import { API_BASE_URL } from '@/config/configURL';

export interface Notice {
  id: number;
  subHeading: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  editedAt?: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
  };
  isRead?: boolean;
  readAt?: string;
}

export interface CreateNoticeDto {
  subHeading: string;
  description: string;
}

export interface UpdateNoticeDto {
  subHeading?: string;
  description?: string;
}

class NoticeService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAllNotices(): Promise<{ notices: Notice[] }> {
    const response = await fetch(`${API_BASE_URL}/notices`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch notices`);
    }

    return response.json();
  }

  async getNoticeById(id: number): Promise<Notice> {
    const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch notice`);
    }

    return response.json();
  }

  async createNotice(noticeData: CreateNoticeDto): Promise<Notice> {
    const response = await fetch(`${API_BASE_URL}/notices`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create notice`);
    }

    return response.json();
  }

  async updateNotice(id: number, noticeData: UpdateNoticeDto): Promise<Notice> {
    const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update notice`);
    }

    return response.json();
  }

  async deleteNotice(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete notice`);
    }

    return response.json();
  }

  // Notification methods
  async markNoticeAsRead(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/notices/${id}/read`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to mark notice as read`);
    }

    return response.json();
  }

  async getUnreadNoticesCount(): Promise<{ unreadCount: number }> {
    const response = await fetch(`${API_BASE_URL}/notices/unread/count`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get unread count`);
    }

    return response.json();
  }
}

export const noticeService = new NoticeService();
