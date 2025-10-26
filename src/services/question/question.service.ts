import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';
import { Question, QuestionResponse, CreateQuestionDto, UpdateQuestionDto } from '@/interface/question';

//W---------={ axios instance with proper configuration }=----------</br>
const questionApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

//W---------={ Add request interceptor to include auth token }=----------</br>
questionApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class QuestionService {

  //W---------={ Get all questions }=----------</br>
  async getAllQuestions(): Promise<Question[]> {
    try {
      const response = await questionApi.get<Question[]>(`/api/questions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions: ' + (error as Error).message);
    }
  }

  //W---------={ Get question by id }=----------</br>
  async getQuestionById(id: number): Promise<QuestionResponse> {
    try {
      const response = await questionApi.get<QuestionResponse>(`/api/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw new Error('Failed to fetch question: ' + (error as Error).message);
    }
  }

  //W---------={ Create question }=----------</br>
  async createQuestion(questionData: CreateQuestionDto): Promise<Question> {
    try {
      const response = await questionApi.post<Question>(`/api/questions`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Failed to create question: ' + (error as Error).message);
    }
  }

  //W---------={ Update question }=----------</br>
  async updateQuestion(id: number, questionData: UpdateQuestionDto): Promise<Question> {
    try {
      const response = await questionApi.put<Question>(`/api/questions/${id}`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw new Error('Failed to update question: ' + (error as Error).message);
    }
  }

  //W---------={ Delete question }=----------</br>
  async deleteQuestion(id: number): Promise<void> {
    try {
      await questionApi.delete(`/api/questions/${id}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw new Error('Failed to delete question: ' + (error as Error).message);
    }
  }
}

export const questionService = new QuestionService();
export default questionService;