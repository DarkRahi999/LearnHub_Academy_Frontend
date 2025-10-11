import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';

export interface Course {
  id: number;
  title: string;
  description: string;
  highlight: string;
  pointedText: string[];
  imageUrl?: string;
  price?: number;
  discountPrice?: number;
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
  pointedText: string[];
  imageUrl?: string;
  price?: number;
  discountPrice?: number;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  highlight?: string;
  pointedText?: string[];
  imageUrl?: string;
  price?: number;
  discountPrice?: number;
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

// Create axios instance with proper configuration
const courseApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token
courseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class CourseService {
  async getAllCourses(params: CourseSearchParams): Promise<CourseResponse> {
    try {
      const response = await courseApi.get<CourseResponse>('/api/courses', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses: ' + (error as Error).message);
    }
  }

  async getCourseById(id: number): Promise<Course> {
    try {
      const response = await courseApi.get<Course>(`/api/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course: ' + (error as Error).message);
    }
  }

  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    try {
      const response = await courseApi.post<Course>('/api/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course: ' + (error as Error).message);
    }
  }

  async updateCourse(id: number, courseData: UpdateCourseDto): Promise<Course> {
    try {
      const response = await courseApi.put<Course>(`/api/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course: ' + (error as Error).message);
    }
  }

  async deleteCourse(id: number): Promise<void> {
    try {
      await courseApi.delete(`/api/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course: ' + (error as Error).message);
    }
  }
}

export const courseService = new CourseService();
export default courseService;