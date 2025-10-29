import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';
import { CreateExamCourseDto, ExamCourse, ExamCourseResponse, UpdateExamCourseDto } from '@/interface/examCourse';

//W---------={ axios instance with proper configuration }=----------</br>
const courseApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

//W---------={ Add request interceptor to include auth token }=----------</br>
courseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ExamCourseService {

  //W---------={ Get all courses }=----------</br>
  async getAllExamCourses(): Promise<ExamCourse[]> {
    try {
      const response = await courseApi.get<ExamCourse[]>(`/api/examCourses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses: ' + (error as Error).message);
    }
  }

  //W---------={ Get course by id }=----------</br>
  async getExamCourseById(id: number): Promise<ExamCourseResponse> {
    try {
      const response = await courseApi.get<ExamCourseResponse>(`/api/examCourses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course: ' + (error as Error).message);
    }
  }

  //W---------={ Create course }=----------</br>
  async createExamCourse(courseData: CreateExamCourseDto): Promise<ExamCourse> {
    try {
      const response = await courseApi.post<ExamCourse>(`/api/examCourses`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course: ' + (error as Error).message);
    }
  }

  //W---------={ Update course }=----------</br>
  async updateExamCourse(id: number, courseData: UpdateExamCourseDto): Promise<ExamCourse> {
    try {
      const response = await courseApi.put<ExamCourse>(`/api/examCourses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course: ' + (error as Error).message);
    }
  }

  //W---------={ Delete course }=----------</br>
  async deleteExamCourse(id: number): Promise<void> {
    try {
      await courseApi.delete(`/api/examCourses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course: ' + (error as Error).message);
    }
  }
}

export const examCourseService = new ExamCourseService();
export default examCourseService;