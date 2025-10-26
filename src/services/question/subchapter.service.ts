import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';
import { SubChapter, SubChapterResponse, CreateSubChapterDto, UpdateSubChapterDto } from '@/interface/subchapter';

//W---------={ axios instance with proper configuration }=----------</br>
const subChapterApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

//W---------={ Add request interceptor to include auth token }=----------</br>
subChapterApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class SubChapterService {

  //W---------={ Get all subchapters }=----------</br>
  async getAllSubChapters(): Promise<SubChapter[]> {
    try {
      const response = await subChapterApi.get<SubChapter[]>(`/api/subchapters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subchapters:', error);
      throw new Error('Failed to fetch subchapters: ' + (error as Error).message);
    }
  }

  //W---------={ Get subchapter by id }=----------</br>
  async getSubChapterById(id: number): Promise<SubChapterResponse> {
    try {
      const response = await subChapterApi.get<SubChapterResponse>(`/api/subchapters/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subchapter:', error);
      throw new Error('Failed to fetch subchapter: ' + (error as Error).message);
    }
  }

  //W---------={ Create subchapter }=----------</br>
  async createSubChapter(subChapterData: CreateSubChapterDto): Promise<SubChapter> {
    try {
      const response = await subChapterApi.post<SubChapter>(`/api/subchapters`, subChapterData);
      return response.data;
    } catch (error) {
      console.error('Error creating subchapter:', error);
      throw new Error('Failed to create subchapter: ' + (error as Error).message);
    }
  }

  //W---------={ Update subchapter }=----------</br>
  async updateSubChapter(id: number, subChapterData: UpdateSubChapterDto): Promise<SubChapter> {
    try {
      const response = await subChapterApi.put<SubChapter>(`/api/subchapters/${id}`, subChapterData);
      return response.data;
    } catch (error) {
      console.error('Error updating subchapter:', error);
      throw new Error('Failed to update subchapter: ' + (error as Error).message);
    }
  }

  //W---------={ Delete subchapter }=----------</br>
  async deleteSubChapter(id: number): Promise<void> {
    try {
      await subChapterApi.delete(`/api/subchapters/${id}`);
    } catch (error) {
      console.error('Error deleting subchapter:', error);
      throw new Error('Failed to delete subchapter: ' + (error as Error).message);
    }
  }
}

export const subChapterService = new SubChapterService();
export default subChapterService;