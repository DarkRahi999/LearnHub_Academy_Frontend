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

export interface ExamAnswer {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
}

export interface ExamSubmissionResponse {
  success: boolean;
  message: string;
  answers: ExamAnswer[];
}

export interface ExamResult {
  id: number;
  user: number;
  exam: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  passed: boolean;
  answers: ExamAnswer[];
  isPractice: boolean;
  createdAt: Date;
  updatedAt: Date;
  examName?: string;
  submittedAt?: Date;
  userName?: string; // Added for admin report
}

export interface ExamStatistics {
  examId: number;
  examName?: string;
  totalParticipants: number;
  averageScore: number;
  passRate: number;
  highestScore: number;
  lowestScore: number;
}

// Add the missing ExamParticipation interface
export interface ExamParticipation {
  examId: number;
  examName: string;
  totalParticipants: number;
  participants: {
    userId: number;
    userName: string;
    score: number;
    percentage: number;
    passed: boolean;
    submittedAt: Date | null;
  }[];
}

export interface AdminReport {
  totalExams: number;
  totalResults: number;
  totalUsers: number;
  recentResults: ExamResult[];
  examStats: ExamStatistics[];
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
  async submitExamAnswers(examId: number, answers: { questionId: number; answer: string }[]): Promise<ExamSubmissionResponse> {
    try {
      const response = await examApi.post<ExamSubmissionResponse>(API_URLS.exams.submit(examId), { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      throw new Error('Failed to submit exam answers: ' + (error as Error).message);
    }
  }

  // Submit practice exam answers
  async submitPracticeExamAnswers(examId: number, answers: { questionId: number; answer: string }[]): Promise<ExamSubmissionResponse> {
    try {
      const response = await examApi.post<ExamSubmissionResponse>(`${API_URLS.exams.submit(examId)}/practice`, { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting practice exam answers:', error);
      throw new Error('Failed to submit practice exam answers: ' + (error as Error).message);
    }
  }

  // Get user's exam results
  async getUserExamResults(): Promise<ExamResult[]> {
    try {
      const response = await examApi.get<ExamResult[]>(`${API_BASE_URL}/api/exams/user/results`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user exam results:', error);
      throw new Error('Failed to fetch user exam results: ' + (error as Error).message);
    }
  }

  // Get user's exam history
  async getUserExamHistory(): Promise<ExamResult[]> {
    try {
      const response = await examApi.get<ExamResult[]>(`${API_BASE_URL}/api/exams/user/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user exam history:', error);
      throw new Error('Failed to fetch user exam history: ' + (error as Error).message);
    }
  }

  // Check if user has already attempted an exam
  async checkUserExamAttempt(examId: number): Promise<{ hasAttempted: boolean }> {
    try {
      const response = await examApi.get<{ hasAttempted: boolean }>(`${API_BASE_URL}/api/exams/${examId}/check-attempt`);
      return response.data;
    } catch (error) {
      console.error('Error checking exam attempt:', error);
      throw new Error('Failed to check exam attempt: ' + (error as Error).message);
    }
  }

  // Get admin report (admin only)
  async getAdminReport(): Promise<AdminReport> {
    try {
      const response = await examApi.get<AdminReport>(API_URLS.exams.adminReport);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin report:', error);
      throw new Error('Failed to fetch admin report: ' + (error as Error).message);
    }
  }

  // Get exam statistics (admin only)
  async getExamStatistics(): Promise<ExamStatistics[]> {
    try {
      const response = await examApi.get<ExamStatistics[]>(API_URLS.exams.statistics);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam statistics:', error);
      throw new Error('Failed to fetch exam statistics: ' + (error as Error).message);
    }
  }

  // Get specific exam statistics (admin only)
  async getSpecificExamStatistics(examId: number): Promise<ExamStatistics> {
    try {
      const response = await examApi.get<ExamStatistics>(`${API_BASE_URL}/api/exams/${examId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam statistics:', error);
      throw new Error('Failed to fetch exam statistics: ' + (error as Error).message);
    }
  }
  
  // Get exam participation data (admin only)
  async getExamParticipationData(): Promise<ExamParticipation[]> {
    try {
      const response = await examApi.get<ExamParticipation[]>(API_URLS.exams.participation);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam participation data:', error);
      throw new Error('Failed to fetch exam participation data: ' + (error as Error).message);
    }
  }
}

export const examService = new ExamService();
export default examService;