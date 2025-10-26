import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';
import { Chapter, ChapterResponse, CreateChapterDto, UpdateChapterDto } from '@/interface/chapter';

//W---------={ axios instance with proper configuration }=----------</br>
const chapterApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

//W---------={ Add request interceptor to include auth token }=----------</br>
chapterApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ChapterService {

  //W---------={ Get all chapters }=----------</br>
  async getAllChapters(): Promise<Chapter[]> {
    try {
      const response = await chapterApi.get<Chapter[]>(`/api/chapters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw new Error('Failed to fetch chapters: ' + (error as Error).message);
    }
  }

  //W---------={ Get chapter by id }=----------</br>
  async getChapterById(id: number): Promise<ChapterResponse> {
    try {
      const response = await chapterApi.get<ChapterResponse>(`/api/chapters/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw new Error('Failed to fetch chapter: ' + (error as Error).message);
    }
  }

  //W---------={ Create chapter }=----------</br>
  async createChapter(chapterData: CreateChapterDto): Promise<Chapter> {
    try {
      const response = await chapterApi.post<Chapter>(`/api/chapters`, chapterData);
      return response.data;
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw new Error('Failed to create chapter: ' + (error as Error).message);
    }
  }

  //W---------={ Update chapter }=----------</br>
  async updateChapter(id: number, chapterData: UpdateChapterDto): Promise<Chapter> {
    try {
      const response = await chapterApi.put<Chapter>(`/api/chapters/${id}`, chapterData);
      return response.data;
    } catch (error) {
      console.error('Error updating chapter:', error);
      throw new Error('Failed to update chapter: ' + (error as Error).message);
    }
  }

  //W---------={ Delete chapter }=----------</br>
  async deleteChapter(id: number): Promise<void> {
    try {
      await chapterApi.delete(`/api/chapters/${id}`);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      throw new Error('Failed to delete chapter: ' + (error as Error).message);
    }
  }
}

export const chapterService = new ChapterService();
export default chapterService;