import { Question } from "./question";

export interface Exam {
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

export interface CreateExamDto {
  name: string;
  description?: string;
  examDate: string; // Date only (YYYY-MM-DD)
  startTime: string; // Time only (HH:MM)
  endTime: string; // Time only (HH:MM)
  duration: number; // in minutes
  totalQuestions: number; // total number of questions expected
  questionIds: number[]; // IDs of questions to include in the exam
}

export interface UpdateExamDto {
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

export interface ExamResponse {
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