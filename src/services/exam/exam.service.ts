import axios from 'axios';
import { API_BASE_URL, API_URLS } from '@/config/configURL';

// Create axios instance with proper configuration
const examApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token
examApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define types inline to avoid import issues
interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  description?: string;
  previousYearInfo?: string;
  subChapterId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Exam {
  id: number;
  name: string;
  description?: string;
  examDate: string; // Date only
  startTime: string; // Time only
  endTime: string; // Time only
  duration: number; // in minutes
  totalQuestions: number;
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateExamDto {
  name: string;
  description?: string;
  examDate: string; // Date only (YYYY-MM-DD)
  startTime: string; // Time only (HH:MM)
  endTime: string; // Time only (HH:MM)
  duration: number; // in minutes
  totalQuestions: number; // total number of questions expected
  questionIds: number[]; // IDs of questions to include in the exam
}

interface UpdateExamDto {
  name?: string;
  description?: string;
  examDate?: string; // Date only (YYYY-MM-DD)
  startTime?: string; // Time only (HH:MM)
  endTime?: string; // Time only (HH:MM)
  duration?: number; // in minutes
  totalQuestions?: number; // total number of questions expected
  questionIds?: number[]; // IDs of questions to include in the exam
  isActive?: boolean;
}

export interface StartExamResponse {
  success: boolean;
  message: string;
}

class ExamService {
  // Get all exams
  async getAllExams(): Promise<Exam[]> {
    try {
      const response = await examApi.get<Exam[]>(API_URLS.exams.getAll);
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw new Error('Failed to fetch exams: ' + (error as Error).message);
    }
  }

  // Get exam by id
  async getExamById(id: number): Promise<Exam> {
    try {
      const response = await examApi.get<Exam>(API_URLS.exams.getById(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching exam:', error);
      throw new Error('Failed to fetch exam: ' + (error as Error).message);
    }
  }

  // Create exam
  async createExam(examData: CreateExamDto): Promise<Exam> {
    try {
      const response = await examApi.post<Exam>(API_URLS.exams.create, examData);
      return response.data;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw new Error('Failed to create exam: ' + (error as Error).message);
    }
  }

  // Update exam
  async updateExam(id: number, examData: UpdateExamDto): Promise<Exam> {
    try {
      const response = await examApi.put<Exam>(API_URLS.exams.update(id), examData);
      return response.data;
    } catch (error) {
      console.error('Error updating exam:', error);
      throw new Error('Failed to update exam: ' + (error as Error).message);
    }
  }

  // Delete exam
  async deleteExam(id: number): Promise<void> {
    try {
      await examApi.delete(API_URLS.exams.delete(id));
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw new Error('Failed to delete exam: ' + (error as Error).message);
    }
  }

  // Start exam for a user
  async startExam(examId: number): Promise<StartExamResponse> {
    try {
      const response = await examApi.post<StartExamResponse>(API_URLS.exams.start(examId));
      return response.data;
    } catch (error) {
      console.error('Error starting exam:', error);
      throw new Error('Failed to start exam: ' + (error as Error).message);
    }
  }

  // Submit exam answers
  async submitExamAnswers(examId: number, answers: { questionId: number; answer: string }[]): Promise<any> {
    try {
      const response = await examApi.post(API_URLS.exams.submit(examId), { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      throw new Error('Failed to submit exam answers: ' + (error as Error).message);
    }
  }
}

export const examService = new ExamService();
export default examService;