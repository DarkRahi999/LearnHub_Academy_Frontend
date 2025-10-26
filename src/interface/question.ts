export interface Question {
  id: number;
  name: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  description?: string;
  subChapterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionDto {
  name: string;
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
}

export interface UpdateQuestionDto {
  name?: string;
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
}

export interface QuestionResponse {
  id: number;
  name: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  description?: string;
  courseId: number;
  groupId: number;
  subjectId: number;
  chapterId: number;
  subChapterId: number;
  createdAt: Date;
  updatedAt: Date;
}