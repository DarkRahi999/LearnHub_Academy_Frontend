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
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  createdBy?: number;
  dateFrom?: string;
  dateTo?: string;
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
    
    // Add new filter parameters
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.createdBy) searchParams.append('createdBy', params.createdBy.toString());
    if (params.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.append('dateTo', params.dateTo);

    // For GET requests, we don't need to send authentication headers
    const url = `${API_BASE_URL}/courses?${searchParams.toString()}`;
    console.log('Fetching courses from:', url);
    
    try {
      const response = await fetch(url);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.error('Error response JSON:', errorData);
          throw new Error(errorData.message || `Failed to fetch courses: ${response.status} ${response.statusText}`);
        } catch {
          throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText} - ${errorText}`);
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
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