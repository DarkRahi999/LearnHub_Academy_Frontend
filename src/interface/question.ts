export interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  description?: string;
  previousYearInfo?: string; // Stores information about when this question previously appeared (year, board, etc.)
  subChapterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionDto {
  courseId: number;
  groupId: number;
  subjectId: number;
  chapterId: number;
  subChapterId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  description?: string;
  previousYearInfo?: string; // Stores information about when this question previously appeared (year, board, etc.)
}

export interface UpdateQuestionDto {
  courseId?: number;
  groupId?: number;
  subjectId?: number;
  chapterId?: number;
  subChapterId?: number;
  questionText?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
  description?: string;
  previousYearInfo?: string; // Stores information about when this question previously appeared (year, board, etc.)
}

export interface QuestionResponse {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  description?: string;
  previousYearInfo?: string; // Stores information about when this question previously appeared (year, board, etc.)
  courseId: number;
  groupId: number;
  subjectId: number;
  chapterId: number;
  subChapterId: number;
  createdAt: Date;
  updatedAt: Date;
}