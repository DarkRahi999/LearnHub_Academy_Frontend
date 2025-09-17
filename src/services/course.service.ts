import { API_BASE_URL } from '@/config/configURL';

export interface Course {
  id: number;
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  editedAt?: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName?: string;
  };
}

export interface CreateCourseDto {
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  highlight?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CourseSearchParams {
  search?: string;
  page: number;
  limit: number;
}

export interface CourseResponse {
  courses: Course[];
  total: number;
  page: number;
  totalPages: number;
}

class CourseService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllCourses(params: CourseSearchParams): Promise<CourseResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    searchParams.append('page', params.page.toString());
    searchParams.append('limit', params.limit.toString());

    // For GET requests, we don't need to send authentication headers
    const url = `${API_BASE_URL}/courses?${searchParams.toString()}`;
    console.log('Fetching courses from:', url);
    
    try {
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch courses');
      }
      
      const data = await response.json();
      console.log('Courses data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses: ' + (error as Error).message);
    }
  }

  async getCourseById(id: number): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch course');
    }

    return response.json();
  }

  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create course');
    }

    return response.json();
  }

  async updateCourse(id: number, courseData: UpdateCourseDto): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update course');
    }

    return response.json();
  }

  async deleteCourse(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete course');
    }
  }
}

export const courseService = new CourseService();
export default courseService;