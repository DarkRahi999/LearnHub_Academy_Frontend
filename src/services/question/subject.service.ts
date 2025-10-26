import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';
import { Subject, SubjectResponse, CreateSubjectDto, UpdateSubjectDto } from '@/interface/subject';

//W---------={ axios instance with proper configuration }=----------</br>
const subjectApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

//W---------={ Add request interceptor to include auth token }=----------</br>
subjectApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class SubjectService {

  //W---------={ Get all subjects }=----------</br>
  async getAllSubjects(): Promise<Subject[]> {
    try {
      const response = await subjectApi.get<Subject[]>(`/api/subjects`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw new Error('Failed to fetch subjects: ' + (error as Error).message);
    }
  }

  //W---------={ Get subject by id }=----------</br>
  async getSubjectById(id: number): Promise<SubjectResponse> {
    try {
      const response = await subjectApi.get<SubjectResponse>(`/api/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subject:', error);
      throw new Error('Failed to fetch subject: ' + (error as Error).message);
    }
  }

  //W---------={ Create subject }=----------</br>
  async createSubject(subjectData: CreateSubjectDto): Promise<Subject> {
    try {
      const response = await subjectApi.post<Subject>(`/api/subjects`, subjectData);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw new Error('Failed to create subject: ' + (error as Error).message);
    }
  }

  //W---------={ Update subject }=----------</br>
  async updateSubject(id: number, subjectData: UpdateSubjectDto): Promise<Subject> {
    try {
      const response = await subjectApi.put<Subject>(`/api/subjects/${id}`, subjectData);
      return response.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw new Error('Failed to update subject: ' + (error as Error).message);
    }
  }

  //W---------={ Delete subject }=----------</br>
  async deleteSubject(id: number): Promise<void> {
    try {
      await subjectApi.delete(`/api/subjects/${id}`);
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw new Error('Failed to delete subject: ' + (error as Error).message);
    }
  }
}

export const subjectService = new SubjectService();
export default subjectService;